import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideoAndThumbnail } from "../middlewares/videoUpload.middleware.js";
import {
  publishAVideo,
  getAllVideos,
  getVideoById,
} from "../controllers/video.controller.js";

const router = Router();

router.post("/", verifyJWT, uploadVideoAndThumbnail, publishAVideo);

router.get("/", verifyJWT, getAllVideos);

router.get("/:videoId", verifyJWT, getVideoById);

export default router;
