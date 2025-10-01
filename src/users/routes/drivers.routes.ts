import { Router } from "express";
import { driverControllers } from "../controller";

const router = Router();

// Crear o actualizar driver
router.post("/:userId", driverControllers.DriverController.createOrUpdate);

// Obtener info del driver
router.get("/:driverId", driverControllers.DriverController.getInfo);

// Cambiar disponibilidad
router.put("/:driverId/availability", driverControllers.DriverController.changeAvailability);

// Cambiar rol de driver
router.put("/:userId/role", driverControllers.DriverController.changeRole);

export default router;
