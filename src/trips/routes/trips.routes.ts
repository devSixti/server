import { Router } from "express";
import { TripRequestController } from "../controller/tripRequest.controller";
import { TripNegotiationController } from "../controller/tripNegotiation.controller";
import { TripLifecycleController } from "../controller/tripLifecycle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkUser } from "../middlewares/check.user.middeleware";

const router = Router();

// Middleware global para todas las rutas de trips
router.use(authMiddleware, checkUser);

// Trip Requests
router.post("/requests", TripRequestController.create);

// Negotiation
router.post("/negotiation", TripNegotiationController.negotiate);

// Lifecycle
router.patch("/:tripId/status", TripLifecycleController.changeStatus);
router.patch("/:tripId/arrived", TripLifecycleController.arrived);
router.patch("/:tripId/start", TripLifecycleController.start);
router.patch("/:tripId/finish", TripLifecycleController.finish);
router.patch("/:tripId/cancel", TripLifecycleController.cancel);

export default router;
