import { aiOptimizationQueue } from "../bull/jobs/bullJobs.js";
import { ai } from "../config/google.js";
import { pubClient } from "../config/redis.js";
import { jobMatchSystemInstruction } from "../LLmFunctions/llmHelpers/allSystemInstructoin.js";
import CreditLedger from "../models/creditLedger.model.js";
import Job from "../models/jobs.model.js";
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

const CREDIT_COST = {
  all: 10,
  personal: 1,
  experience: 1,
  projects: 1,
  skills: 1,
  education: 1,
  certifications: 1,
  achievements: 1,
  extracurricular: 1,
  hobbies: 1,
};
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

    // 1️⃣ Fetch resume from DB
    const resume = await ResumeTemplate.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // 2️⃣ Proper authorization
    if (resume.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    console.log("Updating resume with data:", resumeData);

    // 3️⃣ Update safely
    const updatedResume = await ResumeTemplate.findByIdAndUpdate(
      resumeId,
      {
        $set: {
          personal: resumeData?.personal || resume.personal,
          education: resumeData?.education || resume.education,
          experience: resumeData?.experience || resume.experience,
          projects: resumeData?.projects || resume.projects,
          skills: resumeData?.skills || resume.skills,
          certifications: resumeData?.certifications || resume.certifications,
          achievements: resumeData?.achievements || resume.achievements,
          extracurricular:
            resumeData?.extracurricular || resume.extracurricular,
          hobbies: resumeData?.hobbies || resume.hobbies,
          title: resumeData?.title || resume.title,
        }, // DO NOT inject undefined vars
      },
      {
        new: true,
        runValidators: true, // 🔥 IMPORTANT
      },
    );

    // 4️⃣ Approve user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { isApproved: true },
      { new: true },
    );

    let newVal = await ResumeTemplate.findById(resumeId);

    const key = `resume:${resumeId}:${user._id}`;
    await pubClient.hset(key, {
      data: JSON.stringify(newVal.toObject()),
      isDirty: 0, // not edited yet
      firstEditAt: "", // editing not started
      lastEditAt: "", // editing not started
    });

    await pubClient.expire(key, 60 * 30);

    const idleTime = Math.min(5 * 60 * 1000, (60 * 30 * 1000) / 2);

    const flushAt = Math.min(
      now + idleTime,
      now + 25 * 60 * 1000,
      firstEditAt + 10 * 60 * 1000,
    );

    await pubClient.zadd("resume:flush_index", flushAt, key);

    return res.status(200).json({
      success: true,
      message: "Resume updated and approved",
      resume: updatedResume,
      user: updatedUser,
      newVal,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
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

    console.log("got request to optimize");

    console.log(operation);
    if (!resumeId || !operation) {
      return res.status(400).json({
        success: false,
        message: "resumeId and operation are required",
      });
    }

    const jobId = `optimize_${resumeId}_resume_${userId}`;

    // 🟡 Redis = UX guard only
    const redisKey = `optimize-lock:${jobId}`;
    const lock = await pubClient.set(redisKey, "1", "EX", 1800, "NX"); // 30 min lock

    console.log("Optimization lock acquired:", lock);
    if (!lock) {
      return res.status(429).json({
        success: false,
        message: "Optimization already in progress",
      });
    }
    const userCredit = await User.findById(userId).select("totalCredits");
    if (
      userCredit.totalCredits <= 0 ||
      userCredit.totalCredits < CREDIT_COST[operation]
    ) {
      await pubClient.del(redisKey);
      return res.status(402).json({
        success: false,
        message: "Insufficient credits to update resume",
      });
    }

    const sections =
      operation === "all"
        ? [
            { name: "skills", creditCost: 1 },
            { name: "projects", creditCost: 1 },
            { name: "experience", creditCost: 1 },
            { name: "education", creditCost: 1 },
            { name: "certifications", creditCost: 1 },
            { name: "achievements", creditCost: 1 },
            { name: "extracurricular", creditCost: 1 },
            { name: "hobbies", creditCost: 1 },
            { name: "personal", creditCost: 1 },
          ]
        : [{ name: operation, creditCost: 1 }];

    const totalCredits = sections.reduce((s, x) => s + x.creditCost, 0);

    const job = await Job.create({
      userId,
      resumeId,
      sections,
      prompt,
      operation,
      redisKey,
      creditsDebited: totalCredits,
    });

    if (!job) {
      await pubClient.del(redisKey);
      return res.status(500).json({
        success: false,
        message: "Failed to create optimization job",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalCredits: -totalCredits } },
      { new: true },
    );

    await CreditLedger.create({
      userId,
      jobId: job._id,
      type: "DEBIT",
      amount: totalCredits,
      reason: "Resume optimization started",
    });

    await pubClient.hset(`job:${job._id}`, {
      status: "pending",
      jobId: job._id.toString(),
      section: "",
      sections: [],
      sectionStatus: "",
      isScoreFound: false,
      score: null,
      fullResumeVersion: null,
    });

    console.log("Created job:", job._id.toString());

    await aiOptimizationQueue.add(
      "optimize-ai",
      {
        jobId: job._id.toString(),
      },
      {
        removeOnComplete: true,
        attempts: 1,
      },
    );
    console.log("Optimization job queued:", job._id.toString());
    const counts = await aiOptimizationQueue.getJobCounts();
    const totalLength = counts.waiting + counts.active;
    console.log("Queue Length:", totalLength);

    return res.status(202).json({
      success: true,
      jobId: job._id.toString(),
      queueLength: totalLength,
      message: "Optimization queued",
      statusPayload: job,
    });
  } catch (err) {
    console.error(err);
    const { resumeId, userId } = req.body;
    const jobId = `optimize_${resumeId}_resume_${userId}`;
    const redisKey = `optimize-lock:${jobId}`;
    await pubClient.del(redisKey);
    return res.status(500).json({
      success: false,
      message: "Failed to queue optimization",
    });
  }
};

export const getAllUserResumes = async (req, res) => {
  try {
    const userId = req.user._id;

    console.log("fetching all resumes for user:", userId);
    const resumes = await ResumeTemplate.find({ userId })
      .sort({
        createdAt: -1,
      })
      .select("_id title createdAt updatedAt");
    return res.status(200).json({
      success: true,
      message: "Resumes fetched successfully",
      resumes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

export const jobMatcher = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    console.log("Received job match request");
    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume data and job description are required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: JSON.stringify({ resume: resumeData, jobDescription }),
      config: {
        systemInstruction: jobMatchSystemInstruction,
      },
    });
    const cleaned = response.text
      .replace(/^\s*```json\s*/i, "")
      .replace(/\s*```\s*$/i, "");

    const result = JSON.parse(cleaned);

    console.log(result);

    return res.status(200).json({
      success: true,
      message: "Job match completed",
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to match job",
    });
  }
};
