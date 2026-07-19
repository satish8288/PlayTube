import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { videoService } from "../services/video.service.js";
import { Video } from "../models/video.model.js";

console.log("Workers are running...");
const videoDeletionWorker = new Worker(
  "video-deletion",
  async (job) => {
    // throw new Error("Testing retry");
    console.log(`Processing job ${job.id}.........`);
    const video = await Video.findById(job.data.videoId);
    if (!video) return;
    await videoService.deleteVideo(video);
  },
  { connection }
);

videoDeletionWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

videoDeletionWorker.on("failed", async (job, err) => {
  console.log(
    `Job ${job.id} failed (Attempt ${job.attemptsMade}/${job.opts.attempts})`
  );
  if (!job) return;
  // Retry chal rahi hai, kuch mat karo
  if (job.attemptsMade < job.opts.attempts) return;
  const video = await Video.findById(job.data.videoId);
  if (!video) return;
  video.isDeleting = false;
  await video.save();
});
