import { Router } from "express";
import { isAuth } from "../../common/middlewares";
import { checkAdmin } from "../../admin/middlewares";
import { UserController } from "../controller/user.controller";
import { DriverController } from "../controller/driver.controller";
import { VehicleController } from "../controller/vehicle.controller";
import { DeleteRequestModel } from "users/models";
import { DeleteRequestService } from "admin/services";
import { createDeleteRequestController, getPendingDeleteRequestsController, updateDeleteRequestStatusController,} from "../controller/delete.request.controller";

const adminRoutes = Router();

/**
 * Middleware global para todas las rutas de admin:
 * - isAuth: verifica que el usuario esté autenticado
 * - checkAdmin: verifica que el usuario tenga rol de administrador
 */
adminRoutes.use(isAuth, checkAdmin);

/* =========================
   Rutas de Usuarios
   ========================= */

/**
 * Obtiene todos los usuarios con paginación opcional
 * GET /admin/users
 */
adminRoutes.get("/users", UserController.getAll);

/**
 * Busca usuarios según parámetros de búsqueda
 * GET /admin/users/search
 */
adminRoutes.get("/users/search", UserController.search);

/**
 * Desactiva un usuario
 * DELETE /admin/users/:id
 */
adminRoutes.delete("/users/:id", UserController.deactivate);

/* =========================
   Rutas de Conductores
   ========================= */

/**
 * Obtiene todos los conductores
 * GET /admin/drivers
 */
adminRoutes.get("/drivers", DriverController.getAll);

/**
 * Busca conductores
 * GET /admin/drivers/search
 */
adminRoutes.get("/drivers/search", DriverController.search);

/**
 * Aprueba un conductor
 * PUT /admin/drivers/:driverId/approve
 */
adminRoutes.put("/drivers/:driverId/approve", DriverController.approve);

/**
 * Desactiva un conductor
 * DELETE /admin/drivers/:id
 */
adminRoutes.delete("/drivers/:id", DriverController.desactivate);

/* =========================
   Rutas de Vehículos
   ========================= */

/**
 * Obtiene todos los vehículos
 * GET /admin/vehicles
 */
adminRoutes.get("/vehicles", VehicleController.getAll);

/**
 * Obtiene vehículos de un conductor específico
 * GET /admin/drivers/:driverId/vehicles
 */
adminRoutes.get("/drivers/:driverId/vehicles", VehicleController.getByDriver);

/**
 * Aprueba un vehículo
 * PUT /admin/vehicles/:vehicleId/approve
 */
adminRoutes.put("/vehicles/:vehicleId/approve", VehicleController.approve);

/**
 * Elimina un vehículo
 * DELETE /admin/vehicles/:vehicleId
 */
adminRoutes.delete("/vehicles/:vehicleId", VehicleController.deleteByVehicleId);

adminRoutes.post("/delete-request", isAuth, createDeleteRequestController);

adminRoutes.get("/delete-requests", isAuth, checkAdmin, getPendingDeleteRequestsController);
adminRoutes.put("/delete-requests/:requestId", isAuth, checkAdmin, updateDeleteRequestStatusController);

export default adminRoutes;