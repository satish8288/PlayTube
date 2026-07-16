import { Worker } from "bullmq";
import { connection } from "../config/redis.js";
import { deleteVideo } from "../services/video.service.js";

const worker = new Worker(
  "video-deletion",
  async (job) => {
    await deleteVideo(job.data.videoId);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
