import { TripModel, TripRequestModel } from "../../models";
import { RequestStatus, TripRequestActions, TripStatus } from "../../types";
import { AsyncCustomResponse } from "../../../common/types";
import { DiscountModel, DriverModel } from "../../../users/models";
import { Driver } from "../../../users/types";
import { commonServices } from "../../../users/services";
import { ErrorMsg } from "../../../common/utils";

interface PassegerNegotiationOptions {
  passegerId: string;
  driverId: string;
  vehicleId: string;
  tripRequestId: string;
  action: "accept" | "reject";
}
export const passegerNegotiation = async ({
  passegerId,
  driverId,
  vehicleId,
  tripRequestId,
  action,
}: PassegerNegotiationOptions): AsyncCustomResponse => {
  try {
    // Get the driver by ID and populate user information

    const driver = (await DriverModel.findById(driverId)
      .populate({
        path: "user_info",
        populate: {
          path: "device",
        },
      })
      .exec()) as Driver;

    // 1. Get the trip request n

    const tripRequest = await TripRequestModel.findById(tripRequestId)
      .populate({
        path: "user_info",
        populate: {
          path: "device",
        },
      })
      .exec();

    if (!tripRequest) {
      throw new ErrorMsg("Trip request not found", 404);
    }

    if (tripRequest.status == RequestStatus.ACCEPTED) {
      // Validar si ya existe un Trip asociado a este TripRequest
      const existingTrip = await TripModel.findOne({
        trip_request_id: tripRequestId,
      });

      if (existingTrip) {
        return {
          message: "Trip request already accepted and trip already exists.",
          info: { trip: existingTrip },
        };
      } else {
        // No se creó el viaje, probablemente hubo un error anterior
        throw new ErrorMsg(
          "Trip request already accepted but no trip was created. Please try again or contact support.",
          400
        );
      }
    }

    // 2. Handle possible actions

    switch (action) {
      case TripRequestActions.ACCEPT:
        await tripRequest.updateOne({ status: RequestStatus.ACCEPTED });

        // Create the trip with driver, vehicle, and request data

        const passengerDiscounts = await DiscountModel.find({
          user_id: tripRequest.user_id,
          is_active: true,
        }).exec();

        const finalFare =
          passengerDiscounts?.length == 0
            ? tripRequest.price
            : tripRequest.price * (1 + passengerDiscounts[0].amount);

        const newTrip = await TripModel.create({
          passenger_id: tripRequest.user_id ?? passegerId,
          driver_id: driverId,
          vehicle_id: vehicleId,
          trip_request_id: tripRequestId,
          discount_id:
            passengerDiscounts?.length == 0 ? null : passengerDiscounts[0]._id,
          total_fare: tripRequest.price,
          final_fare: finalFare,
          status: TripStatus.WAITING_DRIVER,
        });

        // Send notification to the user
        const acceptanceNotificationSend =
          await commonServices.sendNotificationToDevice({
            tokenDevice: driver.user_info?.device?.token ?? "",
            title: `Your trip request has been accepted!`,
            description: `${
              tripRequest?.user_info?.first_name ?? "User"
            } is waiting for you!`,
            data: {
              data: JSON.stringify({ tripRequest, newTrip }),
            },
          });

        // });
        return {
          message: "Trip request accepted successfully",
          info: { acceptanceNotificationSend },
        };
      case TripRequestActions.REJECT:
        // Reject the trip request and update the status to PENDING
        await tripRequest.updateOne({ status: RequestStatus.PENDING });

        return {
          message: "Rejected trip request.",
          info: {},
        };

      default:
        throw new ErrorMsg("Invalid action", 400);
    }
  } catch (error) {
    throw error;
  }
};
