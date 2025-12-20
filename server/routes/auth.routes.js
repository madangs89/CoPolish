import express from "express";
import { googleAuth, login, logout, register } from "../controller/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/google/login", googleAuth);

export default authRouter;
