import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";

interface AuthPayload {
    id?: string
}

/**
 * Genera un token JWT a partir de un payload.
 *  */

export const generateJWT = async (payload: AuthPayload, expiresIn: number | undefined = undefined) => {

    try {
        const { jwt_secret: secrets } = envValues;

        if (!secrets) {
            throw new Error("La variable de entorno SECRETKEY no está definida");
        }

        const options = expiresIn ? { expiresIn } : {};

        const token = jwt.sign(payload, secrets, options);

        return token

    } catch (error) {
        console.error('Error al generar JWT:', error);
        throw error;
    }
};

