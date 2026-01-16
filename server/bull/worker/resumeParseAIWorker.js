import { Worker } from "bullmq";
import { bullClient, pubClient } from "../../config/redis.js";
import { aiResumeParser } from "../../LLmFunctions/lllm.js";
import { v4 as uuidv4 } from "uuid";
import ResumeTemplate from "../../models/resume.model.js";
import User from "../../models/user.model.js";
import { connectDB } from "../../config/connectDB.js";
await connectDB();
const resumeParseAIWorker = new Worker(
  "resume-parse-ai",
  async (job) => {
    const { parsedText, userId, jobKey } = job.data;
    const res = await aiResumeParser(parsedText);

    const { text, usage, error, isError } = res;

    if (isError) {
      console.error("Error in AI resume parsing:", error);
      throw error;
    }
    console.log(text);
    console.log(usage);

    const payload = {
      userId,
      resumeGroupId: uuidv4(),
      version: 1,
      templateId: "default-template",
      scoreBefore: text?.resumeScore || 0,
      suggestions: text?.optimizationSuggestions || [],
      ...text,
    };

    let parsedNewResume;
    let userUpdateCurrentResumeId;
    try {
      payload.jobKey = jobKey;
      const parsedNewResume = await ResumeTemplate.findOneAndUpdate(
        { jobKey },
        { $setOnInsert: payload },
        { upsert: true, new: true }
      );
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

  const data = job?.returnvalue || {};

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
  console.log("completed", data);
});

resumeParseAIWorker.on("failed", async (job, err) => {
  console.log(`Job ${job.id} has failed with error ${err.message}`);

  const data = job.returnvalue;

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_AI_COMPLETED",
      jobId: job.id,
      userId: data.userId,
      parsedNewResume: data.parsedNewResume,
      userUpdateCurrentResumeId: data.userUpdateCurrentResumeId,
      usage: data.usage,
      isError: true,
      error: err?.message,
    })
  );
});
