import { Router } from "express";
import { userControllers } from "../controller";

const router = Router();

// Auth
router.post("/auth", userControllers.UserController.authOrCreateUser);
router.post("/logout", userControllers.UserController.logout);
router.post("/verify-phone", userControllers.UserController.verifyPhone);

// Calificar usuario
router.post("/trips/:tripId/review", userControllers.UserController.calificateUser);

// Perfil usuario
router.get("/:userId/profile", userControllers.UserController.getUserProfile);

// Eliminar usuario
router.delete("/:userId", userControllers.UserController.deleteAccount);

// Email
router.put("/:userId/email", userControllers.UserController.updateEmail);
router.post("/email/verify", userControllers.UserController.verifyEmail);

// Información personal
router.put("/:userId/personal-info", userControllers.UserController.updatePersonalInfo);

// Documentos
router.post("/:userId/document", userControllers.UserController.saveDocument);

// Device
router.put("/:userId/device", userControllers.UserController.updateDevice);

export default router;
