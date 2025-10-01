import { Response, NextFunction } from "express";
import { TripLifecycleService } from "../services/tripLifecycle.service";
import { TripStatus } from "../types";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

/**
 * Función para capturar errores en funciones async y delegarlos
 * al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Controlador encargado del ciclo de vida de los viajes
 */
export class TripLifecycleController {
  /**
   * Cambiar el estado del viaje
   */
  static changeStatus = catchAsync(
    async (req: AuthenticatedRequest<{ tripId: string }, {}, { nextStatus: TripStatus }>, res: Response) => {
      const { tripId } = req.params;
      const { nextStatus } = req.body;

      const result = await TripLifecycleService.changeStatus(
        tripId,
        req.uid!,   // viene del token
        nextStatus
      );

      res.status(200).json({
        status: "success",
        message: `Estado del viaje actualizado a ${nextStatus}`,
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Marcar que el conductor llegó al punto de encuentro
   */
  static arrived = catchAsync(
    async (req: AuthenticatedRequest<{ tripId: string }>, res: Response) => {
      const { tripId } = req.params;

      const result = await TripLifecycleService.markDriverArrived(tripId, req.uid!);

      res.status(200).json({
        status: "success",
        message: "Conductor marcado como llegado",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Iniciar el viaje
   */
  static start = catchAsync(
    async (req: AuthenticatedRequest<{ tripId: string }>, res: Response) => {
      const { tripId } = req.params;

      const result = await TripLifecycleService.startTrip(tripId, req.uid!);

      res.status(200).json({
        status: "success",
        message: "Viaje iniciado correctamente",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Finalizar el viaje
   */
  static finish = catchAsync(
    async (req: AuthenticatedRequest<{ tripId: string }>, res: Response) => {
      const { tripId } = req.params;

      const result = await TripLifecycleService.finishTrip(tripId, req.uid!);

      res.status(200).json({
        status: "success",
        message: "Viaje finalizado correctamente",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Cancelar el viaje (driver o passenger)
   */
  static cancel = catchAsync(
    async (req: AuthenticatedRequest<{ tripId: string }>, res: Response) => {
      const { tripId } = req.params;

      const result = await TripLifecycleService.cancelTrip(tripId, req.uid!);

      res.status(200).json({
        status: "success",
        message: "Viaje cancelado correctamente",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );
}