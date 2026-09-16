import { ApiError } from "../utils/ApiError.js";

export const validateFiles = (...fieldNames) => {
  return (req, res, next) => {
    for (const field of fieldNames) {
      const hasFile = req.files?.[field]?.length || req.file?.fieldname === field;
      if (!hasFile) {
        throw new ApiError(400, `${field} file is required`);
      }
    }
    next();
  };
};