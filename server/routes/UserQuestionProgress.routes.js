import { authMiddelware } from "../middleware/auth.middelware.js";
import express from "express";
import {
  getUserProgressForQuestion,
  getUserSolvedQuestionCountForAllSubjects,
  getUserSolvedQuestions,
  getUserSolvedQuestionsOnTheBasisOfDifficulty,
  markLikeForQuestion,
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
progressRouter.get(
  "/get/questions/difficulty",
  authMiddelware,
  getUserSolvedQuestionsOnTheBasisOfDifficulty,
);

progressRouter.get("/solved/questions/:page/:limit", authMiddelware, getUserSolvedQuestions);
progressRouter.post("/mark-completed", authMiddelware, markQuestionAsCompleted);
progressRouter.post("/mark-liked", authMiddelware, markLikeForQuestion);

export default progressRouter;
