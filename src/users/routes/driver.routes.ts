import { Router } from "express";
import { driverControllers } from "../controller";
import { checkDriver } from "../../trips/middlewares";

const router = Router();

router.get("/vehicles", driverControllers.getDriverVehicle);
router.put("/assign-vehicle", driverControllers.assignVehicle);
router.post("/create-or-update", driverControllers.createOrUpdateDriver);
router.post("/add-or-update-vehicle", driverControllers.addOrUpdateVehicle);
router.put("/change-role", driverControllers.changeDriverRole);
router.put("/change-available", checkDriver, driverControllers.changeDriverAvailable);
router.get("/my-info", driverControllers.myDriverRequestInfo);
router.delete("/delete-vehicle/:vehicleId", driverControllers.deleteVehicleById);
router.post("/payment-method", driverControllers.addPaymentMethod);
router.get("/payment-method", driverControllers.getPaymentMethod);

export default router;
