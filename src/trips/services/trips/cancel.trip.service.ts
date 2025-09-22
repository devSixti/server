import { TripModel } from "../../../trips/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { TripStatus } from "../../../trips/types";
import { commonServices } from "../../../users/services";

export const cancelTrip = async (
  tripId: string,
  userId: string
): AsyncCustomResponse => {
  try {
    // 1. Find the trip by its ID

    const trip = await TripModel.findById(tripId)
      .populate({
        path: "driver",
        populate: { path: "user_info", populate: { path: "device" } },
      })
      .populate({
        path: "passenger",
        populate: { path: "device" },
      });

    // 2. If the trip is not found, throw an error

    if (!trip) {
      throw new ErrorMsg("Trip not found", 404);
    }

    // 2. Validar permisos del usuario

    const isUserAuthorized =
      trip.passenger_id.toString() === userId ||
      trip.driver_id.toString() === userId;

    if (!isUserAuthorized) {
      throw new ErrorMsg("You are not allowed to cancel this trip", 403);
    }

    // 3. Check if the trip status allows cancellation

    const nonCancellableStatuses = [
      TripStatus.COMPLETED,
      TripStatus.CANCELLED,
      TripStatus.IN_PROGRESS,
      TripStatus.DRIVER_ARRIVED
    ]; 

    if (nonCancellableStatuses.includes(trip.status)) {
      throw new ErrorMsg("Trip can't be cancelled", 400);
    }

    // 4. Update the trip status to CANCELLED

    trip.status = TripStatus.CANCELLED;
    await trip.save();
    
    const isDriver = trip.driver_id.toString() == userId ? true : false;

    const notificationSended = await commonServices.sendNotificationToDevice({
      tokenDevice: isDriver
        ? trip?.driver?.user_info?.device?.token ?? ""
        : trip?.passenger?.device?.token ?? "",
      title: ` Trip cancelled`,
      description: "The trip has been cancelled",
      data: {},
    });

    return {
      message: "Cancel trip",
      info: {
        notificationSended,
        newTripSatus: trip.status,
        isDriver: isDriver,
      },
    };
  } catch (error) {
    throw error;
  }
};
