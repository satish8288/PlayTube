import multer from "multer";
import path from "path";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const ALLOWED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  if (
    file.fieldname === "videoFile" &&
    ALLOWED_VIDEO_TYPES.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  if (
    file.fieldname === "thumbnail" &&
    ALLOWED_THUMBNAIL_TYPES.includes(file.mimetype)
  ) {
    return cb(null, true);
  }

  cb(new Error(`Invalid file type for ${file.fieldname}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
});

export const uploadVideoAndThumbnail = upload.fields([
  {
    name: "videoFile",
    maxCount: 1,
  },
  {
    name: "thumbnail",
    maxCount: 1,
  },
]);
