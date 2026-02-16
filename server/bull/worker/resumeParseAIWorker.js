import { Worker } from "bullmq";
import { bullClient, pubClient } from "../../config/redis.js";
import { aiResumeParser } from "../../LLmFunctions/lllm.js";
import { v4 as uuidv4 } from "uuid";
import ResumeTemplate from "../../models/resume.model.js";
import User from "../../models/user.model.js";
import { connectDB } from "../../config/connectDB.js";
import { aiLinkedInParser } from "../../LLmFunctions/linkedInLLHelper/linkedInLlm.js";
import mongoose from "mongoose";
import LinkedInProfile from "../../models/linkedin.model.js";
await connectDB();

let config = {
  content: {
    order: [
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

const scoreReturn = (score) => {
  score = Number(score);
  if (score >= 60 && score < 70) {
    return Number(score) - 10;
  } else if (score >= 70 && score < 80) {
    return Number(score) - 15;
  } else if (score >= 80 && score < 90) {
    return Number(score) - 20;
  } else if (score >= 90) {
    return Number(score) - 25;
  } else {
    return score;
  }
};

function computeResumeScore(scores) {
  return Math.round(
    0.3 * scoreReturn(scores.atsScore) +
      0.2 * scoreReturn(scores.contentClarityScore) +
      0.15 * scoreReturn(scores.structureScore) +
      0.15 * scoreReturn(scores.impactScore) +
      0.1 * scoreReturn(scores.projectScore) +
      0.1 * scoreReturn(scores.experienceScore),
  );
}

const TONES = ["FORMAL", "CONFIDENT", "BOLD"];

export const normalizeAllFields = (data, field) => {
  if (!data || !data.tone) return null;

  const currentTone = data.tone;
  const options = [];

  // ===== HEADLINE NORMALIZATION =====
  if (field === "headline") {
    TONES.forEach((tone) => {
      if (tone === currentTone) {
        options.push({
          _id: new mongoose.Types.ObjectId(),
          text: data.text || "",
          type: data.type || "SAFE",
          keywords: data.keywords || [],
          tone,
          score: data.score || 0,
          createdAt: new Date(),
        });
      } else {
        options.push({
          _id: new mongoose.Types.ObjectId(),
          text: "",
          type: "SAFE",
          keywords: [],
          tone,
          score: 0,
          createdAt: new Date(),
        });
      }
    });

    return {
      currentTone,
      options,
    };
  }

  // ===== ABOUT NORMALIZATION =====
  if (field === "about") {
    TONES.forEach((tone) => {
      if (tone === currentTone) {
        options.push({
          _id: new mongoose.Types.ObjectId(),
          text: data.text || "",
          structure: data.structure || "PARAGRAPH",
          tone,
          hookScore: data.hookScore || 0,
          createdAt: new Date(),
        });
      } else {
        options.push({
          _id: new mongoose.Types.ObjectId(),
          text: "",
          structure: "PARAGRAPH",
          tone,
          hookScore: 0,
          createdAt: new Date(),
        });
      }
    });

    return {
      currentTone,
      options,
    };
  }

  if (field === "experience") {
    return {
      role: data.role || "",
      company: data.company || "",
      from: data.from || "",
      to: data.to || "",
      bullets: {
        currentTone,
        suggestions: TONES.map((tone) => {
          if (tone === currentTone) {
            return {
              _id: new mongoose.Types.ObjectId(),
              bullets: data.bullets || [],
              improvementType: data.improvementType || "CLARITY",
              createdAt: new Date(),
              tone: currentTone,
            };
          } else {
            return {
              _id: new mongoose.Types.ObjectId(),
              bullets: [],
              improvementType: "CLARITY",
              createdAt: new Date(),
              tone,
            };
          }
        }),
      },
    };
  }

  return null;
};

const resumeParseAIWorker = new Worker(
  "resume-parse-ai",
  async (job) => {
    const { parsedText, userId, jobKey, operation } = job.data;
    if (operation == "resume") {
      const res = await aiResumeParser(parsedText);

      console.log(res);

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
          }),
        );
        throw error;
      }

      const payload = {
        userId,
        resumeGroupId: uuidv4(),
        version: 1,
        templateId: "HarvardResume",
        scoreBefore: scoreReturn(computeResumeScore(text)),
        atsScore: scoreReturn(text?.atsScore),
        contentClarityScore: scoreReturn(text?.contentClarityScore),
        structureScore: scoreReturn(text?.structureScore),
        impactScore: scoreReturn(text?.impactScore),
        projectScore: scoreReturn(text?.projectScore),
        experienceScore: scoreReturn(text?.experienceScore),
        suggestions: text?.optimizationSuggestions || [],
        skillMap: text?.skillMap || {
          "Programming Languages": [],
          "Frameworks & Libraries": [],
          "Databases & Data Technologies": [],
          "Tools, Platforms & DevOps": [],
          "Core Concepts & Technical Skills": [],
        },
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
        operation,
      };
    } else if (operation == "linkedin") {
      console.log("LinkedIn parsing not implemented yet");

      const res = await aiLinkedInParser(parsedText, userId);

      console.log(res);

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
          }),
        );
        throw error;
      }

      const payload = {
        userId,
        targetRole: text?.targetRole || [],
        experienceLevel: text?.experienceLevel || "FRESHER",
        personalInfo: text?.personalInfo || {
          fullName: "",
          location: "",
          email: "",
          phone: "",
          linkedinUrl: "",
          portfolioUrl: "",
          githubUrl: "",
          bannerUrl: "",
          profilePicUrl: "",
        },
        extractedFrom: "linkedin",
        skills: text?.skills || [],
        score: {
          currentScore: text?.score?.currentScore || 0,
          searchability: text?.score?.searchability || 0,
          clarity: text?.score?.clarity || 0,
          impact: text?.score?.impact || 0,
        },
        headline: normalizeAllFields(text?.headline, "headline"),
        about: normalizeAllFields(text?.about, "about"),
        experience:
          text?.experience && text.experience.length > 0
            ? text.experience.map((exp) =>
                normalizeAllFields(exp, "experience"),
              )
            : [],
      };

      let newLinkedIn = await LinkedInProfile.create(payload);

      let userDetails = await User.findById(userId);

      if (userDetails) {
        userDetails.currentLinkedInId = newLinkedIn._id;
        await userDetails.save();
      }

      console.log({ newLinkedIn });

      console.log({ userDetails });

      return {
        jobKey,
        userId,
        parsedNewResume: newLinkedIn,
        userUpdateCurrentResumeId: userDetails?.currentLinkedInId,
        usage: "",
        operation,
      };
    }
  },
  {
    connection: bullClient,
    concurrency: 2, // run 2 jobs in parallel
  },
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
      operation: data.operation,
    }),
  );
});

resumeParseAIWorker.on("failed", async (job, err) => {
  console.error(`Job ${job.id} failed`);

  const { userId, jobKey } = job.data || {};

  const attemptsMade = job.attemptsMade;
  const maxAttempts = job.opts.attempts ?? 1;
  if (attemptsMade >= maxAttempts) {
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
        operation: job.data?.operation ?? "unknown",
      }),
    );
  }
});
