import express from "express";
import {
  getLinkedInDataFromId,
  optimizeLinkedIn,
} from "../controller/linkedIn.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const linkedInRouter = express.Router();

linkedInRouter.get(
  "/linkedin/:linkedInId",
  authMiddelware,
  getLinkedInDataFromId,
);
linkedInRouter.post("/optimize-linkedin", authMiddelware, optimizeLinkedIn);

export default linkedInRouter;
