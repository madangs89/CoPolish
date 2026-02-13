import { Worker } from "bullmq";
import { bullClient, connectRedis, pubClient } from "../../config/redis.js";
import { connectDB } from "../../config/connectDB.js";
import Job from "../../models/jobs.model.js";
import CreditLedger from "../../models/creditLedger.model.js";
import {
  aiPartWiseOptimize,
  buildInstruction,
  getResumeFromDb,
  resumeScoreWithAi,
} from "../../LLmFunctions/lllm.js";
import { aiOptimizationQueue } from "../jobs/bullJobs.js";
import ResumeTemplate from "../../models/resume.model.js";
import User from "../../models/user.model.js";
import LinkedinJob from "../../models/linkedinJobs.model.js";

const SUPPORTED_OPERATIONS = new Set([
  "all",
  "headline",
  "about",
  "experience",
  "projects",
  "posts",
  "score",
]);
function extractSectionValue(op, sectionData) {
  const data = sectionData.data;

  // If AI returned full object, extract only needed key
  if (typeof data === "object" && data !== null && op in data) {
    return data[op];
  }

  // Already clean
  return data;
}

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

const ALL_OPERATION_ORDER = [
  "headline",
  "about",
  "experience",
  "projects",
  "posts",
  "score",
];
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

function computeResumeScore(scores) {
  const raw =
    0.3 * scores.atsScore +
    0.2 * scores.contentClarityScore +
    0.15 * scores.structureScore +
    0.15 * scores.impactScore +
    0.1 * scores.projectScore +
    0.1 * scores.experienceScore;

  return {
    raw,
    rounded: Math.round(raw),
  };
}

await connectDB();
await connectRedis();

const resumeOptimizeWorker = new Worker(
  "optimize-ai-linkedin",
  async (jobb) => {
    const { event } = jobb.data;

    const { jobId } = jobb.data;

    console.log(`Processing AI optimization for job ${jobId}`);

    let job = await LinkedinJob.findById(jobId);
    console.log("Fetched job:", jobId, job ? "found" : "not found");

    console.log("Job details:", job);
    if (!job) return;

    let resumeId = job.resumeId;
    let operation = job.operation;
    let userId = job.userId;
    let prompt = job.prompt;
    let redisKey = job.redisKey;
    let linkedInId = job.linkedInId;

    const stuck = job.sections.find((s) => s.status === "running");
    if (stuck) {
      stuck.status = "pending";
      await job.save();
    }

    if (["completed", "partial", "failed"].includes(job.status)) {
      await pubClient.del(redisKey);
      return;
    }

    const section = job.sections.find((sec) => sec.status == "pending");
    console.log("Optimizing section:", section ? section.name : "none left");
    if (!section) return;
    section.status = "running";
    job.status = "running";
    await job.save();
    console.log("Job status updated to running");
    try {
      await pubClient.hset(`job:${job._id}`, {
        status: job.status,
        sections: JSON.stringify(job.sections),
        resumeId: resumeId,
        isScoreFound: false,
        score: null,
        fullResumeVersion: null,
      });
      await pubClient.publish(
        "job_updates_linkedIn",
        JSON.stringify({
          jobId,
          userId,
          section: section.name,
          status: job.status,
          sections: job.sections,
          sectionStatus: section.status,
          fullResumeVersion: null,
          score: null,
          isScoreFound: false,
        }),
      );
    } catch (error) {
      console.log("Error publishing job update:", error);
    }
    // console.log("Building prompt for section:", section.name);
    // const masterPrompt = buildInstruction(section.name, prompt);
    // console.log("masterPrompt built", masterPrompt);

    // const keyR = `resume:${resumeId}:${userId}`;

    // let resumeData = await getResumeFromDb(resumeId, section.name, keyR);
    // console.log("Fetched resume data for optimization");
    // if (resumeData.isError) {
    //   // here need to handle one case

    //   console.log("Error fetching resume data:", resumeData.error);
    //   return;
    // }
    // console.log("calling all");

    // const aiRes = await aiPartWiseOptimize(
    //   resumeId,
    //   section.name,
    //   masterPrompt,
    //   JSON.stringify(resumeData.data),
    // );
    // if (aiRes.isError) {
    //   section.status = "failed";
    //   section.error = aiRes.error;
    // } else {
    //   section.optimizedData = aiRes.data[section.name];
    //   section.changedData = aiRes.data["changes"];
    //   section.status = "success";
    // }
    // await job.save();
    // await pubClient.hset(`job:${job._id}`, {
    //   status: job.status,
    //   sections: JSON.stringify(job.sections),
    //   resumeId: resumeId,
    //   isScoreFound: false,
    //   score: null,
    //   fullResumeVersion: null,
    // });
    // await pubClient.publish(
    //   "job_updates_linkedIn",
    //   JSON.stringify({
    //     jobId,
    //     userId,
    //     section: section.name,
    //     status: job.status,
    //     sections: job.sections,
    //     sectionStatus: section.status,
    //     isScoreFound: false,
    //     score: null,
    //     fullResumeVersion: null,
    //   }),
    // );

    // const haPending = job.sections.some((sec) => sec.status == "pending");
    // if (haPending) {
    //   await aiOptimizationQueue.add(
    //     "optimize-ai",
    //     {
    //       jobId: job._id.toString(),
    //     },
    //     {
    //       removeOnComplete: true,
    //       attempts: 1,
    //     },
    //   );
    //   return;
    // }

    // await pubClient.expire(`job:${job._id}`, 1800); //  30 minutes
    // const failed = job.sections.filter((s) => s.status == "failed");
    // const refund = failed.reduce((s, x) => s + x.creditCost, 0);

    // if (job.finishedAt) {
    //   await pubClient.del(redisKey);
    //   return;
    // }

    // if (refund > 0 && job.creditsRefunded == 0) {
    //   console.log("Processing refund of credits:", refund);
    //   await User.findByIdAndUpdate(
    //     job.userId,
    //     { $inc: { totalCredits: refund } },
    //     { new: true },
    //   );

    //   await CreditLedger.create({
    //     userId: job.userId,
    //     jobId: job._id,
    //     type: "REFUND",
    //     amount: refund,
    //     reason: "AI failed sections",
    //   });
    //   job.creditsRefunded = refund;
    // }

    // resumeData = await getResumeFromDb(resumeId, "all", keyR);

    // let finalResume = { ...resumeData.data };
    // let changes = {};
    // job.sections.forEach((s) => {
    //   if (s.status === "success" && s.optimizedData) {
    //     finalResume[s.name] = s?.optimizedData;
    //     changes[s.name] = s?.changedData ? s.changedData : null;
    //   } else {
    //     changes[s.name] = null;
    //     finalResume[s.name] = resumeData.data[s.name];
    //   }
    // });

    // job.status =
    //   failed.length === job.sections.length
    //     ? "failed"
    //     : failed.length > 0
    //       ? "partial"
    //       : "completed";

    // if (failed.length == job.sections.length) {
    //   // need to handle all failed cases
    //   console.log("All sections failed", failed);
    //   job.result = {
    //     resumeVersionId: null,
    //     totalScore: 0,
    //     scoreFailed: true,
    //   };
    //   job.finishedAt = new Date();

    //   await job.save();
    //   await pubClient.del(redisKey);
    //   await pubClient.hset(`job:${job._id}`, {
    //     status: job?.status,
    //     sections: JSON.stringify(job?.sections),
    //     resumeId: resumeId,
    //     isScoreFound: false,
    //     score: null,
    //     fullResumeVersion: JSON.stringify(resumeData.data),
    //     userId,
    //   });
    //   await pubClient.expire(`job:${job._id}`, 900); //  15 minutes
    //   await pubClient.publish(
    //     "job_updates_linkedIn",
    //     JSON.stringify({
    //       jobId,
    //       userId,
    //       section: section?.name || "",
    //       status: job?.status,
    //       sections: job?.sections || [],
    //       sectionStatus: section?.status || "",
    //       isScoreFound: true,
    //       score: null,
    //       fullResumeVersion: JSON.stringify(resumeData.data),
    //       creditsRefunded: job.creditsRefunded,
    //     }),
    //   );
    // } else {
    //   let oldResumeData = resumeData.data;
    //   let dbChanges = changes;
    //   console.log("Scoring resume with AI");
    //   let score = await resumeScoreWithAi({ oldResumeData, dbChanges });
    //   console.log("Score received from AI", score);
    //   if (score.isError) {
    //     console.log("Error in scoring resume:", score.error);
    //     job.result = {
    //       totalScore: 0,
    //       scoreFailed: true,
    //     };

    //     score = {
    //       scoreBefore: resumeData.data.scoreBefore || 0,
    //       scoreAfter: resumeData.data.scoreAfter || 0,
    //       atsScore: resumeData.data.atsScore || 0,
    //       contentClarityScore: resumeData.data.contentClarityScore || 0,
    //       structureScore: resumeData.data.structureScore || 0,
    //       impactScore: resumeData.data.impactScore || 0,
    //       projectScore: resumeData.data.projectScore || 0,
    //       experienceScore: resumeData.data.experienceScore || 0,
    //       suggestions: resumeData.data.suggestions || [],
    //     };
    //   } else {
    //     const computedScore = computeResumeScore(score.data);

    //     job.result = {
    //       totalScore: computedScore.rounded,
    //       scoreFailed: false,
    //     };
    //     score = {
    //       scoreBefore: resumeData.data.scoreBefore || 0,
    //       scoreAfter: computedScore.rounded,
    //       ...score.data,
    //       suggestions:
    //         score?.data?.optimizationSuggestions ||
    //         resumeData?.data?.suggestions ||
    //         [],
    //     };
    //   }
    //   const {
    //     scoreBefore,
    //     scoreAfter,
    //     atsScore,
    //     contentClarityScore,
    //     structureScore,
    //     impactScore,
    //     projectScore,
    //     experienceScore,
    //     suggestions,
    //   } = score;

    //   console.log("Finalizing resume update in DB", score);
    //   let resumeVersionId = null;
    //   let fullResumeVersion = null;
    //   if (
    //     operation === "all" &&
    //     refund === 0 &&
    //     (job.status === "completed" || job.status === "partial")
    //   ) {
    //     let now = new Date();
    //     console.log("inside all operation");
    //     const newResume = await ResumeTemplate.create({
    //       userId: job.userId,
    //       jobKey: job._id,
    //       resumeGroupId: resumeData.data.resumeGroupId,
    //       version: resumeData.data.version + 1,
    //       personal: finalResume.personal,
    //       education: finalResume.education,
    //       experience: finalResume.experience,
    //       projects: finalResume.projects,
    //       skills: finalResume.skills,
    //       certifications: finalResume.certifications,
    //       achievements: finalResume.achievements,
    //       extracurricular: finalResume.extracurricular,
    //       hobbies: finalResume.hobbies,
    //       title: finalResume.title + " (Optimized) " + now.toISOString(),
    //       scoreBefore,
    //       scoreAfter,
    //       atsScore,
    //       contentClarityScore,
    //       structureScore,
    //       impactScore,
    //       projectScore,
    //       experienceScore,
    //       suggestions,
    //       checkedFields: finalResume.checkedFields || checkedFields,
    //       config: finalResume.config || config,
    //       skillMap: finalResume.skillMap,
    //       changes,
    //     });
    //     resumeVersionId = newResume._id;
    //     fullResumeVersion = newResume;

    //     await User.findByIdAndUpdate(
    //       job.userId,
    //       { currentResumeId: newResume._id },
    //       { new: true },
    //     );

    //     let newKey = `resume:${newResume._id}:${userId}`;

    //     await pubClient.hset(newKey, {
    //       data: JSON.stringify(newResume),
    //       isDirty: 0,
    //       firstEditAt: Date.now(),
    //       lastEditAt: Date.now(),
    //     });
    //   } else {
    //     // for single operations
    //     console.log("Updating for single operation");
    //     const key = `resume:${resumeId}:${userId}`;

    //     const exists = await pubClient.exists(key);

    //     console.log("exists", exists);
    //     let payload = {
    //       userId: job.userId,
    //       jobKey: job._id,
    //       resumeGroupId: resumeData.data.resumeGroupId,
    //       version: resumeData.data.version,
    //       personal: finalResume.personal,
    //       education: finalResume.education,
    //       experience: finalResume.experience,
    //       projects: finalResume.projects,
    //       skills: finalResume.skills,
    //       certifications: finalResume.certifications,
    //       achievements: finalResume.achievements,
    //       extracurricular: finalResume.extracurricular,
    //       hobbies: finalResume.hobbies,
    //       scoreBefore,
    //       scoreAfter,
    //       atsScore,
    //       contentClarityScore,
    //       structureScore,
    //       impactScore,
    //       projectScore,
    //       experienceScore,
    //       suggestions,
    //       checkedFields: finalResume.checkedFields || checkedFields,
    //       config: finalResume.config || config,
    //       skillMap: finalResume.skillMap,
    //       changes,
    //     };
    //     if (exists) {
    //       const cachedResumeData = await pubClient.hgetall(key);
    //       const firstEditAt = cachedResumeData?.firstEditAt || Date.now();
    //       const lastEditAt = Date.now();
    //       const now = Date.now();
    //       const previousData = JSON.parse(cachedResumeData.data);

    //       const pipe = pubClient.pipeline();

    //       let cachingPayload = {
    //         ...previousData,
    //         ...payload,
    //         updatedAt: new Date(),
    //       };
    //       pipe.hset(key, {
    //         data: JSON.stringify(cachingPayload),
    //         isDirty: 1,
    //         firstEditAt: firstEditAt,
    //         lastEditAt: lastEditAt,
    //       });
    //       pipe.expire(key, 60 * 30); // 30 minutes
    //       const idleTime = Math.min(5 * 60 * 1000, (60 * 30 * 1000) / 2);
    //       const flushAt = Math.min(
    //         now + idleTime,
    //         now + 25 * 60 * 1000,
    //         firstEditAt + 10 * 60 * 1000,
    //       );

    //       pipe.zadd("resume:flush_index", flushAt, key);
    //       // await pubClient.expire(key, 60 * 30);
    //       await pipe.exec();
    //       payload._id = resumeId;
    //       resumeVersionId = job.resumeId;
    //       fullResumeVersion = payload;
    //       console.log("Updated cache for resume:", resumeId);
    //     } else {
    //       console.log(
    //         "cache not found, updating DB directly for resume:",
    //         resumeId,
    //       );
    //       const updateResume = await ResumeTemplate.findOneAndUpdate(
    //         { _id: resumeId, userId },
    //         { $set: payload },
    //         { new: true },
    //       );
    //       const newKey = `resume:${updateResume._id}:${userId}`;

    //       await pubClient.hset(newKey, {
    //         data: JSON.stringify(updateResume),
    //         isDirty: 0,
    //         firstEditAt: Date.now(),
    //         lastEditAt: Date.now(),
    //       });
    //       resumeVersionId = updateResume._id;
    //       fullResumeVersion = updateResume;

    //       console.log("Updated DB for resume:", resumeId);
    //     }
    //   }
    //   console.log("out of else");
    //   job.result.resumeVersionId = resumeVersionId;
    //   job.finishedAt = new Date();
    //   await job.save();
    //   console.log("Job marked as finished at", job.finishedAt);

    //   if (job.finishedAt) {
    //     await pubClient.del(redisKey);
    //   }

    //   await pubClient.hset(`job:${job._id}`, {
    //     status: job?.status,
    //     sections: JSON.stringify(job?.sections),
    //     resumeId: resumeId,
    //     isScoreFound: true,
    //     score: JSON.stringify(score),
    //     fullResumeVersion: JSON.stringify(fullResumeVersion),
    //   });
    //   await pubClient.expire(`job:${job._id}`, 900); //  15 minutes
    //   await pubClient.publish(
    //     "job_updates_linkedIn",
    //     JSON.stringify({
    //       jobId,
    //       userId,
    //       section: section?.name || "",
    //       status: job?.status,
    //       sections: job?.sections || [],
    //       sectionStatus: section?.status || "",
    //       isScoreFound: true,
    //       score: JSON.stringify(score),
    //       fullResumeVersion: JSON.stringify(fullResumeVersion),
    //     }),
    //   );

    //   console.log("Published final job update");
    // }

    return { success: true };
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
