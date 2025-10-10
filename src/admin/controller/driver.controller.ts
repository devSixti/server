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
   * URL: PATCH /admin/drivers/:driverId/approve
   * Método PATCH — Aprueba o rechaza un conductor en el sistema.
   */
  static approve = catchAsync(async (req: Request, res: Response) => {
    const { driverId } = req.params;
    const result = await DriverService.approve(driverId);

    //  Si el servicio devuelve un rechazo
    if (result.status === "error") {
      return res.status(400).json({
        status: "error",
        message: result.message,
        data: result.info,
      });
    }

    //  Si fue aprobado exitosamente
    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.info,
    });
  });
  

  /**
   * URL: GET /admin/drivers
   * Método GET — Obtiene todos los conductores registrados.
   */
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.getAll(req.query);
    res.json({ status: "success", data: drivers });
  });

  /**
   * URL: GET /admin/drivers/search
   * Método GET — Busca conductores según parámetros de búsqueda.
   */
  static search = catchAsync(async (req: Request, res: Response) => {
    const drivers = await DriverService.search(req.query);
    res.json({ status: "success", data: drivers });
  });

  /**
   * URL: DELETE /admin/drivers/:id
   * Método DELETE — Desactiva un conductor del sistema.
   */
  static desactivate = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("El ID del conductor no está definido.");
    }

    const response = await DriverService.desactivate(id);

    res.json({
      status: response.status,
      message: response.message,
      data: response.info,
    });
  });
}

