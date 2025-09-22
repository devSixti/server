import { TripModel } from "../../../trips/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { TripStatus } from "../../../trips/types";
import { commonServices } from "../../../users/services";

export const driverArrived = async (
  tripId: string,
  driverId: string
): AsyncCustomResponse => {
  try {

    // 2. Find the trip and validate that it exists and the driver is correct

    const trip = await TripModel.findById(tripId).populate({
      path: "passenger",
      populate: { path: "device" },
    });

    if (!trip) {
      throw new ErrorMsg("Trip not found", 404);
    }

    if (trip.driver_id.toString() !== driverId) {
      throw new ErrorMsg("You are not the assigned driver for this trip", 403);
    }

    // 3. Validate if the status allows marking as "ARRIVED"

    if (trip.status !== TripStatus.WAITING_DRIVER) {
      throw new ErrorMsg("Trip status does not allow marking as arrived", 400);
    }

    // 4. Update the trip status to ARRIVED

    trip.status = TripStatus.DRIVER_ARRIVED;
    await trip.save();

    // 5. Notify the passenger that the driver has arrived

    const notificationSended = await commonServices.sendNotificationToDevice({
      tokenDevice: trip.passenger?.device?.token,
      title: "Your driver has arrived",
      description: "Please meet your driver at the pickup location.",
      data: { tripId },
    });

    // 6. Return a successful response

    return {
      message: "Driver marked as arrived successfully",
      info: {
        notificationSended,
        newTripStatus: trip.status,
      },
    };
  } catch (error) {
    throw error;
  }
};
