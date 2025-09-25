import { Request, Response, NextFunction } from "express";
import { ErrorMsg } from "../../common/utils"; 
import { UserModel } from "../../users/models"; 

interface AuthenticatedRequest extends Request {
  uid?: string;
}

export const checkUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.uid;

    if (!userId) {
      throw new ErrorMsg("No autorizado: uid no encontrado en el token", 401);
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }

    if (
      !user.first_name?.trim() ||
      !user.last_name?.trim() ||
      !user.email?.address?.trim() ||
      !user.phone?.number?.trim()
    ) {
      throw new ErrorMsg(
        "La información del usuario está incompleta. Por favor complete su perfil.",
        403
      );
    }

    if (user.email?.address === null || user.email?.address === undefined) {
      throw new ErrorMsg("Email es obligatorio.", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
};