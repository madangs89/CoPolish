import express from "express";
import {
  createPayment,
  getPaymentMonthlyStats,
  verifyPayment,
} from "../controller/payment.controller.js";
import { authMiddelware } from "../middleware/auth.middelware.js";

const paymentRouter = express.Router();

paymentRouter.get(
  "/payment/monthly/stats",
  authMiddelware,
  getPaymentMonthlyStats,
);
paymentRouter.post("/create-payment", authMiddelware, createPayment);
paymentRouter.post("/verify-payment", authMiddelware, verifyPayment);

export default paymentRouter;
