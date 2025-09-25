import { Request, Response, NextFunction } from "express";
import { TripRequestService } from "../services/trip.request.service";
import { ServiceType } from "../../common/types"; 

/**
 * Función para capturar errores en funciones async y delegarlos
 * al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Tipado del body esperado para crear una solicitud de viaje
 */
interface CreateTripRequestBody {
  userId: string;
  tripInfo: {
    route: {
      coordinates: { latitude: number; longitude: number }[];
    };
    price: number;
    type: ServiceType; 
    paymentMethod?: string;
    distance: string;
  };
}
/**
 * Controlador encargado de manejar las solicitudes de viaje (Trip Requests)
 */
export class TripRequestController {
  /**
   * Crea una nueva solicitud de viaje para un usuario.
   */
  static create = catchAsync(
    async (req: Request<{}, {}, CreateTripRequestBody>, res: Response) => {
      const { userId, tripInfo } = req.body;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "No autorizado: userId no proporcionado",
          timestamp: new Date().toISOString(),
        });
      }

      const result = await TripRequestService.createTripRequest(userId, tripInfo);

      res.status(201).json({
        status: "success",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
