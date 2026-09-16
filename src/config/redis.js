import Redis from "ioredis";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";

dotenv.config({
  path: "./.env",
});

if (!process.env.REDIS_URL) throw new Error("REDIS_URL is missing");
export const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  logger.info("Redis connected");
});
connection.on("ready", () => {
  logger.info("Redis ready");
});
connection.on("close", () => {
  logger.info("Redis connection closed");
});
connection.on("reconnecting", () => {
  logger.info("🟡 Reconnecting to Redis...");
});
connection.on("error", (err) => {
  logger.error("Redis connection error:", err);
});
