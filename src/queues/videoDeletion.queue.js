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
    removeOnComplete: true,
    removeOnFail: true,
  },
};
const videoDeletionQueue = new Queue("video-deletion", queueOptions);
// const waiting = await videoDeletionQueue.getWaiting();
// const active = await videoDeletionQueue.getActive();
// const failed = await videoDeletionQueue.getFailed();
// const completed = await videoDeletionQueue.getCompleted();
export { videoDeletionQueue };
