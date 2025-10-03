import { TripRequestModel } from "../models";
import { TripModel } from "../models";
import { RequestStatus, TripRequestActions, TripStatus } from "../types";
import { AsyncCustomResponse } from "../../common/types";
import { NotificationService } from "../../users/services/notification.service";
import { DriverModel, DiscountModel } from "../../users/models";
import { ErrorMsg } from "../../common/utils";
import { CommissionRate } from "../utils";
import { TripRequestService } from "./trip.request.service";
import { getAverageCalification } from "../../users/utils";
import { TripRequestController } from "trips/controller/tripRequest.controller";

interface NegotiateOptions {
  driverId?: string;
  vehicleId?: string;
  tripRequestId: string;
  action: TripRequestActions;
  counterOffer?: number;
  initiatedBy: "driver" | "passenger";
}

/**
 *  Maneja PROPOSE / ACCEPT / REJECT para TripRequest
 */
export class TripNegotiationService {
  static async handleNegotiation(opts: NegotiateOptions): Promise<AsyncCustomResponse> {
    try {
      const { driverId, vehicleId, tripRequestId, action, counterOffer, initiatedBy } = opts;

      const tripRequest = await TripRequestModel.findById(tripRequestId)
        .populate({ path: "user_info", populate: { path: "device" } })
        .exec();

      if (!tripRequest) throw new ErrorMsg("Trip request not found", 404);

      if (action === TripRequestActions.PROPOSE) {
        // driver propone
        if (!driverId) throw new ErrorMsg("Driver ID required to propose", 400);
        await tripRequest.updateOne({ status: RequestStatus.NEGOTIATION, counterOffer });
        // notificar pasajero
        await NotificationService.sendToToken(tripRequest.user_info?.device?.token, "New proposal", "A driver proposed a new price for your request", { tripRequestId, counterOffer });
        return { status: "success", message: "Trip request proposed successfully", info: { tripRequestId, counterOffer } };
      }

      if (action === TripRequestActions.REJECT) {
        // Si initiatedBy = driver, update status pending (driver rejected)
        await tripRequest.updateOne({ status: RequestStatus.PENDING });
        return { status: "success", message: "Trip request rejected", info: { tripRequestId } };
      }

      if (action === TripRequestActions.ACCEPT) {
        // aceptar: puede ser driver aceptando o passenger asimilando driver accept
        // Si la solicitud ya fue aceptada -> verificar existencia de Trip
        if (tripRequest.status === RequestStatus.ACCEPTED) {
          const existingTrip = await TripModel.findOne({ trip_request_id: tripRequestId });
          if (existingTrip) return { status: "success", message: "Trip request already accepted", info: { trip: existingTrip } };
          else throw new ErrorMsg("Trip request accepted previously but trip missing", 400);
        }

        // marcar como aceptado
        await tripRequest.updateOne({ status: RequestStatus.ACCEPTED });

        // calcular descuentos del pasajero
        const passengerDiscounts = await DiscountModel.find({ user_id: tripRequest.user_id, is_active: true }).exec();
        const finalFare = passengerDiscounts?.length == 0 ? tripRequest.price : tripRequest.price - tripRequest.price * passengerDiscounts[0].amount;

        // crear trip
        const newTrip = await TripModel.create({
          passenger_id: tripRequest.user_id,
          driver_id: driverId,
          vehicle_id: vehicleId,
          trip_request_id: tripRequestId,
          discount_id: passengerDiscounts?.length == 0 ? null : passengerDiscounts[0]._id,
          total_fare: tripRequest.price,
          final_fare: finalFare,
          status: TripStatus.WAITING_DRIVER,
          acceptedAt: new Date(),
        });

        // notificar pasajero
        await NotificationService.sendToToken(tripRequest.user_info?.device?.token, "Your trip request has been accepted!", "A driver is on the way", { newTripId: newTrip._id });

        return { status: "success", message: "Trip request accepted successfully", info: { newTrip } };
      }

      throw new ErrorMsg("Invalid action", 400);
    } catch (error) {
      throw error;
    }
  }
}
