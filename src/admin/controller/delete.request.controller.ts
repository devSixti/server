import { Request, Response, NextFunction } from "express";
import { DeleteRequestService } from "../services/delete.request.service";
import { ErrorMsg } from "../../common/utils";

export const createDeleteRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Aquí se usa req.uid que ya viene de isAuth
    const userId = req.uid;
    const { reason } = req.body;

    if (!userId) {
      throw new ErrorMsg("No autorizado: ID de usuario no encontrado", 401);
    }

    const deleteRequest = await DeleteRequestService.createDeleteRequest("user", userId, reason);
    return res.status(201).json({ success: true, data: deleteRequest });
  } catch (error) {
    next(error);
  }
};

export const getPendingDeleteRequestsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await DeleteRequestService.getPendingRequests();
    return res.json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const approveDeleteRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.uid;
    const { requestId } = req.params;
    if (!adminId) {
      throw new ErrorMsg("No autorizado: ID de administrador no encontrado", 401);
    }
    const updatedRequest = await DeleteRequestService.approveRequest(requestId, adminId);
    return res.status(200).json({
      status: "success",
      message: "Solicitud aprobada correctamente",
      data: {
        request_id: updatedRequest._id,
        status: updatedRequest.status,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};