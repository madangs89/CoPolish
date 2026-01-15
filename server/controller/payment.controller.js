import razorpay from "../config/razorpay.js";
import { Order } from "../models/orders.model.js";
import crypto from "crypto";
import User from "../models/user.model.js";
import { Payment } from "../models/payments.model.js";
import { pubClient } from "../config/redis.js";

export const createPayment = async (req, res) => {
  try {
    let { credits, currency } = req.body;
    const userId = req.user._id;

    if (!currency) {
      currency = "INR";
    }

    if (!credits || credits <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid credits amount",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const amount = credits * 30 * 100;

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `rcpt_${Date.now()}`,
    });

    await Order.create({
      userId,
      razorpayOrderId: order.id,
      amount,
      currency,
      credits,
      status: "created",
    });
    res.json({
      orderId: order.id,
      amount,
      currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create payment" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment details" });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order || order.status === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Order not found or already paid" });
    }

    // Mark order paid
    order.status = "paid";
    await order.save();

    const existingPayment = await Payment.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already processed",
      });
    }

    // Add credits
    const updatedUser = await User.findByIdAndUpdate(
      order.userId,
      { $inc: { totalCredits: order.credits } },
      { new: true }
    );

    await Payment.create({
      userId: order.userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: order.amount,
      status: "success",
    });

    await pubClient.publish(
      "mail:events",
      JSON.stringify({
        event: "PAYMENT_SUCCESS",
        email: req.user.email,
        credits: order.credits,
        totalCredits: updatedUser.totalCredits,
      })
    );

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};
