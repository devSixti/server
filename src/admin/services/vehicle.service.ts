import { VehicleModel } from "../../users/models";
import { PaginationDto } from "../../common/dto";
import { AsyncCustomResponse, Status } from "../../common/types";
import { ErrorMsg, paginationResults } from "../../common/utils";
import { validateField } from "../../common/helpers";

export class VehicleService {
  // Aprobar vehículo
  static async approve(vehicleId: string): AsyncCustomResponse {
    try {
      if (!vehicleId) {
        throw new ErrorMsg("El ID del vehículo es obligatorio.", 400);
      }

      const vehicle = await VehicleModel.findById(vehicleId).populate({
        path: "driver",
        populate: { path: "user_info" },
      });

      if (!vehicle) {
        throw new ErrorMsg(
          "Vehículo no encontrado. Verifique la información e intente nuevamente.",
          404
        );
      }

      if (vehicle.status_request === Status.ACCEPTED) {
        throw new ErrorMsg("El vehículo ya fue aprobado previamente.", 400);
      }

      validateField(
        vehicle!.property_card.front_picture,
        "La foto frontal de la tarjeta de propiedad es obligatoria."
      );
      validateField(
        vehicle!.property_card.back_picture,
        "La foto trasera de la tarjeta de propiedad es obligatoria."
      );
      validateField(
        vehicle!.mandatory_insurance.picture,
        "La foto del seguro obligatorio es obligatoria."
      );
      validateField(
        vehicle!.mandatory_insurance.expiration_date,
        "La fecha de vencimiento del seguro obligatorio es obligatoria."
      );
      validateField(
        vehicle!.technical_mechanical.picture,
        "La foto del certificado técnico-mecánico es obligatoria."
      );

      vehicle.status_request = Status.ACCEPTED;
      vehicle.property_card.verified = true;
      vehicle.mandatory_insurance.verified = true;
      vehicle.technical_mechanical.verified = true;

      await vehicle.save();

      return {
        message: "Vehículo aprobado exitosamente.",
        info: {
          vehicle,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los vehículos
  static async getAll(paginationDto: PaginationDto): AsyncCustomResponse {
    try {
      const { pageNumber = 1, pageSize = 10 } = paginationDto;

      const page = Number(pageNumber);
      const limit = Number(pageSize);

      const totalItems = await VehicleModel.countDocuments();

      const vehicles = await VehicleModel.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("driver");

      return {
        message: "Vehículos obtenidos correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: vehicles.length,
            totalItems,
            currentPage: page,
            pageSize: limit,
          }),
          vehicles,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener vehículos por ID de conductor
  static async getByDriverId(driverId: string): AsyncCustomResponse {
    try {
      if (!driverId) {
        throw new ErrorMsg("El ID del conductor es obligatorio.", 400);
      }

      const vehicles = await VehicleModel.find({
        driver_id: driverId,
      }).populate({
        path: "driver",
        populate: {
          path: "user_info",
        },
      });

      const totalVehicles = await VehicleModel.countDocuments({
        driver_id: driverId,
      });

      return {
        message: "Vehículos obtenidos correctamente.",
        info: {
          pagination: paginationResults({
            currentCount: vehicles.length,
            totalItems: totalVehicles,
            currentPage: 1,
            pageSize: 1,
          }),
          vehicles,
        },
      };
    } catch (error) {
      console.error("Error al obtener vehículos por ID de conductor:", error);
      throw error;
    }
  }
}

