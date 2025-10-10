import { redisClient } from "./redis";

// Agrega un jti (JWT ID) al blacklist con TTL en segundos
export const addToBlacklist = async (jti: string, expiresInSeconds: number) => {
  console.log("[BLACKLIST] Ejecutando addToBlacklist:", jti, expiresInSeconds);
  if (!jti || expiresInSeconds <= 0) {
    console.warn("[BLACKLIST] JTI inválido o TTL <= 0. No se guarda.");
    return;
  }
  try {
    await redisClient.setex(`bl:${jti}`, expiresInSeconds, "revoked");
    console.log(`[BLACKLIST] JTI guardado en Redis: bl:${jti}`);
  } catch (error) {
    console.error("[BLACKLIST] Error al guardar en Redis:", error);
  }
};

// Verifica si un jti está en el blacklist
export const isBlacklisted = async (jti: string): Promise<boolean> => {
  if (!jti) return false;
  const val = await redisClient.get(`bl:${jti}`);
  return val !== null;
};
