import FeedBack from "../models/feedBack.model.js";

export const createFeedBack = async (req, res) => {
  try {
    const { feedBack, rating } = req.body;

    const userId = req?.user?._id;
    if (!feedBack || !rating)
      return res
        .status(400)
        .json({ error: "feedBack and rating are required" });
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const feedback = await FeedBack.create({
      userId,
      feedBack,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      feedback,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error", success: false, message: "Server Error" });
  }
};
