import { Request, Response, NextFunction } from "express";
import { assignVehicle } from "../services/vehicles/assign.vehicle.services";
import {
  addOrUpdateVehicle,
  getDriverVehicle,
  deleteVehicleById
} from "../services/vehicles/vehicle.service";
import { DeleteRequestService } from "../../admin/services";

/**
 * catchAsync: helper para manejar errores async
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado de manejar todas las operaciones relacionadas con vehículos de conductores.
 */
export class DriverVehicleController {
  static assignVehicle = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.driver_uid;
    const { vehicleId } = req.body;
    if (!driverId)
      return res
        .status(401)
        .json({ message: "Usuario no autenticado o sin conductor asignado" });

    if (!vehicleId)
      return res.status(400).json({ message: "vehicleId es requerido" });

    const result = await assignVehicle(driverId, vehicleId);
    res.json({ status: "success", data: result });
  });

  static addOrUpdateVehicle = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.driver_uid;
    if (!driverId)
      return res
        .status(401)
        .json({ message: "Usuario no autenticado o sin conductor asignado" });

    const { vehicleId, ...newVehicleInfo } = req.body;
    const result = await addOrUpdateVehicle({ driverId, vehicleId, newVehicleInfo });
    res.json({ status: "success", data: result });
  });

  /**
   * Solicita eliminación de un vehículo (no lo borra directamente)
   * URL: DELETE /drivers/:driverId/vehicles/:vehicleId BODY: { reason: string }
   */
  static deleteVehicleById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.uid;
    const { vehicleId } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({
        message: "Debes proporcionar un motivo válido (mínimo 5 caracteres)",
      });
    }
    const result = await deleteVehicleById(userId, vehicleId, reason);
    res.status(201).json(result);
  });

  static getDriverVehicle = catchAsync(async (req: Request, res: Response) => {
    const driverId = req.driver_uid;
    if (!driverId)
      return res
        .status(401)
        .json({ message: "Usuario no autenticado o sin conductor asignado" });

    const result = await getDriverVehicle(driverId);
    res.json({ status: "success", data: result });
  });
}