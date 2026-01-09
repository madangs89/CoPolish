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

httpServer.listen(3000, async () => {
  await connectDB();
  console.log("Server is running on port 3000");
});
