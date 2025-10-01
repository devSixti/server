import { Router } from "express";
import { discountController } from "../controller";

const router = Router();

// POST /discounts/activate
router.post("/activate", discountController.DiscountController.activate);

// POST /discounts/generate
router.post("/generate", discountController.DiscountController.generate);

export default router;
