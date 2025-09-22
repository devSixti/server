import { TripModel } from "../../../trips/models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { CalificationsModel } from "../../../users/models";
import { TripStatus } from "../../../trips/types";

export const calificateUser = async (userId: string, tripId: string, calificationInfo: any): AsyncCustomResponse => {
    try {
        //  1: Extract comment and rating from calificationInfo, with default values

        const { comment = "Todo bien todo bonito", rating = 5 } = calificationInfo;

        //  2: Find the trip by tripId and populate driver and user_info data

        const trip = await TripModel.findById(tripId).populate({
            path: 'driver',
            populate: { path: "user_info" }
        });

        //  3: Check if the trip exists

        if (!trip) {
            throw new ErrorMsg("Trip not found.", 404);
        }

        if (trip.status != TripStatus.COMPLETED) {
            throw new ErrorMsg("Trip is not finished yet.", 400);
        }

        //  4: Determine who is making the calification

        const fromUserId = trip?.driver?.user_info?._id == userId
            ? trip?.driver?.user_info?._id // If it's the driver
            : trip?.passenger_id; // Otherwise, it's the passenger

        //  5: Determine the recipient of the calification

        const toUserId = trip?.driver?.user_info?._id == userId
            ? trip?.passenger_id // If the driver is rating, the recipient is the passenger
            : trip?.driver?.user_info?._id; // If the passenger is rating, the recipient is the driver

        //  6: Create the new calification
        const newCalification = await CalificationsModel.create({
            from_user_id: fromUserId,
            to_user_id: toUserId,
            trip_id: tripId,
            rating,
            comment,
        });

        //  7: Return success message and calification details
        return {
            message: "Calificate user success.",
            info: {
                newCalification
            },
        };
    } catch (error) {
        throw error;
    }
};
