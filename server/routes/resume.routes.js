import express from "express";
import { getResumeById } from "../controller/resume.controller.js";

const resumeRouter = express.Router();

resumeRouter.get("/:id", getResumeById);

export default resumeRouter;
