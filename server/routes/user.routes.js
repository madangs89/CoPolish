import express from "express";
import { getCreditBalance } from "../controller/user.controler.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const userRouter = express.Router();

userRouter.get("/credits", authMiddelware, getCreditBalance);

export default userRouter;
