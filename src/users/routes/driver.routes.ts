import { Router } from "express";
import { driverControllers } from "../controller";
import { checkDriver } from "../../trips/middlewares";

const router = Router();

router.get("/vehicles", driverControllers.getDriverVehicle);
router.post("/create-or-update", driverControllers.createOrUpdateDriver);
router.put("/change-role", driverControllers.changeDriverRole);
router.put("/change-available", checkDriver, driverControllers.changeDriverAvailable);
router.get("/my-info", driverControllers.myDriverRequestInfo);

export default router;
