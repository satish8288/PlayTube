import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

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

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pageNumber = Math.max(Number(page), 1);
  const limitNumber = Math.max(Number(limit), 1);

  const allowedSortFields = ["createdAt", "views", "duration", "title"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const sortOrder = sortType === "asc" ? 1 : -1;

  const match = {
    isPublished: true,
  };

  const sort = {
    [sortField]: sortOrder,
  };

  if (userId) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  if (query) {
    match.$or = [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  const aggregate = Video.aggregate([
    {
      $match: match,
    },
    {
      $sort: sort,
    },

    {
      $lookup: {
        from: "users",

        localField: "owner",

        foreignField: "_id",

        as: "owner",

        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  const options = {
    page: pageNumber,
    limit: limitNumber,
  };

  const videos = await Video.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { publishAVideo, getAllVideos };
