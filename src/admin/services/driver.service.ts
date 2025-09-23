import { DriverModel, UserModel, VehicleModel } from "../../users/models";
import { commonServices } from "../../users/services";
import { approvedEmailBody, rejectedEmailBody } from "../emails";
import { PaginationDto, SearchParamsDto } from "../../common/dto";
import { AsyncCustomResponse, Status } from "../../common/types";
import { ErrorMsg, paginationResults } from "../../common/utils";
import { validateField } from "../../common/helpers";

export class DriverService {
  // Funcion para aprobar un conductor
  static async approve(driverId: string): AsyncCustomResponse {
    let driver;
    try {
      // 1. Busqua al conductor por ID y completa la información del usuario
      driver = await DriverModel.findById(driverId).populate("user_info");

      // 2. Complueba si el conductor existe
      if (!driver) {
        throw new ErrorMsg(
          "Conductor no encontrado. Verifica la información e inténtalo nuevamente.",
          404
        );
      }

      // 3. Verifica si el conductor ya ha sido aprobado
      if (driver!.user_info!.document.verified === true) {
        throw new ErrorMsg("El conductor ya se encuentra aprobado.", 400);
      }

      // Valida que todos los campos necesarios estén presentes
      validateField(
        driver.user_info!.document.document_id,
        "No se ha subido el documento de identidad del conductor."
      );
      validateField(
        driver.user_info!.document.front_picture,
        "No se ha subido la foto frontal del documento del conductor."
      );
      validateField(
        driver.user_info!.document.back_picture,
        "No se ha subido la foto trasera del documento del conductor."
      );
      validateField(
        driver.user_info!.email!.address,
        "El correo electrónico del conductor no está registrado."
      );
      validateField(
        driver.license.front_picture,
        "Falta subir la foto frontal de la licencia de conducir."
      );
      validateField(
        driver.license.back_picture,
        "Falta subir la foto trasera de la licencia de conducir."
      );
      validateField(
        driver.license.expiration_date,
        "Falta ingresar la fecha de vencimiento de la licencia de conducir."
      );
      validateField(
        driver.criminal_background.picture,
        "Falta subir la constancia de antecedentes penales."
      );

      // 12. Actualiza la información del usuario y del conductor

      await UserModel.findByIdAndUpdate(driver.user_info!._id, {
        "document.verified": true,
      });

      driver.license.verified = true;
      driver.criminal_background.verified = true;
      driver.is_available = true;
      driver.status_request = Status.ACCEPTED;

      // Guarda los cambios en el conductor
      await driver.save();

      await commonServices.sendEmail({
        to: driver!.user_info!.email!.address || "",
        subject: "Solicitud aprobada",
        htmlBody: approvedEmailBody(),
      });

      // 13. Devuelve una respuesta exitosa

      return { message: "Conductor aprobado exitosamente.", info: { driver } };
    } catch (error) {
      // Error handling
      console.error("Error al aprobar conductor:", error);
      if (driver) {
        driver.status_request = Status.REJECTED;
        await driver.save();
        await commonServices.sendEmail({
          to: driver!.user_info!.email!.address || "",
          subject: "Solicitud rechazada",
          htmlBody: rejectedEmailBody(
            "Solicitud rechazada: su solicitud ha sido rechazada debido a un error en la verificación"
          ),
        });
      }
      throw error;
    }
  }

  //Delete
  static async delete(driverInfo: any): AsyncCustomResponse {
    try {
      return { message: "Conductor eliminado exitosamente.", info: {} };
    } catch (error) {
      console.error("Error al eliminar conductor:", error);
      throw error;
    }
  }

  //Get all
  static async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    try {
      const { pageNumber = 1, pageSize = 10 } = paginationDto;

      const page = Number(pageNumber);
      const limit = Number(pageSize);

      const totalItems = await DriverModel.countDocuments();

      const users = await DriverModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user_info")
        .populate("vehicles");

      return {
        message: "Conductores obtenidos correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: users.length,
            totalItems,
            currentPage: page,
            pageSize: limit,
          }),
          users,
        },
      };
    } catch (error) {
      console.error("Error al obtener todos los conductores:", error);
      throw error;
    }
  }

  //Get by id
  static async search(searchDto: SearchParamsDto): AsyncCustomResponse {
    try {
      const { searchValue } = searchDto;

      let drivers = await DriverModel.find({}).populate({
        path: "user_info",
        match: {
          $or: [
            { first_name: { $regex: searchValue, $options: "i" } },
            { last_name: { $regex: searchValue, $options: "i" } },
            { nick_name: { $regex: searchValue, $options: "i" } },
            { country: { $regex: searchValue, $options: "i" } },
            { city: { $regex: searchValue, $options: "i" } },
            { "document.document_id": { $regex: searchValue, $options: "i" } },
            { "document.type": { $regex: searchValue, $options: "i" } },
            { "email.address": { $regex: searchValue, $options: "i" } },
            { "phone.country_code": { $regex: searchValue, $options: "i" } },
            { "phone.number": { $regex: searchValue, $options: "i" } },
          ],
        },
      });
      // .where("user_info").ne(null);
      drivers = drivers.filter((driver) => driver?.user_info !== null);

      return {
        message: "Conductores buscados correctamente",
        info: {
          pagination: paginationResults({
            currentCount: drivers.length,
            totalItems: drivers.length,
            currentPage: 1,
            pageSize: 1,
          }),
          drivers,
        },
      };
    } catch (error) {
      console.error("Error al buscar conductores:", error);
      throw error;
    }
  }

  
}
