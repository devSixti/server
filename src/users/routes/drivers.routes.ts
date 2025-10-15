import { Router } from "express";
import { driverControllers } from "../controller";
import { isAuth } from "../../common/middlewares"; // Asegúrate de importar el middleware

const router = Router();

// Middleware de autenticación
router.use(isAuth);

// Crear o actualizar driver
router.post("/", driverControllers.DriverController.createOrUpdate);
// Obtener info del driver
router.get("/", driverControllers.DriverController.getInfo);
// Cambiar disponibilidad del driver
router.put("/availability", driverControllers.DriverController.changeAvailability);
// Cambiar rol del usuario
router.put("/role", driverControllers.DriverController.changeRole);

export default router;