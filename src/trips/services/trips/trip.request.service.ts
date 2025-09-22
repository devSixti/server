import { TripRequestModel } from "../../models";
import { PaymentMethod, RequestStatus } from "../../types";
import { commonServices } from "../../../users/services";
import { AsyncCustomResponse, ServiceType } from "../../../common/types";
import { findNearestDrivers } from "../../../trips/utils";

interface TripRequestDto {
  route: any;
  price: number;
  type: ServiceType;
  paymentMethod?: string;
  distance: string;
}

export const tripRequest = async (
  id: string,
  tripInfo: TripRequestDto
): AsyncCustomResponse => {
  try {
    const { route, price, type, paymentMethod, distance } = tripInfo;

    const origin = route.coordinates[0];
    const destination = route.coordinates[route.coordinates.length - 1];

    // 1. Create a new trip request

    const newTripRequest = await TripRequestModel.create({
      user_id: id,
      origin: { coordinates: [origin.latitude, origin.longitude] },
      destination: { coordinates: [destination.latitude, destination.longitude] },
      distance: distance.toString(),
      route: { coordinates: route.coordinates.map((point: any) => [point.latitude, point.longitude]) },
      price: price,
      service_type: type,
      paymant_method: paymentMethod ?? PaymentMethod.Cash,
      RequestStatus: RequestStatus.PENDING
    });

    // 2. Find drivers near the origin

    const { nearestDrivers, maxDistance, increment } = await findNearestDrivers(type, origin);

    let notificationsSended: any[] = [];

    // 4. Send trip request to the nearest drivers

    if (nearestDrivers.length > 0) {
      notificationsSended = nearestDrivers.map(async (driver) => {
        await commonServices.sendNotificationToDevice({
          tokenDevice: driver?.driver?.user_info?.device?.token,
          title: "New Trip Request",
          description: "A trip request is waiting for you. Open the app to accept.",
          data: { newTripRequest: JSON.stringify(newTripRequest) }
        });
      });
    }

    // 5. Return the response with the trip request details

    return {
      message: `Trip request created successfully`,
      info: {
        notificationsSended: notificationsSended.length > 0 ? notificationsSended.length : 0,
        searchRadius: maxDistance > 2000 ? maxDistance - increment : 2000, // Range used in the final search
        newTripRequest,
        nearestDrivers
      },
    };
  } catch (error) {
    throw error;
  }
};