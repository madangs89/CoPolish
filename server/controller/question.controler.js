import Question from "../models/questions.model";

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
      !isPremium
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing", success: false });
    }

    const lastTopicOrderCount = await Question.countDocuments({ subject });
    topicOrder = lastTopicOrderCount + 1;

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
    return res
      .status(201)
      .json({ message: "Question added successfully", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
