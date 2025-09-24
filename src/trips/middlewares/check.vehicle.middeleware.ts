import { NextFunction, Request, Response } from "express";
import { VehicleModel } from "../../users/models/vehicles.model";
import { ErrorMsg } from "../../common/utils";
import { Status, VehicleType } from "../../common/types";

// Enum para indicar el tipo de validación de vehículo
export enum VehicleCheckMode {
  BASIC = "basic", // Solo existencia, estado y placas
  FULL = "full",   // Además verifica documentos y vencimientos
}
// Configuración de pico y placa según tipo de vehículo y día
const restrictionDays: Record<VehicleType, Record<string, string[]>> = {
  car: {
    Monday: ["0", "2"],
    Tuesday: ["6", "9"],
    Wednesday: ["3", "7"],
    Thursday: ["4", "8"],
    Friday: ["1", "5"],
  },
  motorbike: {
    Monday: ["0", "2"],
    Tuesday: ["6", "9"],
    Wednesday: ["3", "7"],
    Thursday: ["4", "8"],
    Friday: ["1", "5"],
  },
  bike: {},
};
// Función auxiliar que valida los documentos del vehículo y verifica que no estén vencidos
const validateVehicleDocuments = (vehicle: any) => {
  const now = new Date();

  if (!vehicle.property_card?.verified) {
    throw new ErrorMsg("La tarjeta de propiedad no está verificada.", 403);
  }
  if (!vehicle.mandatory_insurance?.verified) {
    throw new ErrorMsg("El seguro obligatorio no está verificado.", 403);
  }
  if (!vehicle.technical_mechanical?.verified) {
    throw new ErrorMsg("La revisión técnico-mecánica no está verificada.", 403);
  }
  if (vehicle.mandatory_insurance.expiration_date < now) {
    throw new ErrorMsg("El seguro obligatorio está vencido.", 403);
  }
  if (vehicle.technical_mechanical.expiration_date < now) {
    throw new ErrorMsg("La revisión técnico-mecánica está vencida.", 403);
  }
};
// Función auxiliar que valida pico y placa
const checkPlateRestriction = (vehicle: any) => {
  if (!vehicle.plates)
    throw new ErrorMsg("El vehículo debe tener placas registradas.", 403);

  const currentDate = new Date();
  const currentDay = currentDate.toLocaleString("en-US", { weekday: "long" });
  const currentHour = currentDate.getHours();

  // Validación de tipo de vehículo
  if (!vehicle.type || !(vehicle.type in restrictionDays)) {
    throw new ErrorMsg("Tipo de vehículo no soportado para pico y placa", 400);
  }
  // Obtiene las restricciones para el día actual
  const plateRestriction =
    restrictionDays[vehicle.type as VehicleType][currentDay] || [];

  switch (vehicle.type) {
    case VehicleType.car: {
      const lastDigit = vehicle.plates.charAt(vehicle.plates.length - 1);
      if (
        plateRestriction.includes(lastDigit) &&
        currentHour >= 5 &&
        currentHour <= 20
      ) {
        throw new ErrorMsg(
          "Este carro no puede circular hoy por pico y placa.",
          403
        );
      }
      break;
    }
    case VehicleType.motorbike: {
      const firstDigit = vehicle.plates.charAt(4); // formato ABC12D
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
};
// Middleware principal para validar un vehículo
export const checkVehicle =
  (mode: VehicleCheckMode = VehicleCheckMode.BASIC) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Se obtiene el vehicle_uid desde la request
      const vehicleId = req.vehicle_uid;
      if (!vehicleId)
        throw new ErrorMsg("Tu vehículo no está registrado aún.", 403);

      // Se busca el vehículo en la base de datos
      const vehicle = await VehicleModel.findById(vehicleId);
      if (!vehicle) throw new ErrorMsg("Vehículo no encontrado.", 404);
      // Validación de estado del vehículo
      if (vehicle.status_request !== Status.ACCEPTED) {
        throw new ErrorMsg("El vehículo aún no ha sido aprobado.", 403);
      }
      // Si el modo es FULL, valida documentos y vencimientos
      if (mode === VehicleCheckMode.FULL) {
        validateVehicleDocuments(vehicle);
      }
      // Valida pico y placa
      checkPlateRestriction(vehicle);
      next();
    } catch (err) {
      next(err);
    }
};