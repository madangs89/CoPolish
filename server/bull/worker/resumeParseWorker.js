import { Worker } from "bullmq";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { bullClient, pubClient } from "../../config/redis.js";

export const resumeParserWorker = new Worker(
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
    } catch (error) {
      console.error("Error parsing file:", error);
      throw error;
    } finally {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    // console.log(text);

    return {
      jobId: job.id,
    };
  },
  {
    connection: bullClient,
    concurrency: 2, // run 2 jobs in parallel
  }
);
// // All Events

// resumeParserWorker.on("active", (job) => {
//   // getIO().emit("job:active", { jobId });
//   console.log("active", job);
// });

resumeParserWorker.on("completed", async (job) => {
  const { data } = job;

  await pubClient.publish(
    "resume:events",
    JSON.stringify({
      event: "RESUME_PARSE_COMPLETED",
      jobId: job.id,
      userId: data.userId,
    })
  );
  console.log("completed", data);
});

// resumeParserWorker.on("failed", (job) => {
//   // getIO().emit("job:failed", {
//   //   jobId,
//   //   reason: failedReason,
//   // });

//   console.log("failed", job);
// });
