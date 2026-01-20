
import { Worker } from "bullmq";
import { bullClient, pubClient } from "../../config/redis";
import ResumeTemplate from "../../models/resume.model";
import { connectDB } from "../../config/connectDB";

await connectDB();


const resumeOptimizeWorker = new Worker(
  "optimize-ai",
  async (job) => {
    const { resumeId, operation, userId, jobKey } = job.data;

    // 🔒 EXECUTION LOCK (prevents parallel execution)
    const execLockKey = `exec-lock:${jobKey}`;
    const acquired = await pubClient.set(execLockKey, "1", {
      NX: true,
      PX: 10 * 60 * 1000, // 10 min
    });

    if (!acquired) {
      // Another worker already processed this
      return { skipped: true };
    }

    try {
      // 🔍 CHECK DB FIRST (final idempotency)
      const existing = await ResumeTemplate.findOne({ jobKey });
      if (existing) {
        return { reused: true, resumeId: existing._id };
      }

      // ---- AI CALL HERE ----
      const optimizedData = await runAIOptimization(resumeId, operation);

      const payload = {
        userId,
        jobKey,
        resumeGroupId: resumeId,
        version: 1,
        ...optimizedData,
      };

      // 🔐 UPSERT = ONLY ONE INSERT EVER
      const resume = await ResumeTemplate.findOneAndUpdate(
        { jobKey },
        { $setOnInsert: payload },
        { upsert: true, new: true },
      );

      return {
        success: true,
        resumeId: resume._id,
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
