import express from "express";
import {
  getAllUserResumes,
  getResumeById,
  jobMatcher,
  markApproveAndCreateNew,
  markApprovedAndUpdate,
  optimizeResume,
  updateResume,
  updateResumeBeacon,
} from "../controller/resume.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const resumeRouter = express.Router();
// for getting resume by id
resumeRouter.get("/:id", authMiddelware, getResumeById);
resumeRouter.get("/all/versions", authMiddelware, getAllUserResumes);
// for updating parsed resume and also updating user current resume Id
resumeRouter.put("/mark-approved", authMiddelware, markApprovedAndUpdate);

// for creating manual resume and also updating user current resume Id
resumeRouter.post(
  "/mark-approved-create-new",
  authMiddelware,
  markApproveAndCreateNew,
);

// for optimizing full resume
resumeRouter.post("/optimize-resume", authMiddelware, optimizeResume);
resumeRouter.post("/job-match", authMiddelware, jobMatcher);

// for real time update of resume
resumeRouter.put("/update/:id", authMiddelware, updateResume);
// for updating resume beacon data
resumeRouter.post("/update/:id", updateResumeBeacon);

export default resumeRouter;
