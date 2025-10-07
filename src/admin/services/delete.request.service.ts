import { DeleteRequestModel, IDeleteRequest } from "../../users/models/request.deleted.model";
import { VehicleModel, DriverModel } from "../../users/models";
import { ErrorMsg } from "../../common/utils";
import { Types } from "mongoose";
import { UserService } from "../services/user.service";
import { DriverService } from "../services/driver.service";

const userService = new UserService();
export class DeleteRequestService {
  // Crear solicitud de eliminación
  static async createDeleteRequest(
    type: "user" | "vehicle",
    requesterId: string,
    reason: string,
    targetId?: string
  ): Promise<IDeleteRequest> {
    if (!requesterId) throw new ErrorMsg("El ID del usuario es requerido", 400);
    if (!Types.ObjectId.isValid(requesterId))
      throw new ErrorMsg("El ID del usuario no es válido", 400);

    if (!reason || reason.trim().length < 5)
      throw new ErrorMsg("Debes especificar un motivo de al menos 5 caracteres", 400);

    if (type === "vehicle") {
      if (!targetId) throw new ErrorMsg("El ID del vehículo es requerido", 400);
      if (!Types.ObjectId.isValid(targetId))
        throw new ErrorMsg("El ID del vehículo no es válido", 400);

      const vehicle = await VehicleModel.findById(targetId);
      if (!vehicle) throw new ErrorMsg("Vehículo no encontrado", 404);

      const existingRequest = await DeleteRequestModel.findOne({
        vehicle_id: new Types.ObjectId(targetId),
        status: "pending",
      });
      if (existingRequest)
        throw new ErrorMsg("Ya existe una solicitud de eliminación pendiente para este vehículo", 400);
    } else {
      const existingRequest = await DeleteRequestModel.findOne({
        user_id: new Types.ObjectId(requesterId),
        type: "user",
        status: "pending",
      });
      if (existingRequest)
        throw new ErrorMsg("Ya tienes una solicitud de eliminación pendiente", 409);
    }

    // Crear la solicitud
    const payload: Partial<IDeleteRequest> = {
      type,
      user_id: new Types.ObjectId(requesterId),
      reason,
      requested_at: new Date(),
      status: "pending",
    };
    if (type === "vehicle" && targetId) {
      payload.vehicle_id = new Types.ObjectId(targetId);
    }
    const deleteRequest = await DeleteRequestModel.create(payload);

    return deleteRequest;
  }

  // Obtener solicitudes pendientes (opcionalmente por tipo)
  static async getPendingRequests(type?: "user" | "vehicle") {
    const filter: any = { status: "pending" };
    if (type) filter.type = type;

    return DeleteRequestModel.find(filter)
      .populate({ path: "user_id", select: "first_name last_name email", populate: { path: "driver", select: "license.status_request" } })
      .populate("vehicle_id", "plates brand model")
      .sort({ requested_at: -1 })
      .lean();
  }

  //  Aprueba una solicitud de eliminación
  static async approveRequest(
    requestId: string,
    adminId: string
  ): Promise<IDeleteRequest> {
    if (!Types.ObjectId.isValid(requestId))
      throw new ErrorMsg("ID de solicitud inválido", 400);
    if (!Types.ObjectId.isValid(adminId))
      throw new ErrorMsg("ID de administrador inválido", 400);

    const request = await DeleteRequestModel.findById(requestId);
    if (!request) throw new ErrorMsg("Solicitud no encontrada", 404);
    if (request.status !== "pending")
      throw new ErrorMsg("La solicitud ya fue revisada", 400);

    request.status = "approved";
    request.reviewed_at = new Date();
    request.reviewed_by = new Types.ObjectId(adminId);

    await request.save();

    if (request.type === "vehicle" && request.vehicle_id) {
      await VehicleModel.deleteOne({ _id: request.vehicle_id });
    }

    if (request.type === "user") {
      const userId = request.user_id.toString();
      const driver = await DriverModel.findOne({ user_id: new Types.ObjectId(userId) });
      if (driver) {
        // Si tiene cuenta de conductor, desactivar conductor y usuario
        await DriverService.desactivate(driver._id.toString());
      } else {
        // Si no es conductor, solo desactivar usuario
        await userService.deactivateUser(userId);
      }
    }
    await request.deleteOne();
    return request;
  }
}