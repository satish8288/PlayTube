import { getVideoByIdPipeline } from "../pipelines/video.pipeline.js";
import { Video } from "../models/video.model.js";
export const getVideoByIdService = async (videoId, userId) => {
  const pipeline = getVideoByIdPipeline(videoId, userId);

  const video = await Video.aggregate(pipeline);

  return video;
};
