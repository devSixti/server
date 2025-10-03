import { Request, Response, NextFunction } from "express";
import { createOrUpdateDriver } from "../services/drivers/create.or.update.driver.service";
import { myDriverRequestInfo } from "../services/drivers/driver.info.services";
import { changeDriverAvailable, changeDriverRole, } from "../services/drivers/driver.status.service";
import { DriverParams, DriverRequestParams, DriverAvailabilityParams, DriverRoleParams, } from "../types/driver.type";
import { CreateOrUpdateDriverDTO } from "../dto/create.or.update.driver.dto";

/**
 * Función auxiliar para capturar errores en funciones async
 * y delegarlos al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado de manejar todas las operaciones sobre drivers
 */
export class DriverController {
  /**
   * Crear o actualizar un driver
   */
  static createOrUpdate = catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const newDriverInfo = req.body;
      const result = await createOrUpdateDriver(userId, newDriverInfo);

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Obtener la información de un driver
   */
  static getInfo = catchAsync(
    async (req: Request, res: Response) => {
      const userId = req.uid;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
      const result = await myDriverRequestInfo(userId);

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Cambiar la disponibilidad de un driver
   */
  static changeAvailability = catchAsync(
    async (req: Request<DriverAvailabilityParams>, res: Response) => {
      const { driverId } = req.params;

      const result = await changeDriverAvailable(driverId);

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Cambiar el rol de un driver
   */
  static changeRole = catchAsync(
    async (req: Request<DriverRoleParams>, res: Response) => {
      const { userId } = req.params;

      const result = await changeDriverRole(userId);

      res.status(200).json({
        status: "exito",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
