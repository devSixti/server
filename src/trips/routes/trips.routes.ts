import { Router } from "express";
import { TripRequestController } from "../controller/tripRequest.controller";
import { TripNegotiationController } from "../controller/tripNegotiation.controller";
import { TripLifecycleController } from "../controller/tripLifecycle.controller";

const router = Router();

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
