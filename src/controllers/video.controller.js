import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const publishAVideo = asyncHandler(async (req, res) => {
  // Form Data
  const { title, description } = req.body;

  // Validation
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // Files
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  // console.log("Video Local Path:", videoLocalPath);
  // console.log("Thumbnail Local Path:", thumbnailLocalPath);

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }

  // Check if the uploaded files are empty
  const videoFile = req.files?.videoFile?.[0];

  if (videoFile.size === 0) {
    throw new ApiError(400, "Video file is empty");
  }

  const thumbnailFile = req.files?.thumbnail?.[0];

  if (thumbnailFile.size === 0) {
    throw new ApiError(400, "Thumbnail is empty");
  }

  const uploadedVideo = await uploadOnCloudinary(videoLocalPath, "videos");
  const uploadedThumbnail = await uploadOnCloudinary(
    thumbnailLocalPath,
    "thumbnails"
  );

  // console.log("Uploaded Video:.............", uploadedVideo);
  // console.log("Uploaded Thumbnail:.............", uploadedThumbnail);

  if (!uploadedVideo) {
    throw new ApiError(500, "Failed to upload video file to Cloudinary");
  }

  // Check minimum video duration
  if (uploadedVideo.duration < 1) {
    await destroyFromCloudinary(uploadedVideo.public_id, "video");
    await destroyFromCloudinary(uploadedThumbnail.public_id);
    throw new ApiError(400, "Video should be at least 5 seconds long");
  }

  if (!uploadedThumbnail) {
    await destroyFromCloudinary(uploadedVideo.public_id, "video");
    await destroyFromCloudinary(uploadedThumbnail.public_id);
    throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
  }

  const video = await Video.create({
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumbnail.secure_url,
    title,
    description,
    duration: uploadedVideo.duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Video published successfully", video));
});

export { publishAVideo };
