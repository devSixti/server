import { Router } from "express";
import { commonControllers } from "../controller";

const commonRouter = Router();

/**
 * Ruta de health check
 * GET /
 * Responde con un mensaje simple para indicar que el servicio está activo
 */
commonRouter.get("/", commonControllers.healthCheck);

export default commonRouter;

