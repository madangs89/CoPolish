import { pubClient } from "../config/redis.js";
import Question from "../models/questions.model.js";
import UserQuestionProgressModel from "../models/UserQuestionProgress.model.js";

export const getUserSolvedQuestionCountForAllSubjects = async (req, res) => {
  try {
    const subjects = ["DSA", "OOPS", "DBMS", "CN", "OS"];

    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }

    const counts = {};

    for (const subject of subjects) {
      const count = await UserQuestionProgressModel.countDocuments({
        userId,
        subject,
        completed: true,
      });
      counts[subject] = count;
    }

    return res.status(200).json({
      message: "User Solved question counts retrieved successfully",
      success: true,
      counts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getUserProgressForQuestion = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }

    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({
        message: "questionId is required",
        success: false,
      });
    }

    const progress = await UserQuestionProgressModel.findOne({
      userId,
      questionId,
    });

    return res.status(200).json({
      message: "User progress for question retrieved successfully",
      success: true,
      progress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const markQuestionAsCompleted = async (req, res) => {
  try {
    const { questionId, difficulty, subject } = req.body;

    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }
    if (!questionId || !difficulty || !subject) {
      return res.status(400).json({
        message: "questionId, difficulty and subject are required",
        success: false,
      });
    }

    const progress = await UserQuestionProgressModel.findOneAndUpdate(
      { userId, questionId },
      {
        userId,
        questionId,
        subject: subject.toUpperCase(),
        completed: true,
        completedAt: new Date(),
        difficulty,
      },
      {
        upsert: true,
        new: true,
      },
    );
    return res.status(200).json({
      message: "Question marked as completed",
      success: true,
      progress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const markLikeForQuestion = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized Access",
        success: false,
      });
    }
    const { questionId } = req.body;

    if (!questionId) {
      return res.status(400).json({
        message: "questionId is required",
        success: false,
      });
    }
    const progress = await UserQuestionProgressModel.findOneAndUpdate(
      { userId, questionId },
      {
        liked: true,
        likedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );

    if (!progress) {
      return res
        .status(500)
        .json({ message: "Something went wrong", success: false });
    }
    const updateQuestionLikeCount = await Question.findByIdAndUpdate(
      questionId,
      { $inc: { likes: 1 } },
      { new: true },
    );

    const redisCacheKey = `question_${questionId}`;
    await pubClient.set(redisCacheKey, JSON.stringify(updateQuestionLikeCount));

    return res.status(200).json({
      message: "Question marked as liked",
      success: true,
      liked: progress,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
