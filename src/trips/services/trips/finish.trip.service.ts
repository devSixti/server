import { TripModel } from "../../../trips/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { TripStatus } from "../../../trips/types";
import { WalletModel } from "../../../users/models";
import { calculateComission } from "../../../trips/utils";

export const finishTrip = async (
  tripId: string,
  driverId: string
): AsyncCustomResponse => {
  try {


    // 2. Find the trip and validate that it exists and the driver is correct

    const trip = await TripModel.findById(tripId).populate({ path: "driver", populate: { path: "wallet" } });


    if (!trip) {
      throw new ErrorMsg("Trip not found", 404);
    }

    if (trip.driver_id.toString() !== driverId) {
      throw new ErrorMsg("You are not the assigned driver for this trip", 403);
    }

    // 3. Validate if the current status allows finishing the trip

    if (trip.status !== TripStatus.IN_PROGRESS) {
      throw new ErrorMsg("Trip status does not allow finishing the trip", 400);
    }

    // 4. Calculate commission and debit from the driver

    const {driverEarnings, commission, driverBalance} = calculateComission(trip);

    // Update balance in the database
  
    const updatedWallet = await WalletModel.findByIdAndUpdate(trip.driver.wallet._id, { balance: driverBalance }, { new: true });

    // 5. Update the trip status to "COMPLETED"

    trip.status = TripStatus.COMPLETED;
    await trip.save();

    // 6. Respond with trip information and calculated amount

    return {
      message: "Trip finished successfully",
      info: {
        newTripStatus: trip.status,
        totalAmount: trip.final_fare,
        commission,
        driverEarnings,
        driverWallet: updatedWallet
      },
    };
  } catch (error) {
    throw error;
  }
};
