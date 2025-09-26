import { Request, Response, NextFunction } from "express";
import { ErrorMsg } from "../../common/utils";
import { UserModel } from "../../users/models";

// Definición de una interfaz que extiende Request para incluir el campo `uid`
interface AuthenticatedRequest extends Request {
  uid?: string; 
}
// Middleware `checkUser` para verificar que el usuario esté autenticado y su información sea válida
export const checkUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.uid;
    // Verificar si no se encontró el `uid` en la solicitud
    if (!userId) {
      throw new ErrorMsg("No autorizado: uid no encontrado en el token", 401);
    }
    // Buscar al usuario en la base de datos utilizando el `uid`
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new ErrorMsg("Usuario no encontrado", 404);
    }
    // Verificar si el usuario tiene información incompleta en su perfil
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
    // Verificar si el correo electrónico del usuario es nulo o indefinido
    if (user.email?.address === null || user.email?.address === undefined) {
      throw new ErrorMsg("Email es obligatorio.", 400); 
    }
    next();
  } catch (error) {    next(error);
  }
};