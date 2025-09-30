import { Router } from "express";
import { vehiclesControllers } from "../controller";

const router = Router();

// Asignar vehículo
router.put("/:driverId/vehicles/:vehicleId/assign", vehiclesControllers.DriverVehicleController.assignVehicle);

// Agregar o actualizar vehículo
router.post("/:driverId/vehicles", vehiclesControllers.DriverVehicleController.addOrUpdateVehicle);

// Eliminar vehículo
router.delete("/:driverId/vehicles/:vehicleId", vehiclesControllers.DriverVehicleController.deleteVehicleById);

// Obtener todos los vehículos del driver
router.get("/:driverId/vehicles", vehiclesControllers.DriverVehicleController.getDriverVehicle);

export default router;
