// import "dotenv/config";
import dotenv from "dotenv";
import connectDB from "./db/dbConnection.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT || 3000, () => {
      logger.info(`Server running on port ${PORT || 8000}`);
    });
  })
  .catch((error) => {
    logger.error("MongoDB connection failed", { stack: error.stack });
    process.exit(1);
  });
