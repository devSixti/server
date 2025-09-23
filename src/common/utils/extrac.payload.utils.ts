import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";
import { ErrorMsg } from "./errors.message.utils";

/**
 * Extrae y verifica el payload de un token JWT.
 *
 */
export const extractPayload = (token: string): any => {
  try {
    if (!token) {
      throw new ErrorMsg("Por favor, proporciona tu token de acceso.", 401);
    }
    const { jwt_secret: secrets } = envValues;
    const payload = jwt.verify(token, secrets!) as jwt.JwtPayload;
    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ErrorMsg("Tu token ha expirado. Por favor, inicia sesión nuevamente.", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new ErrorMsg("Token inválido. Proporciona un token de acceso válido.", 401);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new ErrorMsg("El token aún no está activo. Verifica el periodo de validez del token.", 401);
    }
    throw new ErrorMsg("Ocurrió un error al verificar el token.", 500);
  }
};