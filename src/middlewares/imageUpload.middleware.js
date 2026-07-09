import multer from "multer";
import path from "path";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/octet-stream",
];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/temp");
  },

  filename(req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  console.log("Incoming file mimetype:", file.mimetype, file.originalname);
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, PNG ,jfif and WEBP images are allowed.")
    );
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

export const uploadImage = upload;
