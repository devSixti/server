import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://default:YOUR_PASSWORD@your-redis-endpoint:6379";

export const redisClient = new Redis(redisUrl);