import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import parseRouter from "./routes/parse.routes.js";

import paymentRouter from "./routes/payment.routes.js";
import { createServer } from "http";
import { connectRedis, pubClient } from "./config/redis.js";
import { initSocket } from "./config/socket.js";
import { resumeParserQueue } from "./bull/jobs/bullJobs.js";
import { initSubscribers } from "./pubsub/subcribe.js";
import resumeRouter from "./routes/resume.routes.js";
import { aiPartWiseOptimize } from "./LLmFunctions/lllm.js";
import {
  baseResumeOptimizerSystemInstruction,
  educationSystemInstruction,
  experienceSystemInstruction,
  personalSystemInstruction,
  projectsSystemInstruction,
  skillsSystemInstruction,
} from "./LLmFunctions/llmHelpers/allSystemInstructoin.js";
import { mailTransporter } from "./config/mail.js";
import ResumeTemplate from "./models/resume.model.js";

const app = express();
const httpServer = createServer(app);

await connectRedis();
console.log("Call for socket");

initSocket(httpServer, process.env.CLIENT_URL);
await initSubscribers();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//Auth
app.use("/api/auth/v1", authRouter);

//Parse
app.use("/api/parse/v1", parseRouter);
app.use("/api/resume/v1", resumeRouter);
app.use("/api/payment/v1", paymentRouter);

// const instruction =
//   baseResumeOptimizerSystemInstruction + projectsSystemInstruction;
// const contents = JSON.stringify({
//   operation: "projects",
//   data: {
//     experience: [
//       {
//         role: null,
//         company: null,
//         from: null,
//         to: null,
//         description: [],
//       },
//     ],
//     skills: [
//       "JavaScript",
//       "C++",
//       "HTML",
//       "CSS",
//       "SQL",
//       "React.js",
//       "Node.js",
//       "Express.js",
//       "Redux",
//       "MongoDB",
//       "Redis",
//       "RESTful APIs",
//       "Socket.IO",
//       "JWT",
//       "OAuth",
//       "Git",
//       "GitHub",
//     ],
//     projects: [
//  {
//   "title": "Payment System",
//   "description": [
//     "Built payment system.",
//     "Handled payments.",
//     "Worked on payment logic."
//   ]
// }

//     ],
//     skills: ["Node.js", "MongoDB", "Socket.IO"],
//     experience: [],
//   },
// });

// const aiResult = await aiPartWiseOptimize(
//   "fakeResumeId",
//   "personal",
//   instruction,
//   contents,
// );

// console.log(JSON.stringify(aiResult, null, 2));

setInterval(async () => {
  const now = Date.now();

  /* --------------------------------
     REDIS: ZRANGEBYSCORE
     Get resumes READY to save
     -------------------------------- */
  const keys = await pubClient.zrangebyscore(
    "resume:flush_index",
    0,
    now,
    "LIMIT",
    0,
    50,
  );


  console.log("keys", keys);
  if (!keys.length) return;

  const bulkOps = [];

  for (const key of keys) {
    const data = await pubClient.hgetall(key);

    if (!data || data.isDirty !== "1") {
      await pubClient.zrem("resume:flush_index", key);
      continue;
    }

    const [, resumeId, userId] = key.split(":");

    bulkOps.push({
      updateOne: {
        filter: { _id: resumeId, userId },
        update: JSON.parse(data.data),
      },
    });

    await pubClient.hset(key, {
      isDirty: 0,
      firstEditAt: "",
      lastEditAt: "",
    });

    await pubClient.zrem("resume:flush_index", key);
  }

  /* --------------------------------
     MongoDB: BULK WRITE
     -------------------------------- */
  if (bulkOps.length) {
    await ResumeTemplate.bulkWrite(bulkOps);
  }
}, 5000);

httpServer.listen(3000, async () => {
  await connectDB();

  console.log("Server is running on port 3000");
});
