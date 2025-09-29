import { Request, Response, NextFunction } from "express";
import { DeleteRequestService } from "../services/delete.request.service";
import { ErrorMsg } from "../../common/utils";

export const createDeleteRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Aquí usas req.uid que ya viene de isAuth
    const userId = req.uid;
    const { reason } = req.body;

    if (!userId) {
      throw new ErrorMsg("No autorizado: ID de usuario no encontrado", 401);
    }

    const deleteRequest = await DeleteRequestService.createDeleteRequest(userId, reason);
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

export const updateDeleteRequestStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.uid;
    const { requestId } = req.params;
    const { status, responseMessage } = req.body;

    if (!adminId) {
      throw new ErrorMsg("No autorizado: ID de administrador no encontrado", 401);
    }

    if (status !== "approved" && status !== "rejected") {
      throw new ErrorMsg("Estado inválido", 400);
    }

    const updatedRequest = await DeleteRequestService.updateRequestStatus(
      requestId,
      status,
      adminId,
      responseMessage
    );

    return res.json({ success: true, data: updatedRequest });
  } catch (error) {
    next(error);
  }
};