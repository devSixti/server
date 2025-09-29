import { Request, Response, NextFunction } from "express";
import { DriverService } from "../services/driver.service";

/**
 * catchAsync
 * Wrapper para manejar errores de forma centralizada en controladores async
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export class DriverController {
  /**
   * URL: PUT /admin/drivers/:driverId/approve
   * Metodo PUT Aprueba un conductor en el sistema.
   * */
  static approve = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const driver = await DriverService.approve(driverId);
    res.json({ status: "success", data: driver });
  });

  /**
   * URL: GET /admin/drivers
   * Metodo GET ALL Obtiene todos los conductores registrados.
   * */
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.getAll(req.query);
    res.json({ status: "success", data: drivers });
  });

  /**
   * URL: GET /admin/drivers/search
   * Metodo GET Search Busca conductores según parámetros de búsqueda.
   * */
  static search = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.search(req.query);
    res.json({ status: "success", data: drivers });
  });

  /**
   * URL: DELETE /admin/drivers/:id
   * Metodo DELETE Elimina un conductor del sistema.
   */
  static desactivate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("El ID del conductor no está definido");
    }
    const response = await DriverService.desactivate(id);
    res.json({
      status: response.status,
      message: response.message,
      data: response.info,
    });
  });
}
