import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorMsg } from "../../common/utils";
import { envValues } from "../../common/config";
import { DriverModel } from "../../users/models";

// Extiende la interfaz Request de Express para incluir info del usuario autenticado
export interface AuthenticatedRequest extends Request {
  uid?: string;
  driver_uid?: string;
  vehicle_id?: string;
}

// Middleware para la verificación del token de autenticación
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : (req.headers["x-token"] as string | undefined);

    if (!token) throw new ErrorMsg("No autorizado: token no proporcionado", 401);

    const decoded = jwt.verify(token, envValues.access_token_secret) as JwtPayload | string;

    if (typeof decoded !== "object" || decoded === null) {
      throw new ErrorMsg("Token inválido: contenido inesperado", 401);
    }

    const payload = decoded as JwtPayload & {
      uid?: string;
      id?: string;
    };

    const uid = payload.uid || payload.id;
    if (!uid) throw new ErrorMsg("Token inválido: no contiene uid/id", 401);

    req.uid = uid;

    // Buscar el conductor y su vehículo
    const driver = await DriverModel.findOne({ user_id: uid }).select("vehicle_id");

    if (driver) {
      req.driver_uid = driver._id.toString();
      req.vehicle_id = driver.vehicle_id?.toString();

      if (!req.vehicle_id) {
        throw new ErrorMsg("Vehicle ID no encontrado en base de datos", 400);
      }
    } else {
      // No hay conductor asignado: usuario probablemente es pasajero
      // No asignamos driver_uid ni vehicle_id, pero dejamos pasar
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError)
      return next(new ErrorMsg("El token ha expirado", 401));
    if (error instanceof jwt.JsonWebTokenError)
      return next(new ErrorMsg("Token inválido", 401));

    next(error);
  }
};