import { Router } from "express";
import { discountsControllers } from "../controller";

const router = Router();

router.put("/activate", discountsControllers.activateDiscount);

export default router;
