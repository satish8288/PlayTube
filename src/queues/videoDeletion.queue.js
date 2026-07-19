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

const waiting = await videoDeletionQueue.getWaiting();
console.log("waiting job in queue...", waiting);

const active = await videoDeletionQueue.getActive();
console.log("active job...", active);

const failed = await videoDeletionQueue.getFailed();
console.log("failed job...", failed);

const completed = await videoDeletionQueue.getCompleted();
console.log("completed job...", completed);

export { videoDeletionQueue };
