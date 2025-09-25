import { Request, Response, NextFunction } from "express";
import { TripLifecycleService } from "../services/tripLifecycle.service";
import { TripStatus } from "../types";

/**
 * Función para capturar errores en funciones async y delegarlos
 * al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Interfaces para tipar el body de las peticiones
 */
interface ChangeStatusBody {
  userId: string;
  nextStatus: TripStatus;
}

interface DriverActionBody {
  driverId: string;
}

interface CancelBody {
  userId: string;
}

/**
 * Controlador encargado del ciclo de vida de los viajes
 */
export class TripLifecycleController {
  /**
   * Cambiar el estado del viaje
   */
  static changeStatus = catchAsync(
    async (
      req: Request<{ tripId: string }, {}, ChangeStatusBody>,
      res: Response
    ) => {
      const { tripId } = req.params;
      const { userId, nextStatus } = req.body;

      const result = await TripLifecycleService.changeStatus(
        tripId,
        userId,
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
    async (
      req: Request<{ tripId: string }, {}, DriverActionBody>,
      res: Response
    ) => {
      const { tripId } = req.params;
      const { driverId } = req.body;

      const result = await TripLifecycleService.markDriverArrived(
        tripId,
        driverId
      );

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
    async (
      req: Request<{ tripId: string }, {}, DriverActionBody>,
      res: Response
    ) => {
      const { tripId } = req.params;
      const { driverId } = req.body;

      const result = await TripLifecycleService.startTrip(tripId, driverId);

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
    async (
      req: Request<{ tripId: string }, {}, DriverActionBody>,
      res: Response
    ) => {
      const { tripId } = req.params;
      const { driverId } = req.body;

      const result = await TripLifecycleService.finishTrip(tripId, driverId);

      res.status(200).json({
        status: "success",
        message: "Viaje finalizado correctamente",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );

  /**
   * Cancelar el viaje
   */
  static cancel = catchAsync(
    async (
      req: Request<{ tripId: string }, {}, CancelBody>,
      res: Response
    ) => {
      const { tripId } = req.params;
      const { userId } = req.body;

      const result = await TripLifecycleService.cancelTrip(tripId, userId);

      res.status(200).json({
        status: "success",
        message: "Viaje cancelado correctamente",
        data: result,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
