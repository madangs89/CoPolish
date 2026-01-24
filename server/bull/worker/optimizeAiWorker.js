import { Worker } from "bullmq";
import { bullClient, connectRedis, pubClient } from "../../config/redis.js";
import ResumeTemplate from "../../models/resume.model.js";
import { connectDB } from "../../config/connectDB.js";
import { resumeOptimizer } from "../../LLmFunctions/lllm.js";

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
            error: null,
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          let jobPayLoad = {
            userId,
            jobKey,
            resumeId,
            event,
            operation: operation,
            data: {
              status: "failed",
              error: "Missing resumeId or operation",
              currentOperation: "",
              optimizedSections: JSON.stringify({}),
              startedAt: null,
              updatedAt: null,
              completedAt: null,
              resumeId,
              userId,
              errorTask: JSON.stringify({}),
            },
          };

          await pubClient.publish("job:updates", JSON.stringify(jobPayLoad));

          throw new Error("Missing resumeId or operation");
        }

        if (!SUPPORTED_OPERATIONS.has(operation)) {
          await pubClient.hset(jobKey, {
            status: "failed",
            error: null,
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          let jobPayLoad = {
            userId,
            jobKey,
            resumeId,
            event,
            operation: operation,
            data: {
              status: "failed",
              error: "Missing resumeId or operation",
              currentOperation: "",
              optimizedSections: JSON.stringify({}),
              startedAt: null,
              updatedAt: null,
              completedAt: null,
              resumeId,
              userId,
              errorTask: JSON.stringify({}),
            },
          };

          await pubClient.publish("job:updates", JSON.stringify(jobPayLoad));

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
          optimizedSections: {},
          startedAt: Date.now(),
          updatedAt: null,
          completedAt: null,
          resumeId,
          userId,
          errorTask: {},
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
          if (
            (errorTask &&
              Object.keys(errorTask).length > 0 &&
              errorTask["resume_not_found"] != undefined) ||
            errorTask["server_error"] !== undefined
          ) {
          }

          await pubClient.hset(jobKey, {
            status: "failed",
            error: null,
            currentOperation: null,
            optimizedSections: JSON.stringify({}),
            startedAt: null,
            updatedAt: null,
            completedAt: null,
            resumeId,
            userId,
            errorTask: JSON.stringify({}),
          });

          let jobPayLoad = {
            userId,
            jobKey,
            resumeId,
            event,
            operation: operation,
            data: {
              status: "failed",
              error: "Server Error during AI Optimization",
              currentOperation: "",
              optimizedSections: JSON.stringify({}),
              startedAt: null,
              updatedAt: null,
              completedAt: null,
              resumeId,
              userId,
              errorTask: JSON.stringify({}),
            },
          };

          await pubClient.publish("job:updates", JSON.stringify(jobPayLoad));

          // need to do pub sub
          await pubClient.del(redisKey);
          await pubClient.del(execLockKey);
          throw new Error(`AI Optimization failed: ${error}`);
        }

        let redisData = await pubClient.hgetall(jobKey);
        const optimizedSections = redisData?.optimizedSections
          ? JSON.parse(redisData.optimizedSections)
          : {};
        let isAnyError = false;
        let dbPayload = {};
        let dbChanges = {};
        let errorCount = 0;

        // console.log(optimizedSections);

        console.log(operation == "all");
        if (operation == "all") {
          console.log("inside if ");

          for (const op of ALL_OPERATION_ORDER) {
            const sectionData = optimizedSections[op];

            if (!sectionData) continue;
            if (sectionData.isError) {
              isAnyError = true;
              errorCount += 1;
            }

            const value = extractSectionValue(op, sectionData);
            if (value == null) continue;

            dbPayload[op] = value;
            dbChanges[op] = Array.isArray(sectionData.changes)
              ? sectionData.changes
              : [];
          }

          console.log("DB PAYLOAD:", dbPayload);
          console.log("DB CHANGES:", dbChanges);
          console.log("error Count", errorCount);
          console.log("skill map", data.skillMap);

          let jobPayLoad = {
            userId,
            jobKey,
            resumeId,
            event,
            operation: operation,
            data: {
              status: "completed",
              error: redisData.error,
              currentOperation: redisData.currentOperation,
              optimizedSections: JSON.stringify(redisData.optimizedSections),
              startedAt: redisData.startedAt,
              updatedAt: redisData.updatedAt,
              completedAt: redisData.completedAt,
              resumeId,
              userId,
              errorTask: JSON.stringify(errorTask),
            },
          };

          await pubClient.publish("job:updates", JSON.stringify(jobPayLoad));

          // const newResumeVersion = await ResumeTemplate.create({
          //   userId,
          //   jobKey,
          //   version: 1,
          //   ...dbPayload,
          //   changes: dbChanges,
          //   checkedFields,
          //   config,
          //   skillMap: data.skillMap || {},
          // });
        } else {
          const sectionData = optimizedSections[operation];

          if (sectionData.isError) {
            isAnyError = true;
            errorCount += 1;
          }

          const value = extractSectionValue(operation, sectionData);

          console.log(value);

          let jobPayLoad = {
            userId,
            jobKey,
            resumeId,
            event,
            operation: operation,
            data: {
              status: redisData.status,
              error: redisData.error,
              currentOperation: redisData.currentOperation,
              optimizedSections: JSON.stringify(redisData.optimizedSections),
              startedAt: redisData.startedAt,
              updatedAt: redisData.updatedAt,
              completedAt: redisData.completedAt,
              resumeId,
              userId,
              errorTask: JSON.stringify(errorTask),
            },
          };
          console.log("publishing event");
          await pubClient.publish("job:updates", JSON.stringify(jobPayLoad));

          // // //  UPSERT = ONLY ONE INSERT EVER
          // const resume = await ResumeTemplate.findOneAndUpdate(
          //   { _id: resumeId },
          //   {
          //     $setOnInsert: {
          //       operation: value,
          //       [`changes.${operation}`]: Array.isArray(sectionData.changes)
          //         ? sectionData.changes
          //         : [],
          //     },
          //   },
          //   { upsert: true, new: true },
          // );
        }

        await pubClient.del(redisKey);
        await pubClient.del(execLockKey);
        // console.log(optimizedData);
      }
    } catch (error) {
      // nee to remove another lock also
      await pubClient.del(redisKey);
      await pubClient.del(execLockKey);
      console.error("Error in AI optimization worker:", error);
      throw error;
    }

    return { success: true };
  },
  {
    connection: bullClient,
    concurrency: 2,
  },
);
