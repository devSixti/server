import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";

// Tipo de payload mínimo esperado
interface AuthPayload {
  id?: string;
}

// Función para generar un token genérico
const generateToken = (
  payload: AuthPayload,
  secret: string,
  expiresIn: string | number
): string => {
  if (!secret) throw new Error("Secret key no definida");
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Genera un access token y un refresh token con expiraciones diferentes.
 */
export const generateTokens = (payload: AuthPayload) => {
  const {
    jwt_secret, // backward compatibility
    access_token_secret = jwt_secret,
    refresh_token_secret = jwt_secret,
  } = envValues;

  if (!access_token_secret || !refresh_token_secret) {
    throw new Error("JWT secrets no definidos en envValues");
  }

  const accessToken = generateToken(payload, access_token_secret, "15m");
  const refreshToken = generateToken(payload, refresh_token_secret, "7d");

  return { accessToken, refreshToken };
};

/**
 * Verifica un token usando el secret adecuado.
 */
export const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access"
): AuthPayload => {
  const {
    jwt_secret,
    access_token_secret = jwt_secret,
    refresh_token_secret = jwt_secret,
  } = envValues;

  const secret = type === "access" ? access_token_secret : refresh_token_secret;

  if (!secret) throw new Error("Secret key no definida para verificación");

  return jwt.verify(token, secret) as AuthPayload;
};