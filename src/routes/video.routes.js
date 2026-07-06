import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideoAndThumbnail } from "../middlewares/videoUpload.middleware.js";
import {
  publishAVideo,
  getAllVideos,
} from "../controllers/video.controller.js";

const router = Router();

router.post("/", verifyJWT, uploadVideoAndThumbnail, publishAVideo);

router.get("/", verifyJWT, getAllVideos);

export default router;
