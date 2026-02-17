import { ai } from "../../config/google.js";
import LinkedInProfile from "../../models/linkedin.model.js";
import ResumeTemplate from "../../models/resume.model.js";
import User from "../../models/user.model.js";
import {
  linkedinAboutSystemInstruction,
  linkedinBaseSystemInstruction,
  linkedinExperienceSystemInstruction,
  linkedinHeadlineSystemInstruction,
  linkedInScoreSystemInstruction,
  parseLinkedInSystemInstruction,
} from "./allLinkedInLLmInstruction.js";

const SUPPORTED_OPERATIONS = new Set([
  "all",
  "headline",
  "about",
  "experience",
  "Projects",
  "posts",
  "score",
]);

const ALL_OPERATION_ORDER = [
  "headline",
  "about",
  "experience",
  "projects",
  "posts",
  "score",
];

export const buildPromptsForLinkedIn = (operation) => {
  switch (operation) {
    case "headline":
      return linkedinBaseSystemInstruction + linkedinHeadlineSystemInstruction;
    case "about":
      return linkedinBaseSystemInstruction + linkedinAboutSystemInstruction;
    case "experience":
      return (
        linkedinBaseSystemInstruction + linkedinExperienceSystemInstruction
      );
    case "projects":
      break;
    case "posts":
      break;
    case "score":
      break;
    default:
      throw new Error("Unsupported operation");
  }
};

export const getLinkedInDataAndResumeData = async (
  resumeId,
  linkedInId,
  section,
) => {
  let payLoad = {
    isError: false,
    error: null,
    data: null,
  };

  if (!resumeId || !linkedInId) {
    payLoad.isError = true;
    payLoad.error = new Error("Missing resumeId or linkedInId");
    return payLoad;
  }
  try {
    const resumeData = await ResumeTemplate.find({ _id: resumeId }).lean();
    if (!resumeData || resumeData.length === 0) {
      payLoad.isError = true;
      payLoad.error = new Error("Resume not found");
      return payLoad;
    }
    const linkedInData = await LinkedInProfile.findOne({
      _id: linkedInId,
    }).lean();
    if (!linkedInData || linkedInData.length === 0) {
      payLoad.isError = true;
      payLoad.error = new Error("LinkedIn profile not found");
      return payLoad;
    }

    switch (section) {
      case "headline":
        payLoad.data = {
          resumeData: {
            projects: resumeData?.projects,
            experience: resumeData?.experience,
            skills: resumeData?.skills,
            certifications: resumeData?.certifications,
            education: resumeData?.education,
          },

          linkedInData: {
            existedHeadline: linkedInData?.headline,
            targetRoles: linkedInData?.targetRole,
            experience: linkedInData?.experience,
          },
        };

        return payLoad;
        break;
      case "about":
        payLoad.data = {
          resumeData: {
            projects: resumeData?.projects,
            experience: resumeData?.experience,
            skills: resumeData?.skills,
            certifications: resumeData?.certifications,
            education: resumeData?.education,
          },
          linkedInData: {
            existedAbout: linkedInData?.about,
            targetRoles: linkedInData?.targetRole,
            experience: linkedInData?.experience,
          },
        };
        return payLoad;
        break;
      case "experience":
        payLoad.data = {
          resumeData: {
            projects: resumeData?.projects,
            experience: resumeData?.experience,
            skills: resumeData?.skills,
          },
          linkedInData: {
            existedExperience: linkedInData?.experience,
            targetRoles: linkedInData?.targetRole,
            skills: linkedInData?.skills,
          },
        };
        return payLoad;
        break;
    }
  } catch (error) {
    payLoad.isError = true;
    payLoad.error = error;
    return payLoad;
  }
};

export const getScoreForOptimizedData = async (oldData, newData) => {
  let retries = 3;
  let error;

  let payload = {
    oldProfile: {
      context: "Old LinkedIn Data",
      data: oldData,
    },
    newProfile: {
      context: "New LinkedIn Data",
      data: newData,
    },
  };
  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: JSON.stringify(payload),
        config: {
          systemInstruction: linkedInScoreSystemInstruction,
        },
      });

      if (!response?.text) {
        await sleep(2000);
        throw new Error("Empty AI response");
      }

      const cleaned = response.text
        .replace(/^\s*```json\s*/i, "")
        .replace(/\s*```\s*$/i, "");

      console.log(cleaned);

      // const isValid = validateLLMResponse("score", JSON.parse(cleaned));
      // const { isValid: valid, errors } = isValid;

      // if (!valid) {
      //   console.error("Validation errors:", errors);
      //   throw new Error(
      //     `AI response validation failed: ${JSON.stringify(errors)}`,
      //   );
      // }
      return {
        error: null,
        isError: false,
        data: JSON.parse(cleaned),
      };
    } catch (err) {
      error = err;
      console.error("AI score error:", error);
      retries--;
    }
  }

  return {
    error: error,
    isError: true,
    data: null,
  };
};

export const aiLinkedInOptimize = async (
  resumeId,
  operation,
  instruction,
  contents,
) => {
  let retries = 3;
  let lastError = null;

  while (retries > 0) {
    try {
      console.log("AI LinkedIn optimize called");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
        config: {
          systemInstruction: instruction,
        },
      });

      console.log("AI response received for operation:", operation);

      if (!response || !response.text) {
        throw new Error("Empty AI response");
      }

      const cleaned = response.text
        .replace(/^\s*```json\s*/i, "")
        .replace(/\s*```\s*$/i, "");

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        throw new Error("Invalid JSON from AI");
      }

      // const validationResult = validateLLMResponse(operation, parsed);
      // const { isValid, errors } = validationResult;

      // console.log("AI part wise optimize response:", cleaned);

      // if (!isValid) {
      //   console.error("Validation errors:", errors);
      //   throw new Error(
      //     `AI response validation failed: ${JSON.stringify(errors)}`,
      //   );
      // }

      return {
        error: null,
        isError: false,
        data: parsed,
      };
    } catch (err) {
      lastError = err;

    
      // safely extract status if present
      const status =
        err?.status || err?.response?.status || err?.error?.status || null;

      // stop retrying for rate-limit / service errors
      if (status === 429 || status === 503) {
        return {
          error: err,
          isError: true,
          data: null,
        };
      }

      retries--;
      console.log("Retrying AI call, retries left:", retries);

      if (retries > 0) {
        await sleep(2000);
      }
    }
  }

  return {
    error: lastError,
    isError: true,
    data: null,
  };
};

export const aiLinkedInParser = async (text, userId) => {
  try {
    let resumeData = "";
    if (userId) {
      const userDetails = await User.findById(userId);
      if (userDetails && userDetails.currentResumeId) {
        let resume = await ResumeTemplate.findById(userDetails.currentResumeId);
        if (resume) {
          resumeData = resume;
        }
      }
    }
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: JSON.stringify({
        linkedInData: text,
        resumeData,
      }),
      config: {
        systemInstruction: parseLinkedInSystemInstruction,
      },
    });
    const newText = response.candidates[0].content.parts[0].text
      .replace(/^\s*```json\s*/, "")
      .replace(/\s*```\s*$/, "");

    // console.log(response.usageMetadata);
    // console.log(newText);

    // const normalized = normalizeResume(JSON.parse(newText));

    // const isValid = validateLLMResponse("parsed", normalized);

    // const { isValid: valid, errors } = isValid;

    // if (!valid) {
    //   console.error("Validation errors:", errors);

    //   return {
    //     text: null,
    //     usage: response.usageMetadata,
    //     error: errors,
    //     isError: true,
    //   };
    // }

    const payload = {
      text: JSON.parse(newText),
      usage: response.usageMetadata,
      error: null,
      isError: false,
    };

    return payload;
  } catch (error) {
    const payload = {
      text: null,
      usage: null,
      error: error,
      isError: true,
    };
    console.error("Error parsing resume:", error);
    return payload;
  }
};
