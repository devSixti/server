import { Router } from "express";
import { tripsController } from "../../trips/controller";
import { checkDriver, checkUser, checkVehicle } from "../../trips/middlewares";
import { isAuth } from "../../common/middlewares";

const router = Router();

/* ============================
   Solicitudes y negociaciones
   ============================ */

/**
 * Solicita un nuevo viaje
 * POST /trip-request
 */
router.post("/trip-request", isAuth, checkUser, tripsController.tripRequest);

/**
 * Permite al conductor negociar un viaje
 * PUT /:tripRequestId/negotiate-trip
 * Middlewares:
 * - checkDriver: valida que el usuario sea conductor
 * - checkVehicle: valida que el vehículo esté asignado correctamente
 */
router.put("/:tripRequestId/negotiate-trip/", checkDriver, checkVehicle, tripsController.negotiateTripRequest);

/**
 * Permite al pasajero responder a una negociación
 * PUT /:tripRequestId/passenger-negotiate-trip
 */
router.put("/:tripRequestId/passenger-negotiate-trip", tripsController.passegerNegotiation);

/* ============================
   Estados del viaje
   ============================ */

/**
 * Marca que el conductor ha llegado al punto de inicio
 * PUT /:tripId/driver-arrived
 * Middlewares:
 * - checkDriver
 * - checkVehicle
 */
router.put("/:tripId/driver-arrived", checkDriver, checkVehicle, tripsController.driverArrived);

/**
 * Cancela un viaje
 * DELETE /:tripId/cancel
 */
router.delete("/:tripId/cancel", tripsController.cancelTrip);

/**
 * Inicia un viaje
 * PUT /:tripId/start
 * Middlewares:
 * - checkDriver
 * - checkVehicle
 */
router.put("/:tripId/start", checkDriver, checkVehicle, tripsController.startTrip);

/**
 * Finaliza un viaje
 * PUT /:tripId/finish
 * Middlewares:
 * - checkDriver
 * - checkVehicle
 */
router.put("/:tripId/finish", checkDriver, checkVehicle, tripsController.finishTrip);

/* ============================
   Calificación de usuarios
   ============================ */

/**
 * Permite calificar a un pasajero después del viaje
 * POST /:tripId/calificate
 */
router.post("/:tripId/calificate", tripsController.calificateUser);

export default router;
 
