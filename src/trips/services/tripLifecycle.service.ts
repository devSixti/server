import { TripModel } from "../models";
import { WalletModel } from "../../users/models";
import { AsyncCustomResponse } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { TripStatus } from "../types";
import { NotificationService } from "../../users/services/notification.service";
import { calculateComission } from "../utils";

/**
 * Centraliza cambios de estado de un Trip (arrived, start, finish, cancel).
 */
export class TripLifecycleService {
  private static validTransitions: Record<string, string[]> = {
    [TripStatus.WAITING_DRIVER]: [
      TripStatus.DRIVER_ARRIVED,
      TripStatus.CANCELLED,
    ],
    [TripStatus.DRIVER_ARRIVED]: [TripStatus.IN_PROGRESS, TripStatus.CANCELLED],
    [TripStatus.IN_PROGRESS]: [TripStatus.COMPLETED, TripStatus.CANCELLED],
    [TripStatus.COMPLETED]: [],
    [TripStatus.CANCELLED]: [],
  };

  private static isValidTransition(current: string, next: string) {
    return this.validTransitions[current]?.includes(next);
  }

  /**
   * changeStatus: método genérico para cambiar estado con validaciones comunes
   */
  static async changeStatus(
    tripId: string,
    userId: string,
    nextStatus: TripStatus,
    options: { role?: "driver" | "passenger"; extraData?: any } = {}
  ): Promise<AsyncCustomResponse> {
    try {
      const trip = await TripModel.findById(tripId)
        .populate({
          path: "driver",
          populate: { path: "user_info device wallet" },
        })
        .populate({
          path: "passenger",
          populate: { path: "device" },
        })
        .exec();

      if (!trip) throw new ErrorMsg("Trip not found", 404);

      // permisos para driver o passenger
      const isDriver = trip.driver_id?.toString() === userId;
      const isPassenger = trip.passenger_id?.toString() === userId;

      if (!isDriver && !isPassenger) {
        throw new ErrorMsg("You are not allowed to modify this trip", 403);
      }

      // validar transición
      if (!this.isValidTransition(trip.status, nextStatus)) {
        throw new ErrorMsg(
          `Transition from ${trip.status} to ${nextStatus} is not allowed`,
          400
        );
      }

      // restricción adicional: algunas transiciones solo driver o passenger
      if (nextStatus === TripStatus.DRIVER_ARRIVED && !isDriver) {
        throw new ErrorMsg("Only driver can mark as arrived", 403);
      }
      if (nextStatus === TripStatus.IN_PROGRESS && !isDriver) {
        throw new ErrorMsg("Only driver can start the trip", 403);
      }
      if (nextStatus === TripStatus.COMPLETED && !isDriver) {
        throw new ErrorMsg("Only driver can finish the trip", 403);
      }
      if (nextStatus === TripStatus.CANCELLED && !isDriver && !isPassenger) {
        throw new ErrorMsg("Only driver or passenger can cancel", 403);
      }

      // operaciones específicas
      if (nextStatus === TripStatus.COMPLETED) {
        // calcular comisión y actualizar wallet del driver
        // Asumiendo que calculateComission es una función async
        const { driverEarnings, commission, driverBalance } =
          await calculateComission(trip);
        if (!trip.driver?.wallet?._id) {
          throw new ErrorMsg("Driver wallet not found", 500);
        }
        const updatedWallet = await WalletModel.findByIdAndUpdate(
          trip.driver.wallet._id,
          { balance: driverBalance },
          { new: true }
        ).exec();
        trip.final_fare = trip.final_fare ?? trip.total_fare;
        trip.status = TripStatus.COMPLETED;
        await trip.save();

        // notificar
        await NotificationService.notifyTripChange(trip, "TRIP_FINISHED", {
          commission,
          driverEarnings,
        });

        return {
          status: "success",
          message: "Trip finished successfully",
          info: {
            newTripStatus: trip.status,
            commission,
            driverEarnings,
            driverWallet: updatedWallet,
          },
        };
      }

      // marcar arrived / start / cancel
      trip.status = nextStatus;
      await trip.save();

      // notificar según estado
      const mappingEvent = {
        [TripStatus.DRIVER_ARRIVED]: "DRIVER_ARRIVED",
        [TripStatus.IN_PROGRESS]: "TRIP_STARTED",
        [TripStatus.CANCELLED]: "TRIP_CANCELLED",
      } as Record<string, string | undefined>;
      const event = mappingEvent[nextStatus];
      if (event) {
        await NotificationService.notifyTripChange(
          trip,
          event,
          options.extraData
        );
      }

      return {
        status: "success",
        message: `Trip status changed to ${nextStatus}`,
        info: { newTripStatus: trip.status },
      };
    } catch (error) {
      throw error;
    }
  }

  // Métodos helper para invocar convenientes (opcional)
  static async markDriverArrived(tripId: string, driverId: string) {
    return this.changeStatus(tripId, driverId, TripStatus.DRIVER_ARRIVED, {
      role: "driver",
    });
  }
  static async startTrip(tripId: string, driverId: string) {
    return this.changeStatus(tripId, driverId, TripStatus.IN_PROGRESS, {
      role: "driver",
    });
  }
  static async finishTrip(tripId: string, driverId: string) {
    return this.changeStatus(tripId, driverId, TripStatus.COMPLETED, {
      role: "driver",
    });
  }
  static async cancelTrip(tripId: string, userId: string) {
    return this.changeStatus(tripId, userId, TripStatus.CANCELLED, {
      role: "passenger",
    });
  }
}
