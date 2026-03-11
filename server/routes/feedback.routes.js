import express from "express";
import { authMiddelware } from "../middleware/auth.middelware.js";
import { createFeedBack } from "../controller/feedback.controller.js";

const feedBackRouter = express.Router();

feedBackRouter.post("/create/feedback",authMiddelware,createFeedBack);

export default feedBackRouter;
