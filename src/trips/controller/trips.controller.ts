import { ExpressController } from "../../common/types";
import * as tripsServices from "../services";

/* ============================
   Solicitud y negociación de viajes
   ============================ */

/**
 * Solicita un nuevo viaje.
 * @route POST /trips/request
 * @param req.uid - ID del pasajero que solicita el viaje
 * @param req.body - Información del viaje
 * @returns Detalles del viaje solicitado
 */
export const tripRequest: ExpressController = async (req, res, next) => {
  try {
    const id = req.uid as string;
    const tripInfo = req.body;

    const result = await tripsServices.tripRequest(id, tripInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al conductor aceptar, rechazar o negociar un viaje.
 * @route PUT /trips/:tripRequestId/negotiate
 * @param req.driver_uid - ID del conductor
 * @param req.vehicle_uid - ID del vehículo
 * @param req.params.tripRequestId - ID del viaje
 * @param req.body.action - Acción del conductor (aceptar/rechazar/negotiar)
 * @param req.body.counterOffer - Oferta de contra-negociación (opcional)
 * @returns Resultado de la negociación
 */
export const negotiateTripRequest: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const vehicleId = req.vehicle_uid as string;
    const { tripRequestId } = req.params;
    const { action, counterOffer } = req.body;

    const result = await tripsServices.negotiateTripRequest({
      driverId,
      vehicleId,
      tripRequestId,
      action,
      counterOffer,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al pasajero responder a una negociación realizada por el conductor.
 * @route PUT /trips/:tripRequestId/passenger-negotiate
 * @param req.uid - ID del pasajero
 * @param req.query.vehicleId - ID del vehículo
 * @param req.query.driverId - ID del conductor
 * @param req.params.tripRequestId - ID del viaje
 * @param req.body.action - Acción del pasajero (aceptar/rechazar)
 * @returns Resultado de la negociación del pasajero
 */
export const passegerNegotiation: ExpressController = async (req, res, next) => {
  try {
    const passegerId = req.uid as string;
    const { vehicleId, driverId } = req.query as { vehicleId: string; driverId: string };
    const { tripRequestId } = req.params;
    const { action } = req.body;

    const result = await tripsServices.passegerNegotiation({
      passegerId,
      driverId,
      vehicleId,
      tripRequestId,
      action,
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
 * @param req.driver_uid - ID del conductor
 * @param req.params.tripId - ID del viaje
 * @returns Confirmación de llegada
 */
export const driverArrived: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await tripsServices.driverArrived(tripId, driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancela un viaje solicitado por el pasajero.
 * @route PUT /trips/:tripId/cancel
 * @param req.uid - ID del pasajero
 * @param req.params.tripId - ID del viaje
 * @returns Confirmación de cancelación
 */
export const cancelTrip: ExpressController = async (req, res, next) => {
  try {
    const passengerId = req.uid as string;
    const { tripId } = req.params;

    const result = await tripsServices.cancelTrip(tripId, passengerId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Inicia un viaje por parte del conductor.
 * @route PUT /trips/:tripId/start
 * @param req.driver_uid - ID del conductor
 * @param req.params.tripId - ID del viaje
 * @returns Confirmación de inicio del viaje
 */
export const startTrip: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await tripsServices.startTrip(tripId, driverId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Finaliza un viaje por parte del conductor.
 * @route PUT /trips/:tripId/finish
 * @param req.driver_uid - ID del conductor
 * @param req.params.tripId - ID del viaje
 * @returns Confirmación de finalización del viaje
 */
export const finishTrip: ExpressController = async (req, res, next) => {
  try {
    const driverId = req.driver_uid as string;
    const { tripId } = req.params;

    const result = await tripsServices.finishTrip(tripId, driverId);
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
 * @param req.uid - ID del conductor
 * @param req.params.tripId - ID del viaje
 * @param req.body - Información de la calificación
 * @returns Confirmación de calificación
 */
export const calificateUser: ExpressController = async (req, res, next) => {
  try {
    const userId = req.uid as string;
    const { tripId } = req.params;
    const calificationInfo = req.body;

    const result = await tripsServices.calificateUser(userId, tripId, calificationInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
