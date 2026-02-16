import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  name: String, // skills, projects
  status: {
    type: String,
    enum: ["pending", "running", "success", "failed"],
    default: "pending",
  },
  error: String,
  creditCost: Number,
  optimizedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  changedData: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  tone: {
    type: String,
    required: true,
  },
});

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeTemplate",
    },
    linkedInId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "progress",
        "partial",
        "completed",
        "failed",
        "running",
      ],
      default: "pending",
    },

    sections: [SectionSchema],
    creditsDebited: Number,
    creditsRefunded: { type: Number, default: 0 },

    result: {
      totalScore: Number,
      scoreFailed: Boolean,
    },
    prompt: String,
    finishedAt: Date,
    redisKey: String,
    operation: String,
  },
  {
    timestamps: true,
  },
);

const LinkedinJob = mongoose.model("LinkedinJob", jobSchema);
export default LinkedinJob;
