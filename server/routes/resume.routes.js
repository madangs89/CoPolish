import express from "express";
import {
  getResumeById,
  markApprovedAndUpdate,
} from "../controller/resume.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const resumeRouter = express.Router();

resumeRouter.get("/:id", authMiddelware, getResumeById);
resumeRouter.put("/mark-approved", authMiddelware, markApprovedAndUpdate);

export default resumeRouter;
