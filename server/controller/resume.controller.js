import { aiOptimizationQueue } from "../bull/jobs/bullJobs.js";
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
    const userId = req.user._id;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    const key = `resume:${resumeId}:${userId}`;

    const exists = await pubClient.exists(key);

    if (exists) {
      const resumeData = await pubClient.hget(key, "data");

      return res.status(200).json({
        success: true,
        message: "Resume fetched from cache",
        resume: JSON.parse(resumeData),
      });
    }

    const resume = await ResumeTemplate.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await pubClient.hset(key, {
      data: JSON.stringify(resume.toObject()),
      isDirty: 0, // not edited yet
      firstEditAt: "", // editing not started
      lastEditAt: "", // editing not started
    });

    await pubClient.expire(key, 60 * 30);

    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      resume: resume.toObject(),
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
      { new: true },
    );

    const makeUserApproved = await User.findByIdAndUpdate(
      user._id,
      { isApproved: true },
      { new: true },
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
      { new: true },
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

export const updateResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    const userId = req.user._id;
    const { resumeData } = req.body;

    if (!resumeId || !resumeData) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and data are required",
      });
    }

    const key = `resume:${resumeId}:${userId}`;
    const now = Date.now();

    const exists = await pubClient.exists(key);

    if (!exists) {
      const resumeFromDb = await ResumeTemplate.findOne({
        _id: resumeId,
        userId,
      });

      if (!resumeFromDb) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      // Create fresh cache
      await pubClient.hset(key, {
        data: JSON.stringify(resumeFromDb.toObject()),
        isDirty: 0,
        firstEditAt: "",
        lastEditAt: "",
      });

      await pubClient.expire(key, 60 * 30);
    }

    let firstEditAt = await pubClient.hget(key, "firstEditAt");
    if (!firstEditAt) firstEditAt = now;

    const pipe = pubClient.pipeline();

    resumeData.updatedAt = new Date();
    pipe.hset(key, {
      data: JSON.stringify(resumeData),
      isDirty: 1,
      lastEditAt: now,
      firstEditAt,
    });

    pipe.expire(key, 60 * 30);

    const idleTime = Math.min(5 * 60 * 1000, (60 * 30 * 1000) / 2);

    const flushAt = Math.min(
      now + idleTime,
      now + 25 * 60 * 1000,
      firstEditAt + 10 * 60 * 1000,
    );

    pipe.zadd("resume:flush_index", flushAt, key);

    await pipe.exec();

    return res.status(200).json({
      success: true,
      message: "Resume updated in cache",
      resume: resumeData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

export const updateResumeBeacon = async (req, res) => {
  console.log("got request on beacon");

  try {
    const resumeId = req.params.id;
    const { resumeData, userId } = req.body;

    if (!resumeId || !resumeData || !userId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID, userId and resume data are required",
      });
    }

    const existsInDb = await ResumeTemplate.exists({
      _id: resumeId,
      userId,
    });

    if (!existsInDb) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized resume update",
      });
    }

    const key = `resume:${resumeId}:${userId}`;
    const now = Date.now();

    const cacheExists = await pubClient.exists(key);

    if (!cacheExists) {
      const resumeFromDb = await ResumeTemplate.findOne({
        _id: resumeId,
        userId,
      });

      if (!resumeFromDb) {
        return res.status(404).json({
          success: false,
          message: "Resume not found",
        });
      }

      await pubClient.hset(key, {
        data: JSON.stringify(resumeFromDb.toObject()),
        isDirty: 0,
        firstEditAt: "",
        lastEditAt: "",
      });

      await pubClient.expire(key, 60 * 30);
    }

    let firstEditAt = await pubClient.hget(key, "firstEditAt");
    if (!firstEditAt) firstEditAt = now;

    const idleTime = Math.min(5 * 60 * 1000, (60 * 30 * 1000) / 2);

    const flushAt = Math.min(
      now + idleTime,
      now + 25 * 60 * 1000,
      firstEditAt + 10 * 60 * 1000,
    );

    const pipe = pubClient.pipeline();

    pipe.hset(key, {
      data: JSON.stringify(resumeData),
      isDirty: 1,
      lastEditAt: now,
      firstEditAt,
    });

    pipe.expire(key, 60 * 30);
    pipe.zadd("resume:flush_index", flushAt, key);

    await pipe.exec();

    return res.status(200).json({
      success: true,
      message: "Resume update accepted via beacon",
      resume: resumeData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

export const optimizeResume = async (req, res) => {
  try {
    const { resumeId, operation, prompt = "" } = req.body;
    const userId = req.user._id;

    if (!resumeId || !operation) {
      return res.status(400).json({
        success: false,
        message: "resumeId and operation are required",
      });
    }

    // 🔑 DETERMINISTIC jobId (PRIMARY IDENTITY)
    const jobId = `optimize_${resumeId}_${operation}_resume_${userId}`;

    // 🟡 Redis = UX guard only
    const redisKey = `optimize-lock:${jobId}`;
    const lock = await pubClient.set(redisKey, "1", "EX", 300, "NX");

    // if (!lock) {
    //   return res.status(429).json({
    //     success: false,
    //     message: "Optimization already in progress",
    //   });
    // }

    // 🔥 BullMQ jobId = HARD idempotency
    await aiOptimizationQueue.add(
      "optimize-ai",
      {
        resumeId,
        operation,
        userId,
        jobKey: jobId,
        prompt,
        event: "resume",
      },
      {
        jobId,
        removeOnComplete: true,
        attempts: 1,
      },
    );

    const counts = await aiOptimizationQueue.getJobCounts();

    const totalLength = counts.waiting + counts.active;
    console.log("Queue Length:", totalLength);

    return res.status(202).json({
      success: true,
      jobId,
      queueLength: totalLength,
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

// | Command         | Meaning                           |
// | --------------- | --------------------------------- |
// | `HSET`          | Store/update fields inside a HASH |
// | `HGET`          | Read one field from HASH          |
// | `HGETALL`       | Read all fields from HASH         |
// | `EXPIRE`        | Set auto-delete time              |
// | `ZADD`          | Add item to sorted queue          |
// | `ZRANGEBYSCORE` | Get items ready by time           |
// | `ZREM`          | Remove item from queue            |
// | `PIPELINE`      | Batch Redis commands              |
// | `EXISTS`        | Check key existence               |

// setInterval(async () => {
//   const now = Date.now();

//   /* --------------------------------
//      REDIS: ZRANGEBYSCORE
//      Get resumes READY to save
//      -------------------------------- */
//   const keys = await pubClient.zrangebyscore(
//     "resume:flush_index",
//     0,
//     now,
//     "LIMIT",
//     0,
//     50,
//   );

//   if (!keys.length) return;

//   const bulkOps = [];

//   for (const key of keys) {
//     /* --------------------------------
//        REDIS: HGETALL
//        Fetch full HASH
//        -------------------------------- */
//     const data = await pubClient.hgetall(key);

//     if (!data || data.isDirty !== "1") {
//       await pubClient.zrem("resume:flush_index", key);
//       continue;
//     }

//     const [, resumeId, userId] = key.split(":");

//     bulkOps.push({
//       updateOne: {
//         filter: { _id: resumeId, userId },
//         update: JSON.parse(data.data),
//       },
//     });

//     /* --------------------------------
//        REDIS: HSET
//        Mark clean after DB save
//        -------------------------------- */
//     await pubClient.hset(key, {
//       isDirty: 0,
//       firstEditAt: "",
//       lastEditAt: "",
//     });

//     /* --------------------------------
//        REDIS: ZREM
//        Remove from flush queue
//        -------------------------------- */
//     await pubClient.zrem("resume:flush_index", key);
//   }

//   /* --------------------------------
//      MongoDB: BULK WRITE
//      -------------------------------- */
//   if (bulkOps.length) {
//     await ResumeTemplate.bulkWrite(bulkOps);
//   }
// }, 5000);
