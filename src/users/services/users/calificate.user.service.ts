import { TripModel } from "../../../trips/models";
import { CalificationsModel } from "../../models";
import { AsyncCustomResponse } from "../../../common/types";
import { ErrorMsg } from "../../../common/utils";
import { TripStatus } from "../../../trips/types"; 

export class ReviewService {
  static async calificateUser(
    userId: string,
    tripId: string,
    calificationInfo: { comment?: string; rating?: number }
  ): Promise<AsyncCustomResponse> {
    try {
      const { comment = "Todo bien todo bonito", rating = 5 } = calificationInfo;

      // Buscar el viaje con driver y user_info populados
      const trip = await TripModel.findById(tripId)
        .populate({
          path: "driver",
          populate: { path: "user_info" },
        })
        .exec();

      // Validaciones principales
      if (!trip) throw new ErrorMsg("Trip not found.", 404);
      if (trip.status !== TripStatus.COMPLETED) {
        throw new ErrorMsg("Trip is not finished yet.", 400);
      }

      // Validar que tenga driver asignado
      if (!trip.driver || !trip.driver.user_info) {
        throw new ErrorMsg("Trip does not have a valid driver.", 400);
      }

      // Definir si la calificación la está haciendo el driver o el pasajero
      const isDriverRating = trip.driver.user_info._id.toString() === userId.toString();

      const fromUserId = isDriverRating
        ? trip.driver.user_info._id
        : trip.passenger_id;

      const toUserId = isDriverRating
        ? trip.passenger_id
        : trip.driver.user_info._id;

      // Crear calificación
      const newCalification = await CalificationsModel.create({
        from_user_id: fromUserId,
        to_user_id: toUserId,
        trip_id: tripId,
        rating,
        comment,
      });

      return {
        message: "Calificate user success.",
        info: { newCalification },
      };
    } catch (error) {
      if (error instanceof ErrorMsg) throw error;
      throw new ErrorMsg("Unexpected error while rating user", 500);
    }
  }
}