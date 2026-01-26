import User from "../models/user.model.js";

export const getCreditBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("totalCredits");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      totalCredits: user.totalCredits,
      success: true,
      message: "Credit balance retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
