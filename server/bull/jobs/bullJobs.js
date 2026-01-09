import { Queue } from "bullmq";
import { bullClient } from "../../config/redis.js";

export const resumeParserQueue = new Queue("resume-parser", {
  connection: bullClient,
  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 3000, // 3 sec, then 6, 12...
    },
    removeOnComplete: {
      age: 3600, // keep for 1 hour
      count: 1000, // or max 1000 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // keep failed jobs 1 day
    },
    timeout: 2 * 60 * 1000, // 2 minutes
  },
  limiter: {
    max: 10, // max 10 jobs
    duration: 1000, // per second
  },
});


export const resumeParseAIQueue = new Queue("resume-parse-ai", {
  connection: bullClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    timeout: 5 * 60 * 1000,
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600,
    },
  },
  limiter: {
    max: 2,      // 🔥 SAFE for AI
    duration: 1000,
  },
});
