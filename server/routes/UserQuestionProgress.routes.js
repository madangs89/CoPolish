import { authMiddelware } from "../middleware/auth.middelware.js";
import express from "express";
import {
  getUserProgressForQuestion,
  getUserSolvedQuestionCountForAllSubjects,
  markQuestionAsCompleted,
} from "../controller/UserQuestionProgress.controler.js";

const progressRouter = express.Router();

progressRouter.get(
  "/count/all",
  authMiddelware,
  getUserSolvedQuestionCountForAllSubjects,
);

progressRouter.get(
  "/question/progress/:questionId",
  authMiddelware,
  getUserProgressForQuestion,
);

progressRouter.post("/mark-completed", authMiddelware, markQuestionAsCompleted);

export default progressRouter;
