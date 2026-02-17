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
import {
  aiLinkedInOptimize,
  buildPromptsForLinkedIn,
  getLinkedInDataAndResumeData,
  getScoreForOptimizedData,
} from "../../LLmFunctions/linkedInLLHelper/linkedInLlm.js";
import LinkedInProfile from "../../models/linkedin.model.js";

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

const normalizeAndGiveProperValue = (sectionName, tone, data, linkedInData) => {
  if (sectionName === "headline") {
    const newData = linkedInData.headline ? linkedInData.headline : {};
    if (tone === "ALL") {
      let options = newData.options.map((opt, index) => {
        const currentTone = opt.tone.toLowerCase();
        opt.text = data[currentTone] ? data[currentTone].text : opt.text;
        opt.type = data[currentTone] ? data[currentTone].type : opt.type;
        opt.keywords = data[currentTone]
          ? data[currentTone].keywords
          : opt.keywords;
        return opt;
      });
      newData.options = options;
    } else {
      let options = newData.options.map((opt, index) => {
        const currentTone = opt.tone.toLowerCase();
        if (currentTone === tone.toLowerCase()) {
          opt.text = data[currentTone] ? data[currentTone].text : opt.text;
          opt.type = data[currentTone] ? data[currentTone].type : opt.type;
          opt.keywords = data[currentTone]
            ? data[currentTone].keywords
            : opt.keywords;
        }
        return opt;
      });
      newData.options = options;
    }
    return newData;
  } else if (sectionName === "about") {
    const newData = linkedInData.about ? linkedInData.about : {};

    if (tone == "ALL") {
      let options = newData.options.map((opt, index) => {
        const currentTone = opt.tone.toLowerCase();
        opt.text = data[currentTone] ? data[currentTone].text : opt.text;
        opt.hookScore = data[currentTone]
          ? data[currentTone].hookScore
          : opt.hookScore;
        return opt;
      });
      newData.options = options;
    } else {
      let options = newData.options.map((opt, index) => {
        const currentTone = opt.tone.toLowerCase();
        if (currentTone === tone.toLowerCase()) {
          opt.text = data[currentTone] ? data[currentTone].text : opt.text;
          opt.hookScore = data[currentTone]
            ? data[currentTone].hookScore
            : opt.hookScore;
        }
        return opt;
      });
      newData.options = options;
    }
    return newData;
  } else if (sectionName === "experience") {
    const newData = linkedInData.experience ? linkedInData.experience : [];

    if (tone == "ALL") {
      newData.forEach((exp, index) => {
        const currentId = exp._id.toString();
        const aiData = data.find((d) => d?.id === currentId)
          ? data.find((d) => d?.id === currentId)
          : {};
        exp.bullets.suggestions.forEach((sug, sugIndex) => {
          const currentSuggTone = sug.tone.toLowerCase();
          sug.bullets = aiData[currentSuggTone]
            ? aiData[currentSuggTone].bullets
            : sug.bullets;
          sug.improvementType = aiData[currentSuggTone]
            ? aiData[currentSuggTone].improvementType
            : sug.improvementType;
        });
      });

      return newData;
    } else {
      newData.forEach((exp, index) => {
        const currentId = exp._id.toString();
        const aiData = data.find((d) => d?.id === currentId)
          ? data.find((d) => d?.id === currentId)
          : {};
        exp.bullets.suggestions.forEach((sug, sugIndex) => {
          const currentSuggTone = sug.tone.toLowerCase();
          if (currentSuggTone === tone.toLowerCase()) {
            sug.bullets = aiData[currentSuggTone]
              ? aiData[currentSuggTone].bullets
              : sug.bullets;
            sug.improvementType = aiData[currentSuggTone]
              ? aiData[currentSuggTone].improvementType
              : sug.improvementType;
          }
        });
      });
      return newData;
    }
  }
};

const handleOptimizedData = (sectionName, tone, aiRes, currentLinkedInData) => {
  if (sectionName === "headline") {
    return normalizeAndGiveProperValue(
      sectionName,
      tone,
      aiRes.data,
      currentLinkedInData,
    );
  } else if (sectionName === "about") {
    return normalizeAndGiveProperValue(
      sectionName,
      tone,
      aiRes.data,
      currentLinkedInData,
    );
  } else if (sectionName === "experience") {
    return normalizeAndGiveProperValue(
      sectionName,
      tone,
      aiRes.data.data,
      currentLinkedInData,
    );
  }
};

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
        linkedInId,
        jobId: job._id.toString(),
        isScoreFound: false,
        score: null,
        fullLinkedInVersion: null,
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
          fullLinkedInVersion: null,
          score: null,
          isScoreFound: false,
        }),
      );
    } catch (error) {
      console.log("Error publishing job update:", error);
    }
    console.log("Building prompt for section:", section.name);
    const masterPrompt = buildPromptsForLinkedIn(section.name);
    let wholeDataForAi = await getLinkedInDataAndResumeData(
      resumeId,
      linkedInId,
      section.name,
    );

    console.log({ wholeDataForAi });
    // console.log("Fetched resume data for optimization");
    if (wholeDataForAi.isError || !wholeDataForAi.data) {
      // here need to handle one case
      console.log("Error fetching resume data:", wholeDataForAi.error);
      return;
    }

    let currentLinkedInData = await LinkedInProfile.findById(linkedInId);
    let oldLinkedInData = JSON.parse(JSON.stringify(currentLinkedInData));

    const aiRes = await aiLinkedInOptimize(
      resumeId,
      section.name,
      masterPrompt,
      JSON.stringify({ ...wholeDataForAi.data, requestedTone: section.tone }),
    );

    if (aiRes.isError) {
      section.status = "failed";
      section.error = aiRes.error;
    } else {
      section.optimizedData = handleOptimizedData(
        section.name,
        section.tone,
        aiRes,
        currentLinkedInData,
      );
      section.changedData = aiRes?.data?.changes || [];
      section.status = "success";
    }
    await job.save();

    console.log("ai res", JSON.stringify(aiRes.data, null, 2));

    currentLinkedInData.changes ??= {};
    currentLinkedInData.changes.experience ??= [];
    currentLinkedInData.changes.headline ??= [];
    currentLinkedInData.changes.about ??= [];
    if (section.name == "experience") {
      currentLinkedInData.experience = normalizeAndGiveProperValue(
        section.name,
        section.tone,
        aiRes.data.data,
        currentLinkedInData,
      );
      currentLinkedInData.changes.experience.push(
        ...(aiRes.data.changes || []),
      );
      await currentLinkedInData.save();
    } else if (section.name == "headline") {
      currentLinkedInData.headline = normalizeAndGiveProperValue(
        section.name,
        section.tone,
        aiRes.data,
        currentLinkedInData,
      );
      currentLinkedInData.changes.headline.push(...(aiRes.data.changes || []));
      await currentLinkedInData.save();
    } else if (section.name == "about") {
      currentLinkedInData.about = normalizeAndGiveProperValue(
        section.name,
        section.tone,
        aiRes.data,
        currentLinkedInData,
      );
      currentLinkedInData.changes.about.push(...(aiRes.data.changes || []));
      await currentLinkedInData.save();
    }

    await pubClient.hset(`job:${job._id}`, {
      status: job.status,
      sections: JSON.stringify(job.sections),
      resumeId: resumeId,
      linkedInId,
      jobId: job._id.toString(),
      isScoreFound: false,
      score: null,
      fullLinkedInVersion: JSON.stringify(currentLinkedInData),
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
        isScoreFound: false,
        score: null,
        fullLinkedInVersion: JSON.stringify(currentLinkedInData),
      }),
    );

    const haPending = job.sections.some((sec) => sec.status == "pending");
    if (haPending) {
      await aiOptimizationQueue.add(
        "optimize-ai-linkedin",
        {
          jobId: job._id.toString(),
        },
        {
          removeOnComplete: true,
          attempts: 1,
        },
      );
      return;
    }

    await pubClient.expire(`job:${job._id}`, 1800); //  30 minutes
    const failed = job.sections.filter((s) => s.status == "failed");
    const refund = failed.reduce((s, x) => s + x.creditCost, 0);

    if (job.finishedAt) {
      await pubClient.del(redisKey);
      return;
    }

    if (refund > 0 && job.creditsRefunded == 0) {
      console.log("Processing refund of credits:", refund);
      await User.findByIdAndUpdate(
        job.userId,
        { $inc: { totalCredits: refund } },
        { new: true },
      );

      await CreditLedger.create({
        userId: job.userId,
        jobId: job._id,
        type: "REFUND",
        amount: refund,
        reason: "AI failed sections",
      });
      job.creditsRefunded = refund;
    }

    job.status =
      failed.length === job.sections.length
        ? "failed"
        : failed.length > 0
          ? "partial"
          : "completed";

    if (failed.length == job.sections.length) {
      console.log("All sections failed", failed);
      job.result = {
        linkedInVersionId: null,
        totalScore: 0,
        scoreFailed: true,
      };
      job.finishedAt = new Date();

      await job.save();
      await pubClient.del(redisKey);
      await pubClient.hset(`job:${job._id}`, {
        status: job?.status,
        sections: JSON.stringify(job?.sections),
        resumeId: resumeId,
        isScoreFound: false,
        score: null,
        fullLinkedInVersion: JSON.stringify(currentLinkedInData),
        linkedInId,
        jobId: job._id.toString(),
        userId,
      });
      await pubClient.expire(`job:${job._id}`, 900); //  15 minutes
      await pubClient.publish(
        "job_updates_linkedIn",
        JSON.stringify({
          jobId,
          userId,
          section: section?.name || "",
          status: job?.status,
          sections: job?.sections || [],
          sectionStatus: section?.status || "",
          isScoreFound: true,
          score: JSON.stringify(currentLinkedInData.score),
          fullLinkedInVersion: JSON.stringify(currentLinkedInData),
          creditsRefunded: job.creditsRefunded,
        }),
      );
    } else {
      let score = await getScoreForOptimizedData(
        oldLinkedInData,
        currentLinkedInData,
      );
      console.log("Score received from AI", score);
      if (score.isError) {
        console.log("Error in scoring resume:", score.error);
        job.result = {
          totalScore: 0,
          scoreFailed: true,
        };
      } else {
        job.result = {
          totalScore: score.data.score.currentScore,
          scoreFailed: false,
        };
      }
      currentLinkedInData.score.currentScore =
        score?.data?.score?.currentScore ||
        currentLinkedInData.score.currentScore;
      currentLinkedInData.score.searchability =
        score?.data?.score?.searchability ||
        currentLinkedInData.score.searchability;
      currentLinkedInData.score.clarity =
        score?.data?.score?.clarity || currentLinkedInData.score.clarity;
      currentLinkedInData.score.impact =
        score?.data?.score?.impact || currentLinkedInData.score.impact;
      await currentLinkedInData.save();

      console.log("out of else");
      job.result.linkedInVersionId = currentLinkedInData._id.toString();
      job.result.fullOptimizedData = currentLinkedInData.toObject();
      job.finishedAt = new Date();
      await job.save();
      console.log("Job marked as finished at", job.finishedAt);

      if (job.finishedAt) {
        await pubClient.del(redisKey);
      }
      await pubClient.hset(`job:${job._id}`, {
        status: job?.status,
        sections: JSON.stringify(job?.sections),
        resumeId: resumeId,
        isScoreFound: true,
        linkedInId,
        jobId: job._id.toString(),
        score: JSON.stringify(currentLinkedInData.score),
        fullLinkedInVersion: JSON.stringify(currentLinkedInData),
      });
      await pubClient.expire(`job:${job._id}`, 900); //  15 minutes
      await pubClient.publish(
        "job_updates_linkedIn",
        JSON.stringify({
          jobId,
          userId,
          section: section?.name || "",
          status: job?.status,
          sections: job?.sections || [],
          sectionStatus: section?.status || "",
          isScoreFound: true,
          score: JSON.stringify(currentLinkedInData.score),
          fullLinkedInVersion: JSON.stringify(currentLinkedInData),
        }),
      );
      console.log("Published final job update");
    }

    return { success: true };
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
