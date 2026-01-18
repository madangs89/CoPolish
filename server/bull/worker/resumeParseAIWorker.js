import { Worker } from "bullmq";
import { bullClient, pubClient } from "../../config/redis.js";
import { aiResumeParser } from "../../LLmFunctions/lllm.js";
import { v4 as uuidv4 } from "uuid";
import ResumeTemplate from "../../models/resume.model.js";
import User from "../../models/user.model.js";
import { connectDB } from "../../config/connectDB.js";
await connectDB();

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
    padding: 12,
    background: "#ffffff",
  },

  typography: {
    fontFamily: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    fontSize: {
      name: 25,
      section: 15,
      body: 10,
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
    sectionGap: 10,
    itemGap: 10,
  },

  decorations: {
    showDividers: true,
    dividerStyle: "line",
  },

  listStyle: "numbers",
};
let checkedFields = [
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
const resumeParseAIWorker = new Worker(
  "resume-parse-ai",
  async (job) => {
    const { parsedText, userId, jobKey } = job.data;
    const res = await aiResumeParser(parsedText);

    const { text, usage, error, isError } = res;

    if (isError) {
      await pubClient.publish(
        "resume:events",
        JSON.stringify({
          event: "RESUME_PARSE_AI_COMPLETED",
          jobId: job.id,
          userId,
          parsedNewResume: "",
          userUpdateCurrentResumeId: "",
          usage: 0,
          isError: true,
          error: error,
        })
      );
      throw error;
    }

    const payload = {
      userId,
      resumeGroupId: uuidv4(),
      version: 1,
      templateId: "default-template",
      scoreBefore: text?.resumeScore || 0,
      suggestions: text?.optimizationSuggestions || [],

      // AI output FIRST
      ...text,

      // Manual control LAST (always wins)
      config,
      checkedFields,
    };

    let parsedNewResume;
    let userUpdateCurrentResumeId;
    try {
      payload.jobKey = jobKey;

      parsedNewResume = await ResumeTemplate.findOne({ jobKey });

      if (!parsedNewResume) {
        try {
          console.log("payload to create:", payload);
          parsedNewResume = await ResumeTemplate.create({
            ...payload,
          });
        } catch (err) {
          // Handle race condition
          parsedNewResume = await ResumeTemplate.findOne({ jobKey });
        }
      }

      userUpdateCurrentResumeId = await User.findByIdAndUpdate(userId, {
        currentResumeId: parsedNewResume._id,
      });
    } catch (error) {
      console.error("Error saving parsed resume to DB:", error);
    }
    return {
      jobKey,
      userId,
      parsedNewResume,
      userUpdateCurrentResumeId,
      usage,
    };
  },
  {
    connection: bullClient,
    concurrency: 2, // run 2 jobs in parallel
  }
);

resumeParseAIWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} has completed!`);

  const data = job.returnValue || job.returnvalue;

  if (!data) {
    console.warn("Completed job has no return value", job.id);
    return;
  }

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_AI_COMPLETED",
      jobId: job.id,
      userId: data.userId,
      parsedNewResume: data.parsedNewResume,
      userUpdateCurrentResumeId: data.userUpdateCurrentResumeId,
      usage: data.usage,
      isError: false,
      error: null,
    })
  );
});

resumeParseAIWorker.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed`, err.message);

  const { userId, jobKey } = job.data || {};

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_AI_COMPLETED",
      jobId: job.id,
      userId: userId ?? null,
      parsedNewResume: null,
      userUpdateCurrentResumeId: null,
      usage: 0,
      isError: true,
      error: err?.message ?? "Unknown error",
    })
  );
});
