import { pubClient } from "../config/redis.js";
import ResumeTemplate from "../models/resume.model.js";
import User from "../models/user.model.js";

export const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }
    const resume = await ResumeTemplate.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};

export const markApprovedAndUpdate = async (req, res) => {
  try {
    const user = req.user;

    const { resumeId, resumeData } = req.body;

    if (!resumeId || !resumeData) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and data are required",
      });
    }

    if (user._id.toString() !== resumeData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this resume",
      });
    }

    const updatedResume = await ResumeTemplate.findByIdAndUpdate(
      resumeId,
      { ...resumeData },
      { new: true }
    );

    const makeUserApproved = await User.findByIdAndUpdate(
      user._id,
      { isApproved: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Resume updated and marked as approved",
      resume: updatedResume,
      user: makeUserApproved,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

export const markApproveAndCreateNew = async (req, res) => {
  try {
    const user = req.user;

    const { resumeData } = req.body;

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: "Resume data is required",
      });
    }

    if (user._id.toString() !== resumeData.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this resume",
      });
    }

    const createResume = await ResumeTemplate.create(resumeData);

    if (!createResume) {
      return res.status(500).json({
        success: false,
        message: "Failed to create new resume",
      });
    }

    const makeUserApproved = await User.findByIdAndUpdate(
      user._id,
      { isApproved: true, currentResumeId: createResume._id },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Resume updated and marked as approved",
      resume: createResume,
      user: makeUserApproved,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

// import { resumeOptimizeQueue } from "../bull/jobs/bullJobs.js";
// import { pubClient } from "../config/redis.js";

export const optimizeResume = async (req, res) => {
  try {
    const { resumeId, operation } = req.body;
    const userId = req.user._id;

    if (!resumeId || !operation) {
      return res.status(400).json({
        success: false,
        message: "resumeId and operation are required",
      });
    }

    // 🔑 DETERMINISTIC jobId (PRIMARY IDENTITY)
    const jobId = `optimize:${resumeId}:${operation}:v1`;

    // 🟡 Redis = UX guard only
    const redisKey = `optimize-lock:${jobId}`;
    const lock = await pubClient.set(redisKey, "1", {
      NX: true,
      EX: 300, // 5 min
    });

    if (!lock) {
      return res.status(429).json({
        success: false,
        message: "Optimization already in progress",
      });
    }

    // 🔥 BullMQ jobId = HARD idempotency
    // await resumeOptimizeQueue.add(
    //   "resume-optimize",
    //   {
    //     resumeId,
    //     operation,
    //     userId,
    //     jobKey: jobId,
    //   },
    //   {
    //     jobId,              // 👈 THIS is critical
    //     removeOnComplete: true,
    //     attempts: 3,
    //   }
    // );

    return res.status(202).json({
      success: true,
      jobId,
      message: "Optimization queued",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to queue optimization",
    });
  }
};



// import { Worker } from "bullmq";
// import { bullClient, pubClient } from "../../config/redis.js";
// import ResumeTemplate from "../../models/resume.model.js";

// const resumeOptimizeWorker = new Worker(
//   "resume-optimize",
//   async (job) => {
//     const { resumeId, operation, userId, jobKey } = job.data;

//     // 🔒 EXECUTION LOCK (prevents parallel execution)
//     const execLockKey = `exec-lock:${jobKey}`;
//     const acquired = await pubClient.set(execLockKey, "1", {
//       NX: true,
//       PX: 10 * 60 * 1000, // 10 min
//     });

//     if (!acquired) {
//       // Another worker already processed this
//       return { skipped: true };
//     }

//     try {
//       // 🔍 CHECK DB FIRST (final idempotency)
//       const existing = await ResumeTemplate.findOne({ jobKey });
//       if (existing) {
//         return { reused: true, resumeId: existing._id };
//       }

//       // ---- AI CALL HERE ----
//       const optimizedData = await runAIOptimization(resumeId, operation);

//       const payload = {
//         userId,
//         jobKey,
//         resumeGroupId: resumeId,
//         version: 1,
//         ...optimizedData,
//       };

//       // 🔐 UPSERT = ONLY ONE INSERT EVER
//       const resume = await ResumeTemplate.findOneAndUpdate(
//         { jobKey },
//         { $setOnInsert: payload },
//         { upsert: true, new: true }
//       );

//       return {
//         success: true,
//         resumeId: resume._id,
//       };
//     } finally {
//       // Optional: let TTL handle cleanup
//     }
//   },
//   {
//     connection: bullClient,
//     concurrency: 2,
//   }
// );
