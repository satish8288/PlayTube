import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideoAndThumbnail } from "../middlewares/videoUpload.middleware.js";
import {
  publishAVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
} from "../controllers/video.controller.js";

const router = Router();

router.post("/", verifyJWT, uploadVideoAndThumbnail, publishAVideo);

router.get("/", verifyJWT, getAllVideos);

router.get("/:videoId", verifyJWT, getVideoById);

router.patch("/:videoId/toggle-publish", verifyJWT, togglePublishStatus);

export default router;
