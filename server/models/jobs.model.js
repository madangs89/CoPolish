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
  optimizedData: null,
  changedData: null,
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
      resumeVersionId: mongoose.Types.ObjectId,
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

const Job = mongoose.model("Job", jobSchema);
export default Job;
