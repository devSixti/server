import { Request, Response } from "express";
import { TripModel } from "../../trips/models";
import { NotificationService } from "../services/notification.service";
import { catchAsync } from "../../common/utils";
import { ErrorMsg } from "../../common/utils";

export class NotificationController {
  /**
   * Notificar un cambio en el estado del trip
   * Endpoint: POST /notifications/trip/:tripId
   */
  static notifyTripChange = catchAsync(async (req: Request, res: Response) => {
    const { tripId } = req.params;
    const { eventType, extraData } = req.body;

    if (!tripId) {
      throw new ErrorMsg("tripId is required", 400);
    }

    // 🔎 Buscar trip en la BD con passenger y driver + devices
    const trip = await TripModel.findById(tripId)
      .populate({
        path: "passenger",
        populate: { path: "device" }, // passenger.device.token
      })
      .populate({
        path: "driver",
        populate: [
          { path: "user_info", populate: { path: "device" } }, // driver.user_info.device.token
          { path: "device" }, // driver.device.token (fallback)
        ],
      })
      .lean();

    if (!trip) {
      throw new ErrorMsg("Trip not found", 404);
    }

    // Mandar notificación
    const results = await NotificationService.notifyTripChange(
      trip,
      eventType,
      extraData ?? {}
    );

    return res.status(200).json({
      status: "success",
      data: results,
    });
  });
}
