import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";

interface AuthPayload {
    id?: string
}

export const generateJWT = async (payload: AuthPayload, expiresIn: number | undefined = undefined) => {

    try {
        const { jwt_secret: secrets } = envValues;

        if (!secrets) {
            throw new Error("The environment variable SECRETKEY is not defined");
        }

        const options = expiresIn ? { expiresIn } : {};

        const token = jwt.sign(payload, secrets, options);

        return token

    } catch (error) {
        console.error('Error generating JWT:', error);
        throw error;
    }
};

