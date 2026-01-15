import express from "express";
import { createPayment, verifyPayment } from "../controller/payment.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-payment", authMiddelware, createPayment);
paymentRouter.post("/verify-payment", authMiddelware, verifyPayment);

export default paymentRouter;
