import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/connectDB.js";
import authRouter from "./routes/auth.routes.js";
import parseRouter from "./routes/parse.routes.js";
import { createServer } from "http";
import { connectRedis } from "./config/redis.js";
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
  })
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
//       {
//         title: "Schema Genius (AI-Powered Backend Generator)",
//         description: [
//           "Developed an AI-driven platform that converts natural language prompts into production-ready backend system structures to simplify backend development workflows.",
//           "Designed real-time schema editing functionality with multi-database support, enabling developers to work with relational and NoSQL databases within a single platform.",
//           "Implemented real-time communication and synchronization features to support collaborative schema modifications and system generation.",
//           "Optimized system reliability and performance through caching strategies, fault-tolerant recovery mechanisms, and automated repository generation workflows.",
//         ],
//         technologies: [
//           "Node.js",
//           "Express.js",
//           "React.js",
//           "Redux",
//           "MongoDB",
//           "Redis",
//           "Socket.IO",
//           "OAuth",
//         ],
//         link: null,
//       },

//       {
//         title: "Real-Time Bus Ticketing System",
//         description: [
//           "Built a real-time digital bus ticketing system to replace manual ticket issuance.",
//           "Enabled passengers to scan QR codes or enter bus numbers to purchase tickets.",
//           "Implemented real-time communication between passengers and conductors using WebSockets.",
//           "Designed separate user flows for passengers and conductors to manage ticket verification.",
//         ],
//         technologies: ["Node.js", "Express.js", "MongoDB", "Socket.IO"],
//         link: "https://github.com/example/bus-ticketing-system",
//       },
//     ],
//     skills: ["Node.js", "MongoDB", "Socket.IO"],
//     experience: [],
//   },
// });

// const aiResult = await aiPartWiseOptimize(
//   "fakeResumeId",
//   "personal",
//   instruction,
//   contents
// );

// console.log(JSON.stringify(aiResult, null, 2));

httpServer.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});
