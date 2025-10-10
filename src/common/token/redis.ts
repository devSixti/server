import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) throw new Error("REDIS_URL no definida");

export const redisClient = new Redis(redisUrl);

redisClient.on("connect", () => {
    console.log("[REDIS] Conectado a Redis");
});

redisClient.on("error", (err) => {
    console.error("[REDIS] Error de conexión a Redis:", err);
});