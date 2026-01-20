import { Worker } from "bullmq";
import { bullClient, connectRedis, pubClient } from "../../config/redis.js";
import ResumeTemplate from "../../models/resume.model.js";
import { connectDB } from "../../config/connectDB.js";
import { resumeOptimizer } from "../../LLmFunctions/lllm.js";

await connectDB();
await connectRedis();

const resumeOptimizeWorker = new Worker(
  "optimize-ai",
  async (job) => {
    const { resumeId, operation, userId, jobKey, prompt, event } = job.data;

    console.log(resumeId, operation, userId);

    // 🔒 EXECUTION LOCK (prevents parallel execution)
    const execLockKey = `exec-lock:${jobKey}`;
    const acquired = await pubClient.set(execLockKey, "1", "EX", 300, "NX");

    // if (!acquired) {
    //   // Another worker already processed this
    //   return { skipped: true };
    // }

    try {
      // ---- AI CALL HERE ----
      console.log("Starting AI optimization for resume:", resumeId);
      const optimizedData = await resumeOptimizer({
        resumeId,
        operation,
        prompt,
        event,
        userId,
      });

      console.log(JSON.stringify(optimizedData, null, 2));

      // const payload = {
      //   userId,
      //   jobKey,
      //   resumeGroupId: resumeId,
      //   version: 1,
      //   ...optimizedData,
      // };

      // // 🔐 UPSERT = ONLY ONE INSERT EVER
      // const resume = await ResumeTemplate.findOneAndUpdate(
      //   { jobKey },
      //   { $setOnInsert: payload },
      //   { upsert: true, new: true },
      // );

      return {
        success: true,
        jobId: jobKey,
        // resumeId: resume._id,
      };
    } finally {
      // Optional: let TTL handle cleanup
    }
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
