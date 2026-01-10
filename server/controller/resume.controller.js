import ResumeTemplate from "../models/resume.model.js";

export const getResumeById = async (req, res) => {
  try {
    const resumeId = req.params.id;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }
    const resume = await ResumeTemplate.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      resume,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};
