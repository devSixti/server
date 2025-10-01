import { Response, NextFunction } from "express";
import { TripNegotiationService } from "../services/trip.negotiation.service";
import { TripRequestActions } from "../types";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

/**
 * Función para capturar errores en funciones async y delegarlos
 * al middleware global de manejo de errores.
 */
const catchAsync =
  (fn: Function) => (req: AuthenticatedRequest, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Tipado del body esperado para la negociación de viaje
 */
interface NegotiationBody {
  action: TripRequestActions; // PROPOSE | REJECT | ACCEPT
  counterOffer?: number;
  initiatedBy: "driver" | "passenger";
}

/**
 * Tipado de params esperado
 */
interface NegotiationParams {
  tripRequestId: string;
}

/**
 * Controlador encargado de manejar la negociación de viajes
 */
export class TripNegotiationController {
  /**
   * Permite proponer, rechazar o aceptar una solicitud de viaje.
   */
  static negotiate = catchAsync(
    async (
      req: AuthenticatedRequest<NegotiationParams, {}, NegotiationBody>,
      res: Response
    ) => {
      const { action, counterOffer, initiatedBy } = req.body;
      const { tripRequestId } = req.params;

      let driverId = req.driver_uid;
      let vehicleId = req.vehicle_id;

      if (initiatedBy === "passenger") {
        // Si es pasajero, tomamos driverId y vehicleId de query params
        driverId = req.query.driverId as string;
        vehicleId = req.query.vehicleId as string;
      }

      if (initiatedBy === "driver") {
        if (!driverId) {
          return res
            .status(400)
            .json({ status: "error", message: "Driver ID no encontrado en token" });
        }
        if (!vehicleId) {
          return res
            .status(400)
            .json({ status: "error", message: "Vehicle ID no encontrado en token" });
        }
      } else {
        if (!driverId || !vehicleId) {
          return res.status(400).json({
            status: "error",
            message: "Driver ID y Vehicle ID requeridos para pasajero",
          });
        }
      }

      if (!tripRequestId) {
        return res
          .status(400)
          .json({ status: "error", message: "TripRequest ID faltante en la URL" });
      }

      const opts = {
        tripRequestId,
        action,
        counterOffer,
        initiatedBy,
        driverId,
        vehicleId,
      };

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