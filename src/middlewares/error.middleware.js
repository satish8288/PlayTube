// const errorHandler = (err, req, res, next) => {
//   let statusCode = err.statusCode || 500;
//   let message = err.message || "Internal Server Error";

//   const response = {
//     success: false,
//     statusCode,
//     message,
//   };
//   if (err.errors?.length) response.errors = err.errors;
//   res.status(statusCode).json(response);
// };

// export { errorHandler };
// src/middlewares/errorHandler.middleware.js
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // 1. Agar error ApiError instance nahi hai, to usse normalize karo
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof mongoose.Error ? 400 : 500);
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // 2. Response object banao
  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };