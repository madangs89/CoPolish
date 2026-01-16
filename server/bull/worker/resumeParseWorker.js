import { Worker } from "bullmq";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { bullClient, pubClient } from "../../config/redis.js";
import { resumeParseAIQueue } from "../jobs/bullJobs.js";

const resumeParserWorker = new Worker(
  "resume-parser",
  async (job) => {
    console.log("Processing job:", job.id);
    console.log(job.data);

    const { filePath, fileType: mimetype, userId } = job.data;
    let text = "";
    try {
      if (mimetype === "application/pdf") {
        const buffer = fs.readFileSync(filePath);
        const u8Buffer = new Uint8Array(buffer);
        const parser = new PDFParse(u8Buffer);
        const result = await parser.getText();
        text = result.text;
      } else if (
        mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      }
      await resumeParseAIQueue.add("resume-parse-ai", {
        parsedText: text,
        userId,
        jobId: job.id,
      });
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      throw error;
    }

    return {
      jobId: job.id,
    };
  },
  {
    connection: bullClient,
    concurrency: 5, // run 5 jobs in parallel
  }
);


resumeParserWorker.on("completed", async (job) => {
  const { data } = job;

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_COMPLETED",
      jobId: job.id,
      userId: data.userId,
      isError: false,
      error: null,
    })
  );
  console.log("completed", data);
});

resumeParserWorker.on("failed", async (job , err) => {
  const { data } = job;

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_COMPLETED",
      jobId: job.id,
      userId: data.userId,
      isError: true,
      error: err?.message,
    })
  );
  console.log("failed", job);
});
