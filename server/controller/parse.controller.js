import { resumeParserQueue } from "../bull/jobs/bullJobs.js";
import { pubClient } from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";
export const parseData = async (req, res) => {
  try {
    console.log("got request for file parsing");
    const userId = req.user._id;
    console.log(userId);

    // const key = `parseJobCount:${userId}`;

    // const count = await pubClient.incr(key);

    // if (count === 1) {
    //   await pubClient.expire(key, 60 * 60); // 1 hour expiration
    // }

    // if (count > 3) {
    //   await pubClient.decr(key);

    //   return res.status(429).json({
    //     success: false,
    //     message:
    //       "You have reached the maximum limit of 3 parse requests. Please try after 1 hour.",
    //   });
    // }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { mimetype, buffer, size, path } = req.file;

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

    let jobKey = uuidv4();
    await resumeParserQueue.add(
      "resume-parser",
      {
        filePath: path,
        fileType: mimetype,
        userId,
        jobKey,
      },
      {
        jobId: jobKey,
      }
    );

    return res.status(200).json({
      success: true,
      message: "File Received successfully",
      jobKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse file",
    });
  }
};
