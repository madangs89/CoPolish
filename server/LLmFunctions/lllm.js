import { ai } from "../config/google.js";
import { validateLLMResponse } from "../JsonHandlers/handlers/ajv.js";

import ResumeTemplate from "../models/resume.model.js";
import {
  achievementsSystemInstruction,
  baseResumeOptimizerSystemInstruction,
  certificationsSystemInstruction,
  educationSystemInstruction,
  experienceSystemInstruction,
  extracurricularSystemInstruction,
  hobbiesSystemInstruction,
  parseResumeSystemInstruction,
  personalSystemInstruction,
  projectsSystemInstruction,
  skillsSystemInstruction,
} from "./llmHelpers/allSystemInstructoin.js";

export const systemInstructionMask = {
  personal: personalSystemInstruction,
  education: educationSystemInstruction,
  experience: experienceSystemInstruction,
  projects: projectsSystemInstruction,
  skills: skillsSystemInstruction,
  certifications: certificationsSystemInstruction,
  achievements: achievementsSystemInstruction,
  hobbies: hobbiesSystemInstruction,
  extracurricular: extracurricularSystemInstruction,
};

const SUPPORTED_OPERATIONS = new Set([
  "personal",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
  "hobbies",
  "extracurricular",
  "all",
]);

const ALL_OPERATION_ORDER = [
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "extracurricular",
  "hobbies",
  "personal",
];

const getResumeFromDb = async (resumeId, operation) => {
  try {
    const resumeData = await ResumeTemplate.findById(resumeId);
    if (!resumeData) {
      return null;
    }

    const payload = {
      error: null,
      isError: false,
      data: null,
    };

    switch (operation) {
      case "all": {
        payload.data = resumeData;
        break;
      }
      case "personal": {
        const d = {
          experience: resumeData.experience,
          projects: resumeData.projects,
          skills: resumeData.skills,
          personal: resumeData.personal,
        };
        payload.data = d;
        break;
      }
      case "education": {
        const d = {
          education: resumeData.education,
        };
        payload.data = d;
        break;
      }
      case "experience": {
        const d = {
          projects: resumeData.projects,
          skills: resumeData.skills,
          experience: resumeData.experience,
        };
        payload.data = d;
        break;
      }
      case "projects": {
        const d = {
          projects: resumeData.projects,
          skills: resumeData.skills,
          experience: resumeData.experience,
        };
        payload.data = d;
        break;
      }
      case "certifications": {
        const d = {
          skills: resumeData.skills,
          certifications: resumeData.certifications,
        };
        payload.data = d;
        break;
      }
      case "achievements": {
        payload.data = resumeData.achievements;
        break;
      }
      case "hobbies": {
        payload.data = resumeData.hobbies;
        break;
      }
      case "extracurricular": {
        payload.data = resumeData.extracurricular;
        break;
      }
      default: {
        payload.data = resumeData;
        break;
      }
    }
    return payload;
  } catch (error) {
    console.error(error);
    const payload = {
      error: error,
      isError: true,
      data: null,
    };

    return payload;
  }
};

const derivePartialData = (fullResume, operation) => {
  switch (operation) {
    case "personal":
      return {
        experience: fullResume.experience,
        projects: fullResume.projects,
        skills: fullResume.skills,
        personal: fullResume.personal,
      };

    case "education":
      return {
        education: fullResume.education,
      };

    case "experience":
      return {
        experience: fullResume.experience,
        projects: fullResume.projects,
        skills: fullResume.skills,
      };

    case "projects":
      return {
        projects: fullResume.projects,
        skills: fullResume.skills,
        experience: fullResume.experience,
      };

    case "skills":
      return {
        skills: fullResume.skills,
      };

    case "certifications":
      return {
        certifications: fullResume.certifications,
        skills: fullResume.skills,
      };

    case "achievements":
      return fullResume.achievements;

    case "hobbies":
      return fullResume.hobbies;

    case "extracurricular":
      return fullResume.extracurricular;

    default:
      return null;
  }
};

// Used in the queue, it will parse the initial stage of resume
export const aiResumeParser = async (text) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: text,
      config: {
        systemInstruction: parseResumeSystemInstruction,
      },
    });
    const newText = response.text
      .replace(/^\s*```json\s*/, "")
      .replace(/\s*```\s*$/, "");

    console.log(response.usageMetadata);
    console.log(newText);

    const isValid = validateLLMResponse("parsed", JSON.parse(newText));

    const { isValid: valid, errors } = isValid;

    if (!valid) {
      console.error("Validation errors:", errors);

      return {
        text: null,
        usage: response.usageMetadata,
        error: errors,
        isError: true,
      };
    }

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

export const aiPartWiseOptimize = async (
  resumeId,
  operation,
  instruction,
  contents
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        systemInstruction: instruction,
      },
    });

    if (!response?.text) {
      throw new Error("Empty AI response");
    }

    const cleaned = response.text
      .replace(/^\s*```json\s*/i, "")
      .replace(/\s*```\s*$/i, "");

    const parsed = JSON.parse(cleaned);

    return {
      error: null,
      isError: false,
      data: parsed,
    };
  } catch (error) {
    console.error("AI optimize error:", error);
    return {
      error,
      isError: true,
      data: null,
    };
  }
};

export const resumeOptimizer = async (info) => {
  try {
    const { resumeId, operation } = info;
    if (!resumeId || !operation) {
      return {
        error: "resumeId and operation are required",
        isError: true,
        data: null,
      };
    }

    if (!SUPPORTED_OPERATIONS.has(operation)) {
      return {
        error: `Unsupported operation: ${operation}`,
        isError: true,
        data: null,
      };
    }

    // ─────────────────────────────
    // HANDLE ALL (ONE DB CALL ONLY)
    // ─────────────────────────────
    if (operation === "all") {
      const full = await getResumeFromDb(resumeId, "all");

      if (!full || full.isError) {
        return {
          error: full?.error || "Resume not found",
          isError: true,
          data: null,
        };
      }

      const fullResume = full.data.toObject ? full.data.toObject() : full.data;
      const updatedResume = { ...fullResume };

      for (const key of ALL_OPERATION_ORDER) {
        const partialData = derivePartialData(fullResume, key);

        if (partialData === null) {
          continue;
        }

        const instruction =
          baseResumeOptimizerSystemInstruction + systemInstructionMask[key];

        const contents = JSON.stringify({
          data: partialData,
          operation: key,
        });

        const aiResult = await aiPartWiseOptimize(
          resumeId,
          key,
          instruction,
          contents
        );

        if (aiResult.isError) {
          return {
            error: aiResult.error,
            isError: true,
            data: null,
          };
        }

        // Merge safely (no nesting bug)
        updatedResume[key] = aiResult.data[key];
      }

      return {
        error: null,
        isError: false,
        data: updatedResume,
      };
    }

    // ─────────────────────────────
    // SINGLE OPERATION (DB ONCE)
    // ─────────────────────────────
    const resumeData = await getResumeFromDb(resumeId, operation);

    if (!resumeData || resumeData.isError) {
      return {
        error: resumeData?.error || "Failed to fetch resume data",
        isError: true,
        data: null,
      };
    }

    const instruction =
      baseResumeOptimizerSystemInstruction + systemInstructionMask[operation];

    const contents = JSON.stringify({
      data: resumeData.data,
      operation,
    });

    const aiResult = await aiPartWiseOptimize(
      resumeId,
      operation,
      instruction,
      contents
    );

    if (aiResult.isError) {
      return {
        error: aiResult.error,
        isError: true,
        data: null,
      };
    }

    return {
      error: null,
      isError: false,
      data: aiResult.data,
    };
  } catch (error) {
    console.error("Resume optimizer error:", error);
    return {
      error,
      isError: true,
      data: null,
    };
  }
};
