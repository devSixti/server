import { Request, Response, NextFunction } from "express";
import { TripNegotiationService } from "../services/trip.negotiation.service";
import { TripRequestActions } from "../types";

/**
 * Función para capturar errores en funciones async y delegarlos
 * al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Tipado del body esperado para la negociación de viaje
 */
interface NegotiationBody {
  driverId?: string;
  vehicleId?: string;
  tripRequestId: string;
  action: TripRequestActions; // PROPOSE | REJECT | ACCEPT
  counterOffer?: number;
  initiatedBy: "driver" | "passenger";
}

/**
 * Controlador encargado de manejar la negociación de viajes
 */
export class TripNegotiationController {
  /**
   * Permite proponer, rechazar o aceptar una solicitud de viaje.
   */
  static negotiate = catchAsync(
    async (req: Request<{}, {}, NegotiationBody>, res: Response) => {
      const opts = req.body;

      const result = await TripNegotiationService.handleNegotiation(opts);

      res.status(200).json({
        status: "success",
        message: result.message,
        data: result.info,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
