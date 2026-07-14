import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideoAndThumbnail } from "../middlewares/videoUpload.middleware.js";
import {
  publishAVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateVideo,
  deleteVideo
} from "../controllers/video.controller.js";
import { uploadImage } from "../middlewares/imageUpload.middleware.js";

const router = Router();

router.post("/", verifyJWT, uploadVideoAndThumbnail, publishAVideo);

router.get("/", verifyJWT, getAllVideos);

router.get("/:videoId", verifyJWT, getVideoById);

router.patch("/:videoId/toggle-publish", verifyJWT, togglePublishStatus);

router.patch(
  "/:videoId",
  verifyJWT,
  uploadImage.single("thumbnail"),
  updateVideo
);

router.delete("/:videoId", verifyJWT, deleteVideo);

export default router;
