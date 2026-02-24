import express from "express";
import { addQuestion } from "../controller/question.controler.js";
import { adminMiddleware } from "../middleware/admin.middelware.js";

const questionRouter = express.Router();

questionRouter.post("/add", adminMiddleware, addQuestion);

export default questionRouter;
