import express from "express";
import { optimizeLinkedIn } from "../controller/linkedIn.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const linkedInRouter = express.Router();

linkedInRouter.post("/optimize-linkedin",authMiddelware, optimizeLinkedIn);

export default linkedInRouter;
