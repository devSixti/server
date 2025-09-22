import { TripModel, TripRequestModel } from "../../models";
import { RequestStatus, TripRequestActions, TripStatus } from "../../types";
import { AsyncCustomResponse } from "../../../common/types";
import { commonServices } from "../../../users/services";
import { DiscountModel, DriverModel } from "../../../users/models";
import { Driver, User } from "../../../users/types";
import { CommissionRate } from "../../../trips/utils";
import { ErrorMsg } from "../../../common/utils";
import { getAverageCalification } from "../../../users/utils";

interface NegotiateTripRequestOptions {
  driverId: string;
  vehicleId: string;
  tripRequestId: string;
  action: TripRequestActions;
  counterOffer?: number;
}

export const negotiateTripRequest = async ({
  driverId,
  vehicleId,
  tripRequestId,
  action,
  counterOffer,
}: NegotiateTripRequestOptions): AsyncCustomResponse => {
  try {
    // Get the driver by ID and populate user information

    const driver = (await DriverModel.findById(driverId)
      .populate({
        path: "user_info",
        select: "first_name last_name picture phone_number email califications",
        populate: {
          path: "califications",
        },
      })
      .populate({
        path: "vehicle_selected",
        select: "model brand year color plates",
      })
      .populate("wallet")
      .exec()) as Driver;

    if (!driver) {
      throw new ErrorMsg("Driver not found", 404);
    }

    const { vehicle_selected, user_info } = driver;

    const averageCalification = getAverageCalification(user_info as User);

    const customDrivberInfo = {
      rank: averageCalification,
      first_name: user_info!.first_name,
      picture: user_info!.picture,
    };

    // Get the trip request by ID and populate user information

    const tripRequest = await TripRequestModel.findById(tripRequestId)
      .populate({
        path: "user_info",
        populate: {
          path: "device",
        },
      })
      .exec();

    // Check if the trip request exists

    if (!tripRequest) {
      throw new ErrorMsg("Trip request not found", 404);
    }

    // Check if the trip request is already accepted

    if (tripRequest.status == RequestStatus.ACCEPTED) {
      throw new ErrorMsg("Trip request already accepted for other driver", 403);
    }

    // Calculate the driver's balance after deducting the commission

    const driverBalance =
      driver.wallet.balance - tripRequest.price * CommissionRate.normal;

    // Check if the driver has enough balance to propose the price

    if (driverBalance < 0) {
      throw new ErrorMsg(
        "Driver does not have enough balance to propose this price",
        403
      );
    }

    // Handle possible actions

    switch (action) {
      case TripRequestActions.PROPOSE:
        // Propose a new price and update the status to NEGOTIATION
        const negotiatedTripRequest = await tripRequest.updateOne({
          status: RequestStatus.NEGOTIATION,
        });

        // Send notification to the user about the new proposal

        const notificationsSended =
          await commonServices.sendNotificationToDevice({
            tokenDevice: tripRequest.user_info?.device?.token ?? "",
            title: `New proposal of ${
              user_info?.first_name ?? "Driver"
            } for your trip request`,
            description:
              "A trip request is waiting for you. Open the app to accept.",
            data: {
              tripRequestId: tripRequestId,
              driver: customDrivberInfo,
              vehicle: vehicle_selected,
              counterOffer: counterOffer,
            },
          });

        return {
          message: "Trip request proposed successfully",
          info: {
            tripRequestId: tripRequestId,
            driver: customDrivberInfo,
            vehicle: vehicle_selected,
            counterOffer: counterOffer,
          },
        };

      case TripRequestActions.REJECT:
        // Rechazar la solicitud de viaje y actualizar el estado a PENDIENTE

        await tripRequest.updateOne({ status: RequestStatus.PENDING });

        return {
          message: "Solicitud de viaje rechazada.",
          info: { tripRequestId },
        };

      //Logica para aceptar la solicitud de viaje
      case TripRequestActions.ACCEPT:
        // Acepta la solicitud y actualiza el estado a ACEPTADO
        await tripRequest.updateOne({ status: RequestStatus.ACCEPTED });

        // Encuentra descuentos activos para el pasajero.
        const passengerDiscounts = await DiscountModel.find({
          user_id: tripRequest.user_id,
          is_active: true,
        }).exec();

        // Calcular la tarifa final considerando descuentos
        const finalFare =
          passengerDiscounts?.length == 0
            ? tripRequest.price
            : tripRequest.price -
              tripRequest.price * passengerDiscounts[0].amount;

        // Create a new trip

        const newTrip = await TripModel.create({
          passenger_id: tripRequest.user_id,
          driver_id: driverId,
          vehicle_id: vehicleId,
          trip_request_id: tripRequestId,
          discount_id:
            passengerDiscounts?.length == 0 ? null : passengerDiscounts[0]._id,
          total_fare: tripRequest.price,
          final_fare: finalFare,
          status: TripStatus.WAITING_DRIVER,
          acceptedAt: new Date(),
        });
        // .populate(
        //   { path: "driver", model: "Drivers", populate: { path: "user_info" } }
        // ).promote("passenger").exec();

        // Send notification to the user

        // agregar ubicacion de ambos para mostrarlos en el mapa

        const acceptanceNotificationSent =
          await commonServices.sendNotificationToDevice({
            tokenDevice: tripRequest.user_info?.device?.token ?? "",
            title: `Your trip request has been accepted!`,
            description: `${
              driver?.user_info?.first_name ?? "A driver"
            } is on the way!`,
            data: {
              data: JSON.stringify({ tripRequest, driver, newTrip }),
            },
          });

        return {
          message: "Trip request accepted successfully",
          info: { newTrip, tripRequestId, acceptanceNotificationSent },
        };

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    throw error;
  }
};
