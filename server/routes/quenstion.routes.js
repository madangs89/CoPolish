import express from "express";
import {
  addQuestion,
  getAllSubjectQuestionCount,
  getSubjectQuestionCount,
} from "../controller/question.controler.js";
import { adminMiddleware } from "../middleware/admin.middelware.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const questionRouter = express.Router();

questionRouter.post("/add", adminMiddleware, addQuestion);
questionRouter.get("/count/all", authMiddelware, getAllSubjectQuestionCount);
questionRouter.get(
  "/count/subjects/:subject",
  authMiddelware,
  getSubjectQuestionCount,
);

export default questionRouter;
