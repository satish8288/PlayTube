import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

const queueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
};

const videoDeletionQueue = new Queue("video-deletion", queueOptions);

export { videoDeletionQueue };
