import express from "express";
import {
  getLinkedInDataFromId,
  optimizeLinkedIn,
  postToLinkedIn,
} from "../controller/linkedIn.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const linkedInRouter = express.Router();

linkedInRouter.get(
  "/linkedin/:linkedInId",
  authMiddelware,
  getLinkedInDataFromId,
);
linkedInRouter.post("/optimize-linkedin", authMiddelware, optimizeLinkedIn);
linkedInRouter.post("/publish-linkedin-post", authMiddelware, postToLinkedIn);

export default linkedInRouter;
