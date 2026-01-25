import { Worker } from "bullmq";
import { bullClient, connectRedis, pubClient } from "../../config/redis.js";
import ResumeTemplate from "../../models/resume.model.js";
import { connectDB } from "../../config/connectDB.js";
import {
  payloadPublisher,
  resumeOptimizer,
  resumeScoreWithAi,
} from "../../LLmFunctions/lllm.js";
import User from "../../models/user.model.js";

const SUPPORTED_OPERATIONS = new Set([
  "personal",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "hobbies",
  "extracurricular",
  "all",
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

const ALL_OPERATION_ORDER = [
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
  return Math.round(
    0.3 * scores.atsScore +
      0.2 * scores.contentClarityScore +
      0.15 * scores.structureScore +
      0.15 * scores.impactScore +
      0.1 * scores.projectScore +
      0.1 * scores.experienceScore,
  );
}
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
      if (event == "resume") {
        if (!resumeId || !operation) {
          await pubClient.hset(jobKey, {
            status: "failed",
            error: "Missing resumeId or operation",
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          await payloadPublisher({
            userId,
            operation: operation,
            jobKey,
            resumeId,
            event,
            status: "failed",
            error: "Missing resumeId or operation",
            startedAt,
            updatedAt: Date.now(),
            completedAt: Date.now(),
          });
          throw new Error("Missing resumeId or operation");
        }

        if (!SUPPORTED_OPERATIONS.has(operation)) {
          await pubClient.hset(jobKey, {
            status: "failed",
            error: "Server Error during AI Optimization",
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          await payloadPublisher({
            userId,
            operation: operation,
            jobKey,
            resumeId,
            event,
            status: "failed",
            error: "Server Error during AI Optimization",
            startedAt,
            updatedAt: Date.now(),
            completedAt: Date.now(),
          });

          throw new Error("Server Error during AI Optimization");
        }

        // 🔒 EXECUTION LOCK (prevents parallel execution)
        const acquired = await pubClient.set(execLockKey, "1", "EX", 300, "NX");

        if (!acquired) {
          console.log("Optimization already in progress");
          // Another worker already processed this
          return { skipped: true };
        }

        await pubClient.hset(jobKey, {
          status: "started",
          error: null,
          currentOperation: "",
          optimizedSections: JSON.stringify({}),
          startedAt: Date.now(),
          updatedAt: null,
          completedAt: null,
          resumeId,
          userId,
          errorTask: JSON.stringify({}),
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

        const { error, isError, data, errorTask } = optimizedData;
        console.log("got optimized data from llm function", operation);

        if (isError) {
          await pubClient.hset(jobKey, {
            status: "failed",
            error,
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          await payloadPublisher({
            userId,
            operation: operation,
            jobKey,
            resumeId,
            event,
            status: "failed",
            error: "Server Error during AI Optimization",
            startedAt,
            updatedAt: Date.now(),
            completedAt: Date.now(),
          });
          throw new Error(`AI Optimization failed: ${error}`);
        }

        let redisData = await pubClient.hgetall(jobKey);
        const optimizedSections = redisData?.optimizedSections
          ? JSON.parse(redisData.optimizedSections)
          : {};
        let isAnyError = false;
        let dbPayload = {};
        let dbChanges = {};
        let successCount = 0;
        let scoreBefore = 0;
        let scoreAfter = 0;

        // console.log(optimizedSections);

        if (operation == "all") {
          console.log("inside if ");

          for (const op of ALL_OPERATION_ORDER) {
            const sectionData = optimizedSections[op];

            if (!sectionData) continue;
            if (sectionData.isError) {
              isAnyError = true;
            } else {
              successCount += 1;
            }

            const value = extractSectionValue(op, sectionData);
            if (value == null) continue;

            dbPayload[op] = value;
            dbChanges[op] = Array.isArray(sectionData.changes)
              ? sectionData.changes
              : [];
          }
          let oldResumeData = null;
          let newSuggestions = [];

          let config = {};
          let templateId = null;
          let version = 1;

          const key = `resume:${resumeId}:${userId}`;

          const exists = await pubClient.exists(key);
          if (exists) {
            const resumeData = await pubClient.hget(key, "data");

            oldResumeData = JSON.parse(resumeData);
            newSuggestions = oldResumeData?.suggestions || [];
            config = oldResumeData?.config || {};
            templateId = oldResumeData?.templateId || "HarvardResume";
            version = oldResumeData?.version || 1;
          } else {
            const resume = await ResumeTemplate.findOne({
              _id: resumeId,
              userId,
            });
            oldResumeData = resume ? resume.toObject() : null;
            newSuggestions = oldResumeData?.suggestions || [];
            config = oldResumeData?.config || {};
            templateId = oldResumeData?.templateId || "HarvardResume";
            version = oldResumeData?.version || 1;
          }

          let score = {
            atsScore: oldResumeData?.atsScore || 0,
            contentClarityScore: oldResumeData?.contentClarityScore || 0,
            structureScore: oldResumeData?.structureScore || 0,
            impactScore: oldResumeData?.impactScore || 0,
            projectScore: oldResumeData?.projectScore || 0,
            experienceScore: oldResumeData?.experienceScore || 0,
          };

          let totalScore = computeResumeScore(score);

          scoreBefore = totalScore;
          scoreAfter = totalScore;

          score["totalScore"] = totalScore;
          // now need to compute new Score

          console.log("Success Count:", successCount);
          if (successCount == 0) {
            console.log("inside success count zero");
            await payloadPublisher({
              userId,
              operation,
              jobKey,
              resumeId,
              event,
              status: "completed",
              optimizedSections,
              errorTask,
              startedAt,
              updatedAt: Date.now(),
              completedAt: Date.now(),
            });

            await pubClient.publish(
              "job:updates-finish",
              JSON.stringify({
                type: "completed",
                result: "all_failed",
                jobKey,
                resumeId,
                userId,
                scoreAfter: null,
                reason: "All sections failed during optimization",
              }),
            );

            return;
          } else {
            // call llm for new Scores and suggestions
            console.log("Called for resume score");

            if (Object.keys(dbChanges).length > 0) {
              let returnedVal = await resumeScoreWithAi({
                oldResumeData,
                dbChanges,
              });

              const { error, isError, data: newScore } = returnedVal;

              if (!isError) {
                score.atsScore = newScore.atsScore;
                score.contentClarityScore = newScore.contentClarityScore;
                score.structureScore = newScore.structureScore;
                score.impactScore = newScore.impactScore;
                score.projectScore = newScore.projectScore;
                score.experienceScore = newScore.experienceScore;
                totalScore = computeResumeScore(score);
                score["totalScore"] = totalScore;
                scoreAfter = totalScore;
                newSuggestions =
                  newScore.optimizationSuggestions.length > 0
                    ? newScore.optimizationSuggestions
                    : newSuggestions;
              }
            }
          }

          console.log("Final Score:", score);
          console.log("New Suggestions:", newSuggestions);

          const newResumeVersion = await ResumeTemplate.create({
            userId,
            jobKey,
            version: version + 1,
            ...dbPayload,
            changes: dbChanges,
            checkedFields,
            skillMap: data.skillMap || {},
            suggestions: newSuggestions,
            scoreBefore,
            scoreAfter,
            ...score,
            templateId,
            config,
          });

          const newkey = `resume:${newResumeVersion._id}:${userId}`;

          await pubClient.hset(newkey, {
            data: JSON.stringify(newResumeVersion),
            isDirty: 0, // not edited yet
            firstEditAt: Date.now(), // editing not started
            lastEditAt: "", // editing not started
          });

          await User.findByIdAndUpdate(userId, {
            currentResumeId: newResumeVersion._id,
          });
          await pubClient.publish(
            "job:updates-finish",
            JSON.stringify(newResumeVersion),
          );
        } else {
          const sectionData = optimizedSections[operation];
          if (!sectionData.isError) {
            successCount += 1;
          } else {
            isAnyError = true;
          }
          const value = extractSectionValue(operation, sectionData);
          let dbChanges = {};
          dbChanges[operation] = Array.isArray(sectionData.changes)
            ? sectionData.changes
            : [];
          console.log(value);
          console.log(dbChanges);

          let oldResumeData = null;
          let newSuggestions = [];
          let scoreBefore = 0;
          let scoreAfter = 0;

          let config = {};
          let templateId = null;

          const key = `resume:${resumeId}:${userId}`;

          let exists = await pubClient.exists(key);
          if (exists) {
            const resumeData = await pubClient.hget(key, "data");

            oldResumeData = JSON.parse(resumeData);
            newSuggestions = oldResumeData?.suggestions || [];
            config = oldResumeData?.config || {};
            templateId = oldResumeData?.templateId || "HarvardResume";
          } else {
            const resume = await ResumeTemplate.findOne({
              _id: resumeId,
              userId,
            });
            oldResumeData = resume ? resume.toObject() : null;
            newSuggestions = oldResumeData?.suggestions || [];
            config = oldResumeData?.config || {};
            templateId = oldResumeData?.templateId || "HarvardResume";
          }

          let score = {
            atsScore: oldResumeData?.atsScore || 0,
            contentClarityScore: oldResumeData?.contentClarityScore || 0,
            structureScore: oldResumeData?.structureScore || 0,
            impactScore: oldResumeData?.impactScore || 0,
            projectScore: oldResumeData?.projectScore || 0,
            experienceScore: oldResumeData?.experienceScore || 0,
          };

          let totalScore = computeResumeScore(score);
          scoreBefore = totalScore;
          scoreAfter = totalScore;

          score["totalScore"] = totalScore;
          // now need to compute new Score

          console.log("Success Count:", successCount);
          if (successCount == 0) {
            console.log("inside success count zero");
            await payloadPublisher({
              userId,
              operation,
              jobKey,
              resumeId,
              event,
              status: "completed",
              optimizedSections,
              errorTask,
              startedAt,
              updatedAt: Date.now(),
              completedAt: Date.now(),
            });
            await pubClient.publish(
              "job:updates-finish",
              JSON.stringify({
                type: "completed",
                result: "all_failed",
                jobKey,
                resumeId,
                userId,
                scoreAfter: null,
                reason: "All sections failed during optimization",
              }),
            );

            return;
          } else {
            // call llm for new Scores and suggestions

            console.log("Called for resume score");

            if (Object.keys(dbChanges).length > 0) {
              let returnedVal = await resumeScoreWithAi({
                oldResumeData,
                dbChanges,
              });

              const { error, isError, data: newScore } = returnedVal;

              if (!isError) {
                score.atsScore = newScore.atsScore;
                score.contentClarityScore = newScore.contentClarityScore;
                score.structureScore = newScore.structureScore;
                score.impactScore = newScore.impactScore;
                score.projectScore = newScore.projectScore;
                score.experienceScore = newScore.experienceScore;
                totalScore = computeResumeScore(score);
                score["totalScore"] = totalScore;
                scoreAfter = totalScore;
                newSuggestions =
                  newScore.optimizationSuggestions.length > 0
                    ? newScore.optimizationSuggestions
                    : newSuggestions;
              }
            }
          }

          console.log("Final Score:", score);
          console.log("New Suggestions:", newSuggestions);

          exists = await pubClient.exists(key);
          if (exists) {
            const resumeData = await pubClient.hget(key, "data");

            oldResumeData = JSON.parse(resumeData);

            oldResumeData[operation] = value;
            oldResumeData.changes = oldResumeData.changes || {};
            oldResumeData.changes[operation] = dbChanges[operation];
            oldResumeData = {
              ...oldResumeData,
              ...score,
              scoreBefore,
              scoreAfter,
              suggestions: newSuggestions,
              updatedAt: Date.now(),
            };
            await pubClient.hset(key, {
              data: JSON.stringify(oldResumeData),
              isDirty: 1, // not edited yet
              firstEditAt: Date.now(), // editing not started
              lastEditAt: "", // editing not started
            });

            await pubClient.publish(
              "job:updates-finish",
              JSON.stringify(oldResumeData),
            );
          } else {
            const resume = await ResumeTemplate.findOneAndUpdate(
              { _id: resumeId },
              {
                $set: {
                  operation: value,
                  [`changes.${operation}`]: Array.isArray(sectionData.changes)
                    ? [
                        ...sectionData.changes,
                        ...oldResumeData.changes[operation],
                      ]
                    : [],
                  ...score,
                  suggestions: newSuggestions,
                  templateId,
                  config,
                  scoreBefore,
                  scoreAfter,
                },
              },
              { upsert: true, new: true },
            );
            await pubClient.hset(key, {
              data: JSON.stringify(resume.toObject()),
              isDirty: 0, // not edited yet
              firstEditAt: Date.now(), // editing not started
              lastEditAt: "", // editing not started
            });

            await pubClient.publish(
              "job:updates-finish",
              JSON.stringify(resume.toObject()),
            );
          }
        }
      }
    } catch (error) {
      await pubClient.hset(jobKey, {
        status: "failed",
        error: "Unexpected server error during AI Optimization",
        currentOperation: null,
        optimizedSections: JSON.stringify({}),
        startedAt: null,
        updatedAt: null,
        completedAt: null,
        resumeId,
        userId,
        errorTask: JSON.stringify({}),
      });

      await pubClient.expire(jobKey, 60 * 10); // 10 minutes

      await payloadPublisher({
        userId,
        operation,
        jobKey,
        resumeId,
        event,
        status: "failed",
        error: error.message || "Worker crashed",
        optimizedSections: {},
        errorTask: { worker: error.message },
        startedAt,
        updatedAt: Date.now(),
        completedAt: Date.now(),
      });

      console.error("Error in AI optimization worker:", error);
      throw error;
    } finally {
      await pubClient.del(redisKey);
      await pubClient.del(execLockKey);
    }

    return { success: true };
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
