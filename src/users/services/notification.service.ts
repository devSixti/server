import { commonServices } from "./index"; // o donde exportes commonServices
import { TripModel } from "../../trips/models";
import { ErrorMsg } from "../../common/utils";

export class NotificationService {
  /**
   * Envía notificación a un token
   */
  static async sendToToken(token: string | undefined | null, title: string, description: string, data: any = {}) {
    if (!token) return { ok: false, reason: "no-token" };
    try {
      const res = await commonServices.sendNotificationToDevice({
        tokenDevice: token,
        title,
        description,
        data,
      });
      return { ok: true, res };
    } catch (err) {
      // Loggear y no detener el flujo principal
      console.error("NotificationService.sendToToken error:", err);
      return { ok: false, reason: err };
    }
  }

  /**
   * Notificación estándar para cambios de estado de trip
   */
  static async notifyTripChange(trip: any, eventType: string, extraData: any = {}) {
    try {
      const passengerToken = trip?.passenger?.device?.token;
      const driverToken = trip?.driver?.user_info?.device?.token ?? trip?.driver?.device?.token;

      const title = this.getTitleForEvent(eventType);
      const description = this.getDescriptionForEvent(eventType);

      const tasks = [];
      if (passengerToken) tasks.push(this.sendToToken(passengerToken, title, description, { tripId: trip._id, ...extraData }));
      if (driverToken) tasks.push(this.sendToToken(driverToken, title, description, { tripId: trip._id, ...extraData }));

      const results = await Promise.all(tasks);
      return results;
    } catch (err) {
      console.error("NotificationService.notifyTripChange error:", err);
      return [];
    }
  }

  private static getTitleForEvent(eventType: string) {
    switch (eventType) {
      case "DRIVER_ARRIVED": return "Your driver has arrived";
      case "TRIP_CANCELLED": return "Trip cancelled";
      case "TRIP_STARTED": return "Trip started";
      case "TRIP_FINISHED": return "Trip finished";
      case "REQUEST_PROPOSED": return "New proposal";
      default: return "Trip update";
    }
  }

  private static getDescriptionForEvent(eventType: string) {
    switch (eventType) {
      case "DRIVER_ARRIVED": return "Please meet your driver at the pickup location.";
      case "TRIP_CANCELLED": return "The trip has been cancelled.";
      case "TRIP_STARTED": return "Your trip has started.";
      case "TRIP_FINISHED": return "Your trip has finished.";
      case "REQUEST_PROPOSED": return "A driver proposed a new fare for your request.";
      default: return "There is an update related to your trip.";
    }
  }
}
