import express from "express";
import {
  googleAuth,
  isAuth,
  linkedInCodeExchange,
  login,
  logout,
  register,
} from "../controller/auth.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/google/login", googleAuth);
authRouter.post("/linkedin/exchange", authMiddelware, linkedInCodeExchange);
authRouter.get("/is-auth", authMiddelware, isAuth);

export default authRouter;
