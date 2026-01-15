import mongosse from "mongoose";

const orderSchema = new mongosse.Schema(
  {

    userId: {
      type: mongosse.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    credits: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      required: true,
      default: "created",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongosse.model("Order", orderSchema);
