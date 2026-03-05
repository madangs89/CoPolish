import mongoose from "mongoose";

const userQuestionProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
      index: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    // bookmark
    bookmarked: {
      type: Boolean,
      default: false,
    },

    bookmarkedAt: {
      type: Date,
      default: null,
    },

    liked: {
      type: Boolean,
      default: false,
    },

    likedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },

    timeSpent: {
      type: Number, // seconds
      default: 0,
    },
    difficulty: {
      type: String,
      enum: ["Basic", "Easy", "Medium", "Hard"],
      required: true,
      default: "Basic",
    },
  },
  { timestamps: true },
);

// prevent duplicates
userQuestionProgressSchema.index(
  { userId: 1, questionId: 1 },
  { unique: true },
);

export default mongoose.model(
  "UserQuestionProgress",
  userQuestionProgressSchema,
);
