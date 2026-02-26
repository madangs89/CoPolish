import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    solvedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    solvedCount: {
      type: Number,
      default: 0,
    },

    lastSolvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userProgressSchema.index({ user: 1, subject: 1 }, { unique: true });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;
