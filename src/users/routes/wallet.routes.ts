import { Router } from "express";
import { walletControllers } from "../../users/controller";
import { wompiWebhook } from "../../users/controller/webhook.controller";


const walletRouter = Router();

walletRouter.post("/accept-conditions", walletControllers.acceptConditions);
walletRouter.post("/add-founds",  walletControllers.addFunds);
walletRouter.get("/get-balance", walletControllers.getBalance);
walletRouter.post("/webhook/wompi", wompiWebhook);


export default walletRouter;