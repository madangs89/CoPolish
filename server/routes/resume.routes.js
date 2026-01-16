import express from "express";
import {
  getResumeById,
  markApproveAndCreateNew,
  markApprovedAndUpdate,
} from "../controller/resume.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const resumeRouter = express.Router();

resumeRouter.get("/:id", authMiddelware, getResumeById);
resumeRouter.put("/mark-approved", authMiddelware, markApprovedAndUpdate);
resumeRouter.post(
  "/mark-approved-create-new",
  authMiddelware,
  markApproveAndCreateNew
);

export default resumeRouter;
