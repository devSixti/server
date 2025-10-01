import { Request, Response, NextFunction } from "express";
import { assignVehicle } from "../services/vehicles/assign.vehicle.services";
import { addOrUpdateVehicle, deleteVehicleById, getDriverVehicle, } from "../services/vehicles/vehicle.service";

/**
 * catchAsync
 * Wrapper para manejar errores de forma centralizada en controladores async
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado de manejar todas las operaciones relacionadas
 * con vehículos asignados a conductores.
 */
export class DriverVehicleController {
  /**
   * Asigna un vehículo autorizado a un conductor
   * URL: PUT /drivers/:driverId/vehicles/:vehicleId/assign
   */
  static assignVehicle = catchAsync(async (req: Request, res: Response) => {
    const { driverId, vehicleId } = req.params;
    const result = await assignVehicle(driverId, vehicleId);
    res.json({ status: "success", data: result });
  });

  /**
   * Agrega o actualiza un vehículo de un conductor
   * URL: POST /drivers/:driverId/vehicles
   */
  static addOrUpdateVehicle = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const { vehicleId, ...newVehicleInfo } = req.body;
    const result = await addOrUpdateVehicle({ driverId, vehicleId, newVehicleInfo });
    res.json({ status: "success", data: result });
  });

  /**
   * Elimina un vehículo específico de un conductor
   * URL: DELETE /drivers/:driverId/vehicles/:vehicleId
   */
  static deleteVehicleById = catchAsync(async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const result = await deleteVehicleById(vehicleId);
    res.json({ status: "success", data: result });
  });

  /**
   * Obtiene todos los vehículos de un conductor
   * URL: GET /drivers/:driverId/vehicles
   */
  static getDriverVehicle = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const result = await getDriverVehicle(driverId);
    res.json({ status: "success", data: result });
  });
}
