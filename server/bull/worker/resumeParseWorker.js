import { Worker } from "bullmq";

import { getIO } from "../../config/socket.js";
import { bullClient } from "../../config/redis.js";

export const resumeParserWorker = new Worker(
  "resume-parser",
  async (job) => {
    console.log("Processing job:", job.id);
    console.log(job.data);

    // job.id; // '8a122454-9ccb-4777-9e4b-efdae12c18b3'

    // job.name; // 'transcode'
    // job.data; // { input: '...', output: '...' }

    // job.opts; // {} (options passed during add())
    return {
      jobId: job.id,
      //   length: text.length,
      //   preview: text.slice(0, 200),
    };
  },
  {
    connection: bullClient,
    concurrency: 2, // run 2 jobs in parallel
  }
);
// All Events

// resumeParserWorker.on("active", ({ jobId }) => {
//   getIO().emit("job:active", { jobId });
// });

// resumeParserWorker.on("completed", ({ jobId, returnvalue }) => {
//   getIO().emit("job:completed", {
//     jobId,
//     result: returnvalue,
//   });
// });

// resumeParserWorker.on("failed", ({ jobId, failedReason }) => {
//   getIO().emit("job:failed", {
//     jobId,
//     reason: failedReason,
//   });
// });
