import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";

interface AuthPayload {
  id?: string;
}

const generateToken = (
  payload: AuthPayload,
  secret: string,
  expiresIn: string | number
): string => {
  if (!secret) throw new Error("Secret key no definida");
  return jwt.sign(payload, secret, { expiresIn });
};

export const generateTokens = (
  payload: AuthPayload,
  options?: {
    accessExpiresIn?: string | number;
    refreshExpiresIn?: string | number;
  }
) => {
  const { access_token_secret, refresh_token_secret } = envValues;

  if (!access_token_secret || !refresh_token_secret) {
    throw new Error("JWT secrets no definidos en envValues");
  }

  const accessToken = generateToken(
    payload,
    access_token_secret,
    options?.accessExpiresIn ?? "15m"
  );

  const refreshToken = generateToken(
    payload,
    refresh_token_secret,
    options?.refreshExpiresIn ?? "7d"
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access"
): AuthPayload => {
  const { access_token_secret, refresh_token_secret } = envValues;

  const secret = type === "access" ? access_token_secret : refresh_token_secret;
  if (!secret) throw new Error("Secret key no definida para verificación");

  return jwt.verify(token, secret) as AuthPayload;
};