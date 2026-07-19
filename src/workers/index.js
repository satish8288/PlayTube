import dotenv from "dotenv";
import connectDB from "../db/index.js";
dotenv.config({ path: "./.env" });

try {
  await connectDB();
  console.log("MongoDB connected for workers");
  await import("./videoDeletion.worker.js");
} catch (err) {
  console.error(err);
  process.exit(1);
}
