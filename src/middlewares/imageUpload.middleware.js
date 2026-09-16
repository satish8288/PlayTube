import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { ALLOWED_IMAGE_TYPES } from "../constants/fileValidation.js";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(
      new ApiError(400, `Invalid file type for field: ${file.fieldname}`)
    );
  }
  return cb(null, true);
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

