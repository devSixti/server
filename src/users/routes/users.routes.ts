import { Router } from "express";
import { userControllers } from "../controller";
import { isAuth } from "../../common/middlewares"; 

const router = Router();

// ====================
// Rutas públicas
// ====================

router.post("/auth", userControllers.UserController.authOrCreateUser);
router.post("/logout", userControllers.UserController.logout);
router.post("/verify-phone", userControllers.UserController.verifyPhone);
router.get("/email/verify", userControllers.UserController.verifyEmail);
router.post("/refresh-token", userControllers.UserController.refreshToken);

// ====================
// Rutas protegidas (requieren token)
// ====================

router.use(isAuth); // todas las siguientes rutas requieren autenticación

// Calificar usuario (nota: el userId calificado viene en el body, no afecta auth)
router.post("/:tripId/review", userControllers.UserController.calificateUser);

// Perfil del usuario autenticado
router.get("/profile", userControllers.UserController.getUserProfile);

// Eliminar cuenta del usuario autenticado
router.delete("/delete-account", userControllers.UserController.deleteAccount);

// Actualizar Email
router.put("/email", userControllers.UserController.updateEmail);

// Actualizar Información personal
router.put("/personal-info", userControllers.UserController.updatePersonalInfo);

// Documentos
router.post("/document", userControllers.UserController.saveDocument);

// Device
router.put("/device", userControllers.UserController.updateDevice);

export default router;