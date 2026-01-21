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
    const execLockKey = `exec-lock:${jobKey}`;
    const redisKey = `optimize-lock:${jobKey}`;
    try {
      // 🔒 EXECUTION LOCK (prevents parallel execution)
      const acquired = await pubClient.set(execLockKey, "1", "EX", 300, "NX");

      if (!acquired) {
        // Another worker already processed this
        return { skxipped: true };
      }

      await pubClient.hset(jobKey, {
        status: "started",
        error: null,
        currentOperation: "",
        optimizedSections: {},
        startedAt: Date.now(),
        updatedAt: null,
        completedAt: null,
        resumeId,
        userId,
        errorTask: {},
      });
      console.log("Starting AI optimization for resume:", resumeId);
      const optimizedData = await resumeOptimizer({
        resumeId,
        operation,
        prompt,
        event,
        userId,
        jobKey,
      });

      console.log(JSON.stringify(optimizedData, null, 2));

      const { error, isError, data, errorTask, optimizedSections } =
        optimizedData;
      console.log();

      if (isError) {
        await pubClient.del(redisKey);
        await pubClient.del(execLockKey);
        throw new Error(`AI Optimization failed: ${error}`);
      }

      await pubClient.del(redisKey);

      await pubClient.del(execLockKey);

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
    } catch (error) {
      // nee to remove another lock also
      await pubClient.del(redisKey);
      await pubClient.del(execLockKey);
      console.error("Error in AI optimization worker:", error);
      throw error;
    }

    return { success: true };
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
