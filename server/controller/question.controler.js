import { pubClient } from "../config/redis.js";
import Question from "../models/questions.model.js";

export const addQuestion = async (req, res) => {
  try {
    const data = req.body;
    let {
      title,
      slug,
      subject,
      topic,
      topicOrder = 1,
      difficulty,
      question,
      shortAnswer,
      detailedAnswer,
      codeSnippet,
      keywords,
      isPremium,
    } = data;

    if (
      !title ||
      !slug ||
      !subject ||
      !topic ||
      !topicOrder ||
      !difficulty ||
      !question ||
      !shortAnswer ||
      !detailedAnswer ||
      !codeSnippet ||
      !keywords ||
      typeof isPremium !== "boolean"
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing", success: false });
    }

    const lastTopicOrderCount = await Question.countDocuments({ subject });
    topicOrder = lastTopicOrderCount + 1;

    let isAlreadyExist = await Question.findOne({ slug });
    if (isAlreadyExist) {
      return res.status(400).json({
        message: "Question with this slug already exists",
        success: false,
      });
    }

    const newQuestion = await Question.create({
      title,
      slug,
      subject,
      topic,
      topicOrder,
      difficulty,
      question,
      shortAnswer,
      detailedAnswer,
      codeSnippet,
      keywords,
      isPremium,
    });
    if (!newQuestion) {
      return res
        .status(500)
        .json({ message: "Failed to create question", success: false });
    }
    return res.status(201).json({
      message: "Question added successfully",
      success: true,
      question: newQuestion,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getSubjectQuestionCount = async (req, res) => {
  try {
    const subject = req.params.subject;

    const cachedCount = await pubClient.get(
      `question_count_${subject.toUpperCase()}`,
    );

    if (cachedCount) {
      console.log("got from cache");

      return res.status(200).json({
        message: "Total questions count fetched successfully (from cache)",
        success: true,
        totalQuestions: parseInt(cachedCount),
      });
    }
    if (!subject) {
      return res
        .status(400)
        .json({ message: "Subject is required", success: false });
    }
    let totalQuestions = await Question.countDocuments({
      subject: subject.toUpperCase(),
    });
    await pubClient.set(
      `question_count_${subject.toUpperCase()}`,
      totalQuestions,
    );

    return res.status(200).json({
      message: "Total questions count fetched successfully",
      success: true,
      totalQuestions,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getAllSubjectQuestionCount = async (req, res) => {
  try {
    const subjects = ["DSA", "OOPS", "DBMS", "CN", "OS"];
    const counts = {};

    for (const subject of subjects) {
      const cachedCount = await pubClient.get(
        `question_count_${subject.toUpperCase()}`,
      );
      if (cachedCount) {
        counts[subject] = parseInt(cachedCount);
      } else {
        const count = await Question.countDocuments({
          subject: subject.toUpperCase(),
        });
        counts[subject] = count;
        await pubClient.set(`question_count_${subject.toUpperCase()}`, count);
      }
    }

    console.log(counts);

    return res.status(200).json({
      message: "Total questions count for all subjects fetched successfully",
      success: true,
      counts,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getQuestionsForAllTypeOfFilters = async (req, res) => {
  try {
    const { subject, difficulty, status, page = 1 } = req.body;

    const limit = 10;

    const skip = (page - 1) * limit;

    if (subject.length == 0 || difficulty.length == 0 || status.length == 0) {
      return res.status(400).json({
        message: "Subject, difficulty and status are required",
        success: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
