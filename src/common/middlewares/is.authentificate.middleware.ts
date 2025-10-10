import { ExpressController, Status } from "../../common/types";
import { ErrorMsg } from "../../common/utils";
import { UserModel } from "../../users/models";
import { verifyToken } from "../utils/generate.jwt.utils";
import { isBlacklisted } from "../../common/token/tokenBlacklist";

/**
 * Middleware de autenticación.
 * Verifica el token, valida el usuario y agrega uid/driver_uid a la request.
 */

export const isAuth: ExpressController = async (req, res, next) => {
  try {
    const tokenRaw =
      req.header("x-token") ||
      req.header("authorization")?.replace("Bearer ", "");

    if (!tokenRaw || typeof tokenRaw !== "string") {
      console.error("[AUTH] Token no enviado o no es string:", tokenRaw);
      throw new ErrorMsg("Token de acceso inválido o ausente", 401);
    }

    console.log("[AUTH] Token recibido:", tokenRaw);

    let payload;
    try {
      payload = verifyToken(tokenRaw, "access");
    } catch (err) {
      console.error("[AUTH] Error al verificar token:", err);
      throw new ErrorMsg("Token inválido - No se pudo verificar", 401);
    }

    console.log("[AUTH] Payload decodificado completo:", payload);

    const { id, jti } = payload;

    if (!id || !jti) {
      console.error("[AUTH] Payload incompleto:", payload);
      throw new ErrorMsg("Token inválido: falta ID o jti", 401);
    }

    // Verificar si el token está en la blacklist
    const blacklisted = await isBlacklisted(jti);
    if (blacklisted) {
      console.warn("[AUTH] Token revocado (en blacklist):", jti);
      throw new ErrorMsg("Token revocado. Inicia sesión nuevamente", 401);
    }

    console.log("[AUTH] Buscando usuario con ID:", id);
    const user = await UserModel.findById(id).populate("driver");

    if (!user) {
      console.error("[AUTH] Usuario no encontrado para ID:", id);
      throw new ErrorMsg(
        "Usuario no encontrado. Verifica la información e inténtalo de nuevo.",
        404
      );
    }

    console.log("[AUTH] Usuario encontrado:", {
      id: user.id,
      is_active: user.is_active,
      driver: user.driver,
    });

    if (!user.is_active) {
      console.error("[AUTH] Usuario inactivo:", user.id);
      throw new ErrorMsg("Credenciales inválidas - Usuario inactivo.", 403);
    }

    if (user.driver) {
      console.log("[AUTH] Usuario tiene conductor:", user.driver.id);
      req.driver_uid = user.driver.id;
    } else {
      console.log("[AUTH] Usuario sin conductor asignado.");
    }

    req.uid = user.id;
    console.log("[AUTH] Autenticación completada. UID:", req.uid);
    next();
  } catch (error) {
    console.error("[AUTH] Error capturado en isAuth:", error);
    next(error);
  }
};