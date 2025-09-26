import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorMsg } from "../../common/utils";

// Extiende la interfaz Request de Express para incluir el uid del usuario autenticado
export interface AuthenticatedRequest extends Request {
    uid?: string; 
}
// Middleware para la verificación del token de autenticación
export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response, 
    next: NextFunction 
) => {
    try {
        // Intentamos obtener el token desde el encabezado Authorization (con Bearer) o desde "x-token"
        const authHeader = req.headers["authorization"];
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1] 
            : (req.headers["x-token"] as string | undefined); 

        if (!token) throw new ErrorMsg("No autorizado: token no proporcionado", 401);
        // Verificamos el token usando la clave secreta definida en las variables de entorno
        const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload | string;
        // Validamos que el contenido decodificado sea un objeto y tenga las propiedades esperadas
        if (typeof decoded !== "object" || decoded === null) {
            throw new ErrorMsg("Token inválido: contenido inesperado", 401); 
        }
        // Extraemos el `uid` (identificador único) del payload del token, El token puede contener el campo `uid` o `id`, por eso lo buscamos en ambos casos
        const uid = (decoded as JwtPayload & { uid?: string; id?: string }).uid
            || (decoded as JwtPayload & { uid?: string; id?: string }).id;

        if (!uid) throw new ErrorMsg("Token inválido: no contiene uid/id", 401);
        // Asignamos el `uid` al objeto `req` para que esté disponible en otros middlewares/controladores
        req.uid = uid;
        next();
    } catch (error) {
        // Si el token ha expirado, Si el token es inválido o tiene algún otro error relacionado con JWT lanzamos un error con mensaje adecuado y código 401
        if (error instanceof jwt.TokenExpiredError) return next(new ErrorMsg("El token ha expirado", 401));
        if (error instanceof jwt.JsonWebTokenError) return next(new ErrorMsg("Token inválido", 401));
        next(error);
    }
};