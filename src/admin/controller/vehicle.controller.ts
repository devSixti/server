import { Request, Response, NextFunction } from "express";
import { VehicleService } from "../services/vehicle.service";

/**
 * catchAsync
 * Wrapper para capturar errores en controladores async
 * y pasarlos al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export class VehicleController {
  /**
   * URL: PUT /admin/vehicles/:vehicleId/approve
   * Método PUT Approve
   * Aprueba un vehículo en el sistema a partir de su ID.
   */
  static approve = catchAsync(async (req: Request, res: Response) => {
    const { vehicleId } = req.params;

    // Crear una instancia de VehicleService
    const vehicleService = new VehicleService();

    const vehicle = await vehicleService.approve(vehicleId); // Llamar al método de la instancia
    res.json({ status: "success", data: vehicle });
  });

  /**
   * URL: GET /admin/vehicles
   * Método GET ALL
   * Obtiene todos los vehículos registrados en el sistema.
   */
  static getAll = catchAsync(async (req: Request, res: Response) => {
    // Crear una instancia de VehicleService
    const vehicleService = new VehicleService();

    const vehicles = await vehicleService.getAll(req.query); // Llamar al método de la instancia
    res.json({ status: "success", data: vehicles });
  });

  /**
   * URL: GET /admin/drivers/:driverId/vehicles
   * Método GET BY DRIVER
   * Obtiene todos los vehículos asociados a un conductor específico.
   */
  static getByDriver = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;

    // Crear una instancia de VehicleService
    const vehicleService = new VehicleService();

    const vehicles = await vehicleService.getByDriverId(driverId, req.query); // Llamar al método de la instancia
    res.json({ status: "success", data: vehicles });
  });
  /**
   * URL: DELETE /admin/vehicles/:vehicleId
   * Método DELETE
   * Elimina un vehículo por su ID.
   */
  static deleteByVehicleId = catchAsync(async (req: Request, res: Response) => {
    const { vehicleId } = req.params;

    if (!vehicleId) {
      throw new Error("Falta el ID del vehículo");
    }

    const vehicleService = new VehicleService();
    const result = await vehicleService.deleteByVehicleId(vehicleId);

    res.json({
      status: "success",
      message: "Vehículo eliminado exitosamente.",
      data: result,
    });
  });
}
