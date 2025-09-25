import { Response, NextFunction } from "express";
import { TripRequestService } from "../services/trip.request.service";
import { ServiceType } from "../../common/types"; 
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

/**
 * Captura errores en funciones async y los delega al middleware de errores
 */
const catchAsync =
  (fn: Function) => (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Tipado del body esperado para crear una solicitud de viaje
 */
interface CreateTripRequestBody {
  route: {
    coordinates: { latitude: number; longitude: number }[];
  };
  price: number;
  type: ServiceType;
  paymentMethod?: string;
  distance: string | number;
  auto?: string;
}

/**
 * Controlador para manejar las solicitudes de viaje
 */
export class TripRequestController {
  static create = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { route, price, type, paymentMethod, distance, auto } = req.body as CreateTripRequestBody;
    const userId = req.uid; // ⚡ Extraemos el uid del token

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "No autorizado: token inválido o sin uid",
        timestamp: new Date().toISOString(),
      });
    }

    // Validaciones básicas
    if (!route || !route.coordinates || route.coordinates.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "El campo route.coordinates es obligatorio y no puede estar vacío",
        timestamp: new Date().toISOString(),
      });
    }

    if (!price || !type || !distance) {
      return res.status(400).json({
        status: "error",
        message: "Los campos price, type y distance son obligatorios",
        timestamp: new Date().toISOString(),
      });
    }

    // Crear la solicitud de viaje
    const result = await TripRequestService.createTripRequest(userId, {
      route,
      price,
      type,
      paymentMethod,
      distance: distance.toString(),
    });

    res.status(201).json({
      status: "success",
      message: result.message,
      data: result.info,
      timestamp: new Date().toISOString(),
    });
  });
}