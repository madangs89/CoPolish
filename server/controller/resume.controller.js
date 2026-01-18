import { pubClient } from "../config/redis.js";
import ResumeTemplate from "../models/resume.model.js";
import User from "../models/user.model.js";

let config = {
  content: {
    order: [
      "skills",
      "projects",
      "experience",
      "education",
      "certifications",
      "achievements",
      "extracurricular",
      "hobbies",
      "personal",
    ],
  },

  layout: {
    type: "single-column",
    columnRatio: [2, 1],
  },

  page: {
    width: 794,
    minHeight: 1123,
    padding: 16,
    background: "#ffffff",
  },

  typography: {
    fontFamily: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    fontSize: {
      name: 25,
      section: 18,
      body: 16,
      small: 13,
    },
    lineHeight: 1.2,
  },

  colors: {
    primary: "#111827",
    accent: "#2563eb",
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },

  spacing: {
    sectionGap: 7,
    itemGap: 6,
  },

  decorations: {
    showDividers: true,
    dividerStyle: "line",
  },

  listStyle: "numbers",
};
let checkedFields = [
  "summary",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "extracurricular",
  "hobbies",
  "personal",
];
export const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const key = `resume-edit-cache:${resumeId}:${req.user._id}`;

    const cachedResume = await pubClient.get(key);

    if (cachedResume) {
      console.log("got from cache");

      const { resumeData } = JSON.parse(cachedResume);
      return res.status(200).json({
        success: true,
        message: "Resume fetched from cache",
        resume: resumeData,
      });
    }

    const resume = await ResumeTemplate.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    let objectifiedResume = resume.toObject();

    let payload = {
      resumeData: objectifiedResume,
      userId: req.user._id,
      resumeId: resume._id,
      cachedTime: new Date(),
      updatedTime: null,
      isUpdated: false,
    };

    await pubClient.setex(key, 60 * 5, JSON.stringify(payload));

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
      { ...resumeData, config, checkedFields },
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

    const createResume = await ResumeTemplate.create({
      ...resumeData,
      config,
      checkedFields,
    });

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
