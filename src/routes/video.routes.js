import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadVideoAndThumbnail } from "../middlewares/videoUpload.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

const router = Router();

router.post("/", verifyJWT, uploadVideoAndThumbnail, publishAVideo);

export default router;
