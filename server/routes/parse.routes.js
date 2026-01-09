import express from "express";
import { parseData } from "../controller/parse.controller.js";
import upload from "../config/multer.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const parseRouter = express.Router();

parseRouter.post(
  "/parse-resume",
  authMiddelware,
  upload.single("resume"),
  parseData
);

export default parseRouter;
