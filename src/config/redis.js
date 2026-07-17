import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

export const connection = new Redis(process.env.REDIS_URL);

connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("ready", () => {
  console.log("Redis ready");
});

connection.on("close", () => {
  console.log("Redis connection closed");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});
