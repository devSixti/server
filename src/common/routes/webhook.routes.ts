import { Router } from "express";
import { wompiWebhook } from "../../users/controller/webhook.controller";

const webhookRouter = Router();

webhookRouter.post("/wompi", wompiWebhook);

export default webhookRouter;
