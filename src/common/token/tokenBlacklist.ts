import { redisClient } from "./redis";

// Agrega un jti (JWT ID) al blacklist con TTL en segundos
export const addToBlacklist = async (jti: string, expiresInSeconds: number) => {
  if (!jti || expiresInSeconds <= 0) return;
  await redisClient.setex(`bl:${jti}`, expiresInSeconds, "revoked");
};
// Verifica si un jti está en el blacklist
export const isBlacklisted = async (jti: string): Promise<boolean> => {
  if (!jti) return false;
  const val = await redisClient.get(`bl:${jti}`);
  return val !== null;
};
