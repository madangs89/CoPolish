// models/creditLedger.model.js
import mongoose from "mongoose";

const CreditLedgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    type: { type: String, enum: ["DEBIT", "REFUND"] },
    amount: Number,
    reason: String,
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const CreditLedger = mongoose.model("CreditLedger", CreditLedgerSchema);

export default CreditLedger;
