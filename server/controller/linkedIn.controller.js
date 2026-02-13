import { aiOptimizationLinkedInQueue } from "../bull/jobs/bullJobs.js";
import { pubClient } from "../config/redis.js";
import CreditLedger from "../models/creditLedger.model.js";
import LinkedinJob from "../models/linkedinJobs.model.js";
import User from "../models/user.model.js";

const CREDIT_COST = {
  headline: 1,
  about: 1,
  experience: 1,
  projects: 1,
  posts: 1,
  score: 1,
  all: 5,
};

export const optimizeLinkedIn = async (req, res) => {
  try {
    console.log(
      "Received request to optimize LinkedIn profile with data:",
      req.body,
    );

    const { section: operation, tone, resumeId, linkedInId } = req.body;

    if (!operation || !tone || !resumeId || !linkedInId) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const userId = req?.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const jobId = `optimize_${resumeId}_linkedin_${linkedInId}_`;

    const redisKey = `optimize-lock:${jobId}`;
    const lock = await pubClient.set(redisKey, "1", "EX", 1800, "NX"); // 30 min lock

    console.log("Optimization lock acquired:", lock);
    if (!lock) {
      return res.status(429).json({
        success: false,
        message: "Optimization already in progress",
      });
    }
    const userCredit = await User.findById(userId).select("totalCredits");
    if (
      userCredit.totalCredits <= 0 ||
      userCredit.totalCredits < CREDIT_COST[operation]
    ) {
      await pubClient.del(redisKey);
      return res.status(402).json({
        success: false,
        message: "Insufficient credits to update resume",
      });
    }

    const sections =
      operation === "all"
        ? [
            { name: "headline", creditCost: 1, tone },
            { name: "about", creditCost: 1, tone },
            { name: "experience", creditCost: 1, tone },
            { name: "projects", creditCost: 1, tone },
          ]
        : [{ name: operation, creditCost: 1, tone }];

    const totalCredits = sections.reduce((s, x) => s + x.creditCost, 0);

    const job = await LinkedinJob.create({
      userId,
      resumeId,
      sections,
      prompt: "",
      operation,
      redisKey,
      creditsDebited: totalCredits,
      linkedInId,
    });

    if (!job) {
      await pubClient.del(redisKey);
      return res.status(500).json({
        success: false,
        message: "Failed to create optimization job",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalCredits: -totalCredits } },
      { new: true },
    );

    await CreditLedger.create({
      userId,
      jobId: job._id,
      type: "DEBIT",
      amount: totalCredits,
      reason: "Resume optimization started",
    });
    await pubClient.hset(`job:${job._id}`, {
      status: "pending",
      jobId: job._id.toString(),
      section: "",
      sections: [],
      sectionStatus: "",
      isScoreFound: false,
      score: null,
      fullResumeVersion: null,
    });

    console.log("Created job:", job._id.toString());

    await aiOptimizationLinkedInQueue.add(
      "optimize-ai-linkedin",
      {
        jobId: job._id.toString(),
      },
      {
        removeOnComplete: true,
        attempts: 1,
      },
    );
    return res.status(200).json({
      message: "LinkedIn profile optimized successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error optimizing LinkedIn profile:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
