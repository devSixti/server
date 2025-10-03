import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";
import { ErrorMsg } from "./errors.message.utils";
import { verifyToken } from "./generate.jwt.utils";

/**
 * Extrae y verifica el payload de un token JWT.
 *
 */
export const extractPayload = (token: string): any => {
  try {
    if (!token) {
      throw new ErrorMsg("Por favor, proporciona tu token de acceso.", 401);
    }
    return verifyToken(token, "access");
  } catch (error) {
  console.error("[extractPayload] Error al verificar token:", error);

  if (error instanceof jwt.TokenExpiredError) {
    throw new ErrorMsg("Tu token ha expirado. Por favor, inicia sesión nuevamente.", 401);
  } else if (error instanceof jwt.JsonWebTokenError) {
    throw new ErrorMsg("Token inválido. Proporciona un token de acceso válido.", 401);
  } else if (error instanceof jwt.NotBeforeError) {
    throw new ErrorMsg("El token aún no está activo. Verifica el periodo de validez del token.", 401);
  }

  // Esto es lo que lanza el error 500
  throw new ErrorMsg("Ocurrió un error al verificar el token.", 500);
}

};