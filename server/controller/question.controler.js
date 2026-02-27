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
    let { subject, difficulty, page = 1 } = req.params;

    subject = subject.split(",");
    console.log({subject});
    
    difficulty = difficulty.split(",");

    console.log(subject, difficulty, page);

    if (subject.length == 0) {
      subject = ["DSA", "OOPS", "DBMS", "CN", "OS"];
    }

    if (difficulty.length == 0) {
      difficulty = ["Basic", "Easy", "Medium", "Hard"];
    }

    console.log(subject, difficulty, page);
    const limit = 10;

    const skip = (page - 1) * limit;

    if (subject.length == 0 || difficulty.length == 0) {
      return res.status(400).json({
        message: "Subject and difficulty are required",
        success: false,
      });
    }
    const filter = {
      subject: { $in: subject },
      difficulty: { $in: difficulty },
    };

    const questions = await Question.find(filter)
      .sort({ topicOrder: 1 })
      .skip(skip)
      .limit(limit);



    return res.status(200).json({
      message: "Questions fetched successfully",
      success: true,
      questions,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getCurrentQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Question ID is required", success: false });
    }
    const question = await Question.findById(id);
    if (!question) {
      return res
        .status(404)
        .json({ message: "Question not found", success: false });
    }
    return res.status(200).json({
      message: "Question fetched successfully",
      success: true,
      question,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getRelatedQuestions = async (req, res) => {
  try {
    let { keywords, _id, subject } = req.query;

    if (!keywords) {
      return res.status(400).json({
        message: "Keywords are required to fetch related questions",
        success: false,
      });
    }

    keywords = keywords.split(",");

    let relatedQuestions = [];

    if (keywords.length > 0) {
      relatedQuestions = await Question.find({
        keywords: { $in: keywords },
        _id: { $ne: _id },
        subject: subject,
      }).limit(5);
    }

    const remainingCount = 5 - relatedQuestions.length;

    let moreQuestions = [];

    if (remainingCount > 0) {
      const alreadyFetchedIds = relatedQuestions.map((q) => q._id);

      moreQuestions = await Question.find({
        subject: subject,
        _id: { $nin: [...alreadyFetchedIds, _id] },
      }).limit(remainingCount);
    }

    relatedQuestions = [...relatedQuestions, ...moreQuestions];

    return res.status(200).json({
      message: "Related questions fetched successfully",
      success: true,
      relatedQuestions,
      length: relatedQuestions.length,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};
