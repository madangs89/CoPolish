import { pubClient } from "../config/redis.js";
import Question from "../models/questions.model.js";
import UserQuestionProgressModel from "../models/UserQuestionProgress.model.js";

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

    const count = await Question.countDocuments({
      subject: subject.toUpperCase(),
    });
    try {
      await pubClient.set(`question_count_${subject.toUpperCase()}`, count);
    } catch (error) {
      console.log("Failed to update question count in Redis", error);
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

    if (!subject) {
      return res
        .status(400)
        .json({ message: "Subject is required", success: false });
    }

    try {
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
    } catch (error) {
      console.log("Failed to fetch question count from Redis", error);
    }

    let totalQuestions = await Question.countDocuments({
      subject: subject.toUpperCase(),
    });
    try {
      await pubClient.set(
        `question_count_${subject.toUpperCase()}`,
        totalQuestions,
      );
    } catch (error) {
      console.log("Failed to set question count in Redis", error);
    }

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
      let cachedCount = 0;
      try {
        cachedCount = await pubClient.get(
          `question_count_${subject.toUpperCase()}`,
        );
      } catch (error) {
        console.log(
          `Failed to fetch question count for ${subject} from Redis`,
          error,
        );
      }

      if (cachedCount) {
        counts[subject] = parseInt(cachedCount);
      } else {
        const count = await Question.countDocuments({
          subject: subject.toUpperCase(),
        });
        counts[subject] = count;
        try {
          await pubClient.set(`question_count_${subject.toUpperCase()}`, count);
        } catch (error) {
          console.log(
            `Failed to set question count for ${subject} in Redis`,
            error,
          );
        }
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
    let { subject, difficulty, page = 1, status, cursor } = req.params;

    console.log({ cursor });

    console.log({ status });
    page = parseInt(page);
    cursor = parseInt(cursor);

    console.log({ page });
    if (subject == "all") {
      subject = ["DSA", "OOPS", "DBMS", "CN", "OS"];
    } else {
      subject = subject.split(",");
    }
    console.log({ subject });

    difficulty = difficulty.split(",");

    console.log(subject, difficulty, page);

    if (subject.length == 0) {
      subject = ["DSA", "OOPS", "DBMS", "CN", "OS"];
    }

    if (difficulty.length == 0) {
      difficulty = ["Basic", "Easy", "Medium", "Hard"];
    }

    console.log(subject, difficulty, page);
    let limit = 10;

    let skip = (page - 1) * limit;

    if (subject.length == 0 || difficulty.length == 0) {
      return res.status(400).json({
        message: "Subject and difficulty are required",
        success: false,
      });
    }
    const filter = {
      subject: { $in: subject },
      difficulty: { $in: difficulty },
      topicOrder: { $gt: parseInt(cursor) },
    };

    let questions = [];
    let allQuestionsIds = [];
    let allUserSolvedQuestions = [];
    let totalQuestions = await Question.countDocuments({
      subject: { $in: subject },
      difficulty: { $in: difficulty },
    });

    let hasMore = true;
    let hasMoreRef = true;
    while (questions.length < limit && hasMore) {
      let currentQuestions = await Question.find(filter)
        .sort({ topicOrder: 1, _id: 1 })
        .limit(limit + 1)
        .lean();
      if (currentQuestions.length == 0) {
        hasMore = false;
      }

      let hasNextBatch = currentQuestions.length === limit + 1;

      if (hasNextBatch) {
        currentQuestions.pop();
      }

      hasMoreRef = hasNextBatch;

      let currentQuestionId = currentQuestions.map((q) => q._id);
      let currentAllUserSolvedQuestions = await UserQuestionProgressModel.find({
        userId: req.user._id,
        questionId: { $in: currentQuestionId },
        completed: true,
      }).select("questionId");

      if (status && status.toLowerCase() == "solved") {
        currentQuestions = currentQuestions.filter((q) => {
          return currentAllUserSolvedQuestions.some((s) =>
            s.questionId.equals(q._id),
          );
        });
        totalQuestions = await UserQuestionProgressModel.countDocuments({
          subject: { $in: subject },
          userId: req.user._id,
          completed: true,
        });
        console.log({ status, totalQuestions });
      }
      if (status && status.toLowerCase() == "unsolved") {
        currentQuestions = currentQuestions.filter((q) => {
          return !currentAllUserSolvedQuestions.some((s) =>
            s.questionId.equals(q._id),
          );
        });
      }

      questions = [...questions, ...currentQuestions];
      allQuestionsIds = [...allQuestionsIds, ...currentQuestionId];
      allUserSolvedQuestions = [
        ...new Map(
          [...allUserSolvedQuestions, ...currentAllUserSolvedQuestions].map(
            (item) => [item.questionId.toString(), item],
          ),
        ).values(),
      ];
      hasMore = currentQuestions.length > 0;
      if (currentQuestions.length > 0) {
        cursor = currentQuestions[currentQuestions.length - 1].topicOrder;
        filter.topicOrder = { $gt: cursor };
      }
      skip = parseInt(skip) + limit;
      page = parseInt(page) + 1;
    }

    if (status && status.toLowerCase() == "unsolved") {
      let userSolved = await UserQuestionProgressModel.countDocuments({
        subject: { $in: subject },
        userId: req.user._id,
        completed: true,
      });

      console.log(totalQuestions, userSolved);

      totalQuestions = totalQuestions - userSolved;
    }

    if (status && status.toLowerCase() == "solved") {
      totalQuestions = await UserQuestionProgressModel.countDocuments({
        subject: { $in: subject },
        userId: req.user._id,
        completed: true,
      });
      console.log({ status, totalQuestions });
    }

    let totalPages = Math.ceil(totalQuestions / limit);

    let allQuestions = questions.slice(0, limit);

    let newCursor = allQuestions.length
      ? allQuestions[allQuestions.length - 1].topicOrder
      : cursor;

    console.log({ newCursor });

    return res.status(200).json({
      message: "Questions fetched successfully",
      success: true,
      questions: allQuestions,
      totalPages,
      totalQuestions,
      hasMoreRef,
      newCursor,
      allUserSolvedQuestions,
      currentPage: page - 1,
    });
  } catch (error) {
    console.log(error);

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

    const redisCacheKey = `question_${id}`;
    try {
      const cachedQuestion = await pubClient.get(redisCacheKey);

      if (cachedQuestion) {
        console.log("question fetched from redis");

        return res.status(200).json({
          message: "Question fetched successfully (from cache)",
          success: true,
          question: JSON.parse(cachedQuestion),
        });
      }
    } catch (error) {
      console.log("Failed to fetch question from Redis", error);
    }
    const question = await Question.findById(id);
    if (!question) {
      return res
        .status(404)
        .json({ message: "Question not found", success: false });
    }
    try {
      await pubClient.set(redisCacheKey, JSON.stringify(question));
    } catch (error) {
      console.log("Failed to set question in Redis", error);
    }
    return res.status(200).json({
      message: "Question fetched successfully",
      success: true,
      question,
    });
  } catch (error) {
    console.log(error);
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

export const getQuestionOnTheBasisOfDifficulty = async (req, res) => {
  try {
    let questions = {};
    const easyQuestions = await Question.countDocuments({ difficulty: "Easy" });
    const mediumQuestions = await Question.countDocuments({
      difficulty: "Medium",
    });
    const hardQuestions = await Question.countDocuments({ difficulty: "Hard" });
    const Basic = await Question.countDocuments({ difficulty: "Basic" });

    questions["Easy"] = easyQuestions || 0;
    questions["Medium"] = mediumQuestions || 0;
    questions["Hard"] = hardQuestions || 0;
    questions["Basic"] = Basic || 0;

    return res.status(200).json({
      message: "Questions fetched successfully",
      success: true,
      questions,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
