import { NextFunction, Request, Response } from "express";
import { VehicleModel } from "../../users/models/vehicles.model";
import { ErrorMsg } from "../../common/utils";
import { Status, VehicleType } from "../../common/types";

export enum VehicleCheckMode {
  BASIC = "basic",
  FULL = "full"
}

// 🚦 Definición de pico y placa
const restrictionDays: { [key in VehicleType]: { [key: string]: string[] } } = {
  car: {
    Monday: ["0", "2"],
    Tuesday: ["6", "9"],
    Wednesday: ["3", "7"],
    Thursday: ["4", "8"],
    Friday: ["1", "5"]
  },
  motorbike: {
    Monday: ["0", "2"],
    Tuesday: ["6", "9"],
    Wednesday: ["3", "7"],
    Thursday: ["4", "8"],
    Friday: ["1", "5"]
  },
  bike: {}
};

/**
 * Middleware que valida un vehículo.
 * @param mode BASIC → existencia, estado y placas.
 *             FULL → además documentos, verificación y vencimientos.
 */
export const checkVehicle =
  (mode: VehicleCheckMode = VehicleCheckMode.BASIC) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.vehicle_uid;
      if (!vehicleId) throw new ErrorMsg("Tu vehículo no está registrado aún.", 403);

      const vehicle = await VehicleModel.findById(vehicleId);
      if (!vehicle) throw new ErrorMsg("Vehículo no encontrado.", 404);

      if (vehicle.status_request !== Status.ACCEPTED) {
        throw new ErrorMsg("El vehículo aún no ha sido aprobado.", 403);
      }

      // Validaciones FULL
      if (mode === VehicleCheckMode.FULL) {
        if (!vehicle.property_card?.verified) {
          throw new ErrorMsg("La tarjeta de propiedad no está verificada.", 403);
        }
        if (!vehicle.mandatory_insurance?.verified) {
          throw new ErrorMsg("El seguro obligatorio no está verificado.", 403);
        }
        if (!vehicle.technical_mechanical?.verified) {
          throw new ErrorMsg("La revisión técnico-mecánica no está verificada.", 403);
        }

        // Expiración de documentos
        const now = new Date();
        if (vehicle.mandatory_insurance.expiration_date < now) {
          vehicle.mandatory_insurance.verified = false;
          vehicle.status_request = Status.PENDING;
          await vehicle.save();
          throw new ErrorMsg("El seguro obligatorio está vencido.", 403);
        }

        if (vehicle.technical_mechanical.expiration_date < now) {
          vehicle.technical_mechanical.verified = false;
          vehicle.status_request = Status.PENDING;
          await vehicle.save();
          throw new ErrorMsg("La revisión técnico-mecánica está vencida.", 403);
        }
      }

      // Validar placas
      if (!vehicle.plates) {
        throw new ErrorMsg("El vehículo debe tener placas registradas.", 403);
      }

      // 🚦 Validación de pico y placa
      const currentDate = new Date();
      const currentDay = currentDate.toLocaleString("en-US", {
        weekday: "long"
      }) as keyof typeof restrictionDays.car;
      const currentHour = currentDate.getHours();

      const plateRestriction = restrictionDays[vehicle.type]?.[currentDay] || [];

      switch (vehicle.type) {
        case VehicleType.car: {
          const lastDigit = vehicle.plates.charAt(vehicle.plates.length - 1);
          if (
            plateRestriction.includes(lastDigit) &&
            currentHour >= 5 &&
            currentHour <= 20
          ) {
            throw new ErrorMsg("Este carro no puede circular hoy por pico y placa.", 403);
          }
          break;
        }

        case VehicleType.motorbike: {
          const firstDigit = vehicle.plates.charAt(4); // suponiendo formato ABC12D
          if (
            plateRestriction.includes(firstDigit) &&
            currentHour >= 5 &&
            currentHour <= 20
          ) {
            throw new ErrorMsg(
              "Esta moto no puede circular hoy por pico y placa.",
              403
            );
          }
          break;
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
