import express from "express";
import {
  addQuestion,
  getAllSubjectQuestionCount,
  getQuestionsForAllTypeOfFilters,
  getSubjectQuestionCount,
} from "../controller/question.controler.js";
import { adminMiddleware } from "../middleware/admin.middelware.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const questionRouter = express.Router();

questionRouter.get("/get", authMiddelware, getQuestionsForAllTypeOfFilters);
questionRouter.get("/count/all", authMiddelware, getAllSubjectQuestionCount);
questionRouter.get(
  "/count/subjects/:subject",
  authMiddelware,
  getSubjectQuestionCount,
);

questionRouter.post("/add", adminMiddleware, addQuestion);

export default questionRouter;
