import { TripModel } from "../../../trips/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { TripStatus } from "../../../trips/types";

export const startTrip = async ( tripId: string, driverId: string ): AsyncCustomResponse => {
  try {

    // 1. Find the trip and validate that it exists and that the driver is correct

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

    // 2. Validate if the current status allows changing to "IN_PROGRESS"

    if (trip.status !== TripStatus.DRIVER_ARRIVED) {
      throw new ErrorMsg("Trip status does not allow starting the trip", 400);
    }

    // 3. Update the trip status to "IN_PROGRESS"

    trip.status = TripStatus.IN_PROGRESS;
    await trip.save();

    // 4. Return a successful response

    return {
      message: "Trip started successfully",
      info: {
        newTripStatus: trip.status,
      },
    };
  } catch (error) {
    throw error;
  }
};
