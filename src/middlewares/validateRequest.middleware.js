import { ApiError } from "../utils/ApiError.js";
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return next(
        new ApiError(
          400,
          error.details.map((err) => err.message).join(", ")
        )
      );
    }
    req.body = value;
    next();
  };
};