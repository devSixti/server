import { TripRequestModel } from "../models";
import { TripModel } from "../models";
import { PaymentMethod, RequestStatus, TripStatus } from "../types";
import { commonServices } from "../../users/services";
import { AsyncCustomResponse, ServiceType } from "../../common/types";
import { findNearestDrivers } from "../utils";
import { DriverModel, DiscountModel } from "../../users/models";
import { ErrorMsg } from "../../common/utils";
import { NotificationService } from "../../users/services/notification.service";

interface TripRequestDto {
  route: any;
  price: number;
  type: ServiceType;
  paymentMethod?: string;
  distance: string;
}

export class TripRequestService {
  static async createTripRequest(userId: string, tripInfo: TripRequestDto): Promise<AsyncCustomResponse> {
    try {
      const { route, price, type, paymentMethod, distance } = tripInfo;
      const origin = route.coordinates[0];
      const destination = route.coordinates[route.coordinates.length - 1];

      const newTripRequest = await TripRequestModel.create({
        user_id: userId,
        origin: { coordinates: [origin.latitude, origin.longitude] },
        destination: { coordinates: [destination.latitude, destination.longitude] },
        distance: distance.toString(),
        route: { coordinates: route.coordinates.map((p: any) => [p.latitude, p.longitude]) },
        price,
        service_type: type,
        payment_method: paymentMethod ?? PaymentMethod.Cash,
        status: RequestStatus.PENDING
      });

      // encontrar drivers cercanos
      const { nearestDrivers, maxDistance, increment } = await findNearestDrivers(type, origin);

      const notificationsSended: any[] = [];
      if (nearestDrivers.length > 0) {
        // notificar drivers
        for (const d of nearestDrivers) {
          const token = d?.driver?.user_info?.device?.token;
          const title = "New Trip Request";
          const description = "A trip request is waiting for you. Open the app to accept.";
          await NotificationService.sendToToken(token, title, description, { newTripRequest: JSON.stringify(newTripRequest) });
          notificationsSended.push(token ? 1 : 0);
        }
      }

      return {
        message: "Trip request created successfully",
        info: {
          notificationsSended: notificationsSended.reduce((a, b) => a + b, 0),
          searchRadius: maxDistance > 2000 ? maxDistance - increment : 2000,
          newTripRequest,
          nearestDrivers
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Utility to create a Trip from an accepted TripRequest
   */
  static async createTripFromRequest(tripRequest: any, driverId: string, vehicleId: string, finalFare: number, discountId: any = null) {
    const newTrip = await TripModel.create({
      passenger_id: tripRequest.user_id,
      driver_id: driverId,
      vehicle_id: vehicleId,
      trip_request_id: tripRequest._id,
      discount_id: discountId,
      total_fare: tripRequest.price,
      final_fare: finalFare,
      status: TripStatus.WAITING_DRIVER,
      acceptedAt: new Date(),
    });
    return newTrip;
  }
}
