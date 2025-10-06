import { Router } from "express";
import { vehiclesControllers } from "../controller";
import { isAuth } from "../../common/middlewares";


const router = Router();
router.use(isAuth); 

// Asignar vehículo
router.put("/assign", vehiclesControllers.DriverVehicleController.assignVehicle);
// Agregar o actualizar vehículo
router.post("/", vehiclesControllers.DriverVehicleController.addOrUpdateVehicle);
// Eliminar vehículo
router.delete("/:vehicleId",vehiclesControllers.DriverVehicleController.deleteVehicleById);
// Obtener todos los vehículos del driver
router.get("/", vehiclesControllers.DriverVehicleController.getDriverVehicle);

export default router;
