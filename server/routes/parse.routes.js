import express from "express";
import { parseData } from "../controller/parse.controller.js";
import upload from "../config/multer.js";

const parseRouter = express.Router();

parseRouter.post("/parse-resume", upload.single("resume"), parseData);

export default parseRouter;
