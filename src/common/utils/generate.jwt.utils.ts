import { envValues } from "../../common/config";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface AuthPayload {
  id?: string | Types.ObjectId;
  jti?: string;
}

const generateToken = (
  payload: AuthPayload,
  secret: string,
  expiresIn: string | number,
  jti: string
): string => {
  if (!secret) throw new Error("Secret key no definida");
  return jwt.sign({ ...payload, jti }, secret, { expiresIn });
};

export const generateTokens = (
  payload: { id: string | Types.ObjectId },
  options?: {
    accessExpiresIn?: string | number;
    refreshExpiresIn?: string | number;
  }
) => {
  const { access_token_secret, refresh_token_secret } = envValues;
  if (!access_token_secret || !refresh_token_secret) {
    throw new Error("JWT secrets no definidos en envValues");
  }

  const accessJti = uuidv4(); 
  const refreshJti = uuidv4();

  const accessToken = generateToken(
    { id: payload.id },
    access_token_secret,
    options?.accessExpiresIn ?? "10m",
    accessJti
  );

  const refreshToken = generateToken(
    { id: payload.id },
    refresh_token_secret,
    options?.refreshExpiresIn ?? "7d",
    refreshJti
  );

  return {
    accessToken,
    refreshToken,
    accessJti,
    refreshJti,
  };
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