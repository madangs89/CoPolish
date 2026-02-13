import LinkedInProfile from "../../models/linkedin.model.js";
import ResumeTemplate from "../../models/resume.model.js";
import {
  linkedinAboutSystemInstruction,
  linkedinBaseSystemInstruction,
  linkedinExperienceSystemInstruction,
  linkedinHeadlineSystemInstruction,
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

export const getLinkedInDataAndResumeData = async (resumeId, linkedInId) => {
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
  } catch (error) {}
};

export const aiPartWiseOptimize = async (
  resumeId,
  operation,
  instruction,
  contents,
) => {
  let retries = 3;
  let lastError = null;

  while (retries > 0) {
    try {
      console.log("AI part wise called");

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

      const validationResult = validateLLMResponse(operation, parsed);
      const { isValid, errors } = validationResult;

      console.log("AI part wise optimize response:", cleaned);

      if (!isValid) {
        console.error("Validation errors:", errors);
        throw new Error(
          `AI response validation failed: ${JSON.stringify(errors)}`,
        );
      }

      return {
        error: null,
        isError: false,
        data: parsed,
      };
    } catch (err) {
      lastError = err;

      console.error("AI part wise optimize error:", err);

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

// export const optimize
