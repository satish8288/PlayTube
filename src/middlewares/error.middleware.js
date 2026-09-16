// middlewares/error.middleware.js
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error instanceof mongoose.Error.CastError) {
    error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    error = new ApiError(409, `${field} already exists`);
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((val) => val.message);
    error = new ApiError(400, messages.join(", "));
  }
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  logger.error(`${req.method} ${req.originalUrl} — ${error.message}`, {
    stack: error.stack,
  });

  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };