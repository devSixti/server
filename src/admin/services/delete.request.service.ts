import {
  DeleteRequestModel,
  IDeleteRequest,
} from "../../users/models/request.deleted.model";
import { ErrorMsg } from "../../common/utils";
import { Types } from "mongoose";

export class DeleteRequestService {
  static async createDeleteRequest(
    userId: string,
    reason?: string
  ): Promise<IDeleteRequest> {
    if (!userId) throw new ErrorMsg("ID de usuario es requerido", 400);
    if (!Types.ObjectId.isValid(userId))
      throw new ErrorMsg("ID de usuario inválido", 400);

    const existingRequest = await DeleteRequestModel.findOne({
      user_id: new Types.ObjectId(userId),
      status: "pending",
    });

    if (existingRequest)
      throw new ErrorMsg(
        "Ya tienes una solicitud de eliminación pendiente",
        409
      );

    const deleteRequest = await DeleteRequestModel.create({
      user_id: new Types.ObjectId(userId),
      reason: reason || "El usuario ha solicitado la eliminación de su cuenta.",
    });

    return deleteRequest;
  }

  static async getPendingRequests(): Promise<
    (IDeleteRequest & { _id: any })[]
  > {
    return DeleteRequestModel.find({ status: "pending" })
      .populate("user_id", "first_name last_name email")
      .lean();
  }

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

    request.status = status;
    request.reviewed_at = new Date();
    request.reviewed_by = new Types.ObjectId(adminId);
    if (responseMessage) request.response_message = responseMessage;

    await request.save();

    return request;
  }
}
