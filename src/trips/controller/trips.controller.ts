import { ExpressController } from "../../common/types";
import { TripRequestService } from "../services/trip.request.service";
import { TripNegotiationService } from "../services/trip.negotiation.service";
import { TripLifecycleService } from "../services/tripLifecycle.service";
import { ReviewService } from "../../users/services/calificate.user.service";
import { TripStatus } from "../types";

/* ============================
   Solicitud y negociación de viajes
   ============================ */

/**
 * Solicita un nuevo viaje.
 * @route POST /trips/request
 */
export const tripRequest: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const tripInfo = req.body;

    const result = await TripRequestService.createTripRequest(id, tripInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al conductor aceptar, rechazar o negociar un viaje.
 * @route PUT /trips/:tripRequestId/negotiate
 */
export const negotiateTripRequest: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const vehicleId = req.vehicle_uid as string;
    const { tripRequestId } = req.params;
    const { action, counterOffer } = req.body;

    const result = await TripNegotiationService.handleNegotiation({
      driverId,
      vehicleId,
      tripRequestId,
      action,
      counterOffer,
      initiatedBy: "driver",
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al pasajero responder a una negociación realizada por el conductor.
 * @route PUT /trips/:tripRequestId/passenger-negotiate
 */
export const passegerNegotiation: ExpressController = async (req, res, next) => {
  try {
    const passegerId = req.uid as string;
    const { vehicleId, driverId } = req.query as { vehicleId: string; driverId: string };
    const { tripRequestId } = req.params;
    const { action } = req.body;

    const result = await TripNegotiationService.handleNegotiation({
      driverId,
      vehicleId,
      tripRequestId,
      action,
      initiatedBy: "passenger",
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* ============================
   Estados del viaje
   ============================ */

/**
 * Marca que el conductor ha llegado al punto de inicio.
 * @route PUT /trips/:tripId/arrived
 */
export const driverArrived: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await TripLifecycleService.changeStatus(
      tripId,
      driverId,
      TripStatus.DRIVER_ARRIVED,
      { role: "driver" }
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


/**
 * Cancela un viaje solicitado por el pasajero.
 * @route PUT /trips/:tripId/cancel
 */
export const cancelTrip: ExpressController = async (req, res, next) => {
  try {
    const passengerId = req.uid as string;
    const { tripId } = req.params;

    const result = await TripLifecycleService.cancelTrip(tripId, passengerId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Inicia un viaje por parte del conductor.
 * @route PUT /trips/:tripId/start
 */
export const startTrip: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await TripLifecycleService.startTrip(tripId, driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Finaliza un viaje por parte del conductor.
 * @route PUT /trips/:tripId/finish
 */
export const finishTrip: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await TripLifecycleService.finishTrip(tripId, driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/* ============================
   Calificación de usuarios
   ============================ */

/**
 * Permite al conductor calificar a un pasajero.
 * @route PUT /trips/:tripId/calificate
 */
export const calificateUser: ExpressController = async (req, res, next) => {
  try {
    const userId = req.uid as string;
    const { tripId } = req.params;
    const calificationInfo = req.body;

    const result = await ReviewService.calificateUser(userId, tripId, calificationInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
