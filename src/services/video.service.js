import { getVideoByIdPipeline } from "../pipelines/video.pipeline.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

// get video by id service
const getVideoById = async (videoId, userId) => {
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.aggregate(getVideoByIdPipeline(videoId, userId));

  if (!video.length) {
    throw new ApiError(404, "Video not found");
  }

  // NOTE:
  // In production, views should not be incremented
  // on every request. Apply validation such as
  // watch duration, duplicate prevention, and bot detection.
  video[0].views += 1;

  await Promise.all([
    Video.findByIdAndUpdate(videoId, {
      $inc: {
        views: 1,
      },
    }),

    User.findByIdAndUpdate(userId, {
      $addToSet: {
        watchHistory: videoId,
      },
    }),
  ]);

  return video[0];
};

// toggle publish status service
const togglePublishStatus = async (videoId, userId) => {
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.owner.equals(userId)) {
    throw new ApiError(403, "You are not authorized to update this video");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!updatedVideo) {
    throw new ApiError(500, "Failed to update video publish status");
  }

  return updatedVideo;
};

const videoService = {
  getVideoById,
  togglePublishStatus,
};

export default videoService;
