import { DriverModel, UserModel, VehicleModel } from "../../users/models";
import { commonServices } from "../../users/services";
import { approvedEmailBody, rejectedEmailBody } from "../emails";
import { PaginationDto, SearchParamsDto } from "../../common/dto";
import { AsyncCustomResponse, Status } from "../../common/types";
import { ErrorMsg, paginationResults } from "../../common/utils";
import { validateField } from "../../common/helpers";

export class DriverService {
  /**
   * Función para aprobar un conductor
   * @param driverId - ID del conductor a aprobar
   * @returns AsyncCustomResponse con información del conductor aprobado
   */
  static async approve(driverId: string): AsyncCustomResponse {
    // Inicia una sesión de MongoDB para manejo de transacciones
    const session = await DriverModel.startSession();
    session.startTransaction();

    try {
      // Busca el conductor por ID y popula la información del usuario
      const driver = await DriverModel.findById(driverId)
        .populate("user_info")
        .session(session);

      // Validación: si no se encuentra el conductor, lanza error 404
      if (!driver) {
        throw new ErrorMsg("Conductor no encontrado.", 404);
      }

      // Validación: si ya fue aprobado, lanza error 400
      if (driver.user_info?.document?.verified) {
        throw new ErrorMsg("El conductor ya está aprobado.", 400);
      }

      // Validaciones de campos obligatorios
      const validations: [string | null, string][] = [
        [
          driver.user_info?.document?.document_id ?? null,
          "Falta documento de identidad",
        ],
        [
          driver.license.front_picture ?? null,
          "Falta foto frontal de licencia",
        ],
        [
          driver.license.expiration_date
            ? driver.license.expiration_date.toISOString()
            : null,
          "Falta fecha de vencimiento",
        ],
        [
          driver.criminal_background.picture ?? null,
          "Falta antecedentes penales",
        ],
      ];

      // Recorre cada validación y lanza error si algún campo es nulo o vacío
      validations.forEach(([field, msg]) => validateField(field, msg));

      // Actualiza el documento del usuario para marcarlo como verificado
      await UserModel.findByIdAndUpdate(
        driver.user_info!._id,
        { "document.verified": true },
        { session }
      );

      // Marca licencias y antecedentes como verificados, activa disponibilidad y cambia el estado
      driver.license.verified = true;
      driver.criminal_background.verified = true;
      driver.is_available = true;
      driver.status_request = Status.ACCEPTED;

      // Guarda los cambios en la base de datos dentro de la transacción
      await driver.save({ session });

      // Commit de la transacción
      await session.commitTransaction();
      session.endSession();

      // Enviar correo de aprobación fuera de la transacción
      await commonServices.sendEmail({
        to: driver.user_info?.email?.address || "",
        subject: "Solicitud aprobada",
        htmlBody: approvedEmailBody(),
      });
      // Retorna respuesta exitosa
      return {
        status: "success",
        message: "Conductor aprobado exitosamente.",
        info: { driver },
      };
    } catch (error) {
      // Abort de la transacción en caso de error
      await session.abortTransaction();
      session.endSession();
      console.error("Error al aprobar conductor:", error);
      throw error;
    }
  }
  /**
   * Función para desactivar un conductor
   */
  static async desactivate(driverId: string): AsyncCustomResponse {
    try {
      // Buscar al conductor por su ID y poblar `user_info` de forma segura
      const driver = await DriverModel.findById(driverId).populate("user_info");
      if (!driver) {
        return {
          status: "error",
          message: "Conductor no encontrado.",
          info: {},
        };
      }
      // Cambiar los valores del conductor según lo solicitado
      driver.is_available = false;
      driver.status_request = Status.REJECTED;
      // Desmarcar los documentos y antecedentes como verificados
      driver.license.verified = false;
      driver.criminal_background.verified = false;
      await driver.save();
      // Si `user_info` existe, actualizar el estado del usuario
      if (driver.user_info) {
        const user = await UserModel.findById(driver.user_info._id);

        if (user) {
          // Cambiar todos los campos 'true' a 'false'
          user.is_active = false;
          user.document.verified = false;
          if (user.email) {
            user.email.verified = false;
          }
          await user.save();
        }
      }
      // eliminar todos los vehículos asociados al conductor
      await VehicleModel.deleteMany({ driver_id: driver._id });
      return {
        status: "success",
        message: "Conductor desactivado exitosamente.",
        info: driver,
      };
    } catch (error) {
      console.error("Error al desactivar conductor:", error);
      throw error;
    }
  }
  /**
   * Función para obtener todos los conductores con paginación
   */
  static async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    try {
      const { pageNumber = 1, pageSize = 10 } = paginationDto;
      const page = Number(pageNumber);
      const limit = Number(pageSize);
      // Obtiene el total de conductores
      const totalItems = await DriverModel.countDocuments();
      // Consulta a la base de datos con skip/limit para paginación
      const users = await DriverModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user_info")
        .populate("vehicles");

      return {
        status: "success",
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
  /**
   * Función para buscar conductores por parámetros de búsqueda
   */
  static async search(searchDto: SearchParamsDto): AsyncCustomResponse {
    try {
      const { searchValue } = searchDto;
      // Busca todos los conductores y los popula con la info del usuario
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
      })
      // Filtra para eliminar conductores donde la info del usuario no se haya poblado
      drivers = drivers.filter(
        (d): d is typeof d & { user_info: NonNullable<typeof d.user_info> } =>
          d.user_info !== null && d.user_info !== undefined
      );
      // Separa conductores activos
      const activeDrivers = drivers.filter(
        (d) => d.user_info?.is_active === true
      );
      // Separa conductores inactivos
      const inactiveDrivers = drivers.filter(
        (d) => d.user_info?.is_active === false
      );
      // Si hay conductores activos encontrados, devuelve resultado exitoso con paginación
      if (activeDrivers.length > 0) {
        return {
          status: "success",
          message: "Conductores activos buscados correctamente",
          info: {
            pagination: paginationResults({
              currentCount: activeDrivers.length,
              totalItems: activeDrivers.length,
              currentPage: 1,
              pageSize: activeDrivers.length,
            }),
            drivers: activeDrivers,
          },
        };
      }
      // Si no hay activos pero sí inactivos, lanza un error indicando que existen pero están inactivos
      if (inactiveDrivers.length > 0) {
        throw new ErrorMsg("El conductor existe pero está inactivo", 403);
      }
      return {
        status: "success",
        message: "No se encontraron conductores que coincidan con la búsqueda.",
        info: { drivers: [] },
      };
    } catch (error) {
      console.error("Error al buscar conductores:", error);
      throw error;
    }
  }
}