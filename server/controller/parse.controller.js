import { resumeParserQueue } from "../bull/jobs/bullJobs.js";

export const parseData = async (req, res) => {
  try {
    console.log("got request for file parsing");
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { mimetype, buffer, size , path } = req.file;

    if (size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }
    if (
      mimetype != "application/pdf" &&
      mimetype !=
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    await resumeParserQueue.add("resume-parser", {
      filePath: path,
      fileType: mimetype,
      userId: "req.user.id,",
    });

    return res.status(200).json({
      success: true,
      message: "File Received successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse file",
    });
  }
};
