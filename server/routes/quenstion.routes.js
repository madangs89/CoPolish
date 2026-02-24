import express from "express";
import { addQuestion } from "../controller/question.controler.js";

const questionRouter = express.Router();

questionRouter.post("/add", addQuestion);

export default questionRouter;
