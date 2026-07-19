import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

export const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("ready", () => {
  console.log("Redis ready");
});

connection.on("close", () => {
  console.log("Redis connection closed");
});

connection.on("reconnecting", () => {
  console.log("🟡 Reconnecting to Redis...");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});
