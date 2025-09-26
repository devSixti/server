import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ErrorMsg } from "../../common/utils";

export interface AuthenticatedRequest extends Request {
    uid?: string;
}

export const authMiddleware = (
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

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload | string;

        // Validar que sea objeto y tenga uid o id
        if (typeof decoded !== "object" || decoded === null) {
            throw new ErrorMsg("Token inválido: contenido inesperado", 401);
        }

        const uid = (decoded as JwtPayload & { uid?: string; id?: string }).uid
            || (decoded as JwtPayload & { uid?: string; id?: string }).id;

        if (!uid) throw new ErrorMsg("Token inválido: no contiene uid/id", 401);

        req.uid = uid;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) return next(new ErrorMsg("El token ha expirado", 401));
        if (error instanceof jwt.JsonWebTokenError) return next(new ErrorMsg("Token inválido", 401));
        next(error);
    }
};