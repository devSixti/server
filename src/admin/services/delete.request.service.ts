import { DeleteRequestModel, IDeleteRequest } from "../../users/models/request.deleted.model";
import { VehicleModel, UserModel } from "../../users/models";
import { ErrorMsg } from "../../common/utils";
import { Types } from "mongoose";
import { UserService } from "../../users/services/users";

export class DeleteRequestService {
  /**
   * 📦 Crear solicitud de eliminación
   */
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

    // 🧾 Crear la solicitud
    const deleteRequest = await DeleteRequestModel.create({
      type,
      user_id: new Types.ObjectId(requesterId),
      ...(type === "vehicle" ? { vehicle_id: new Types.ObjectId(targetId!) } : {}),
      reason,
      requested_at: new Date(),
      status: "pending",
    });

    return deleteRequest;
  }

  /**
   * 📋 Obtener solicitudes pendientes (opcionalmente por tipo)
   */
  static async getPendingRequests(type?: "user" | "vehicle") {
    const filter: any = { status: "pending" };
    if (type) filter.type = type;

    return DeleteRequestModel.find(filter)
      .populate("user_id", "first_name last_name email")
      .populate("vehicle_id", "plates brand model")
      .sort({ requested_at: -1 })
      .lean();
  }

  /**
   * ⚙️ Actualizar estado de solicitud (approve/reject)
   * Si se aprueba:
   * - Usuario → se desactiva (no se elimina)
   * - Vehículo → se elimina del sistema
   */
  static async updateRequestStatus(
    requestId: string,
    status: "approved" | "rejected",
    adminId: string,
    responseMessage?: string
  ): Promise<IDeleteRequest> {
    if (!Types.ObjectId.isValid(requestId))
      throw new ErrorMsg("ID de solicitud inválido", 400);
    if (!Types.ObjectId.isValid(adminId))
      throw new ErrorMsg("ID de administrador inválido", 400);

    const request = await DeleteRequestModel.findById(requestId);
    if (!request) throw new ErrorMsg("Solicitud no encontrada", 404);

    // Actualizar estado y trazabilidad
    request.status = status;
    request.reviewed_at = new Date();
    request.reviewed_by = new Types.ObjectId(adminId);
    if (responseMessage) request.response_message = responseMessage;
    await request.save();

    // 🟢 Si se aprueba
    if (status === "approved") {
      if (request.type === "vehicle" && request.vehicle_id) {
        const vehicle = await VehicleModel.findById(request.vehicle_id);
        if (vehicle) {
          await VehicleModel.deleteOne({ _id: vehicle._id }); 
        }
      }

      if (request.type === "user" && request.user_id) {
        // Usa tu servicio existente
        await UserService.deleteAccount(request.user_id.toString());
      }
    }

    return request;
  }
}