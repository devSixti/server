import { Router } from "express";
import { notificationControllers } from "../controller";

const router = Router();

/**
 * Notificar un cambio en el estado de un trip
 * POST /notifications/trip/:tripId
 */
router.post(
  "/trip/:tripId",
  notificationControllers.NotificationController.notifyTripChange
);

export default router;
