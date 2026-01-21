import { ai } from "../config/google.js";
import { pubClient } from "../config/redis.js";
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

function sanitizeUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeResume(ai) {
  ai.projects?.forEach((project) => {
    project.link = (project.link || []).map((l) => ({
      title: l.title ?? l.type ?? null,
      url: sanitizeUrl(l.url),
    }));
  });

  ai.certifications?.forEach((cert) => {
    cert.link = (cert.link || []).map((l) => ({
      title: l.title ?? l.type ?? null,
      url: sanitizeUrl(l.url),
    }));
  });

  return ai;
}

const getResumeFromDb = async (resumeId, operation, key) => {
  try {
    let isFound = false;
    let resumeData;

    console.log("got request to fetch from db ", key);
    if (key) {
      const exists = await pubClient.exists(key);
      if (exists) {
        resumeData = await pubClient.hget(key, "data");
        resumeData = JSON.parse(resumeData);
        isFound = true;
      }
    }

    if (!isFound || !key || !resumeData) {
      resumeData = await ResumeTemplate.findById(resumeId);
      if (!resumeData) {
        return {
          error: "Resume not found",
          isError: true,
          data: null,
        };
      }
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

    // console.log(response.usageMetadata);
    // console.log(newText);

    const normalized = normalizeResume(JSON.parse(newText));

    const isValid = validateLLMResponse("parsed", normalized);

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
  contents,
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
    // console.error("AI optimize error:", error);
    return {
      error,
      isError: true,
      data: null,
    };
  }
};

export const resumeOptimizer = async (info) => {
  try {
    console.log("Resume optimizer called with:", info);
    let errorTask = {};
    let optimizedSections = {};
    const { resumeId, operation, prompt, userId, event, jobKey } = info;

    if (!resumeId || !operation) {
      errorTask["missing_parameters"] = "resumeId and operation are required";
      return {
        error: "resumeId and operation are required",
        isError: true,
        data: null,
        errorTask,
        optimizedSections,
      };
    }

    if (!SUPPORTED_OPERATIONS.has(operation)) {
      errorTask["unsupported_operation"] =
        `Unsupported operation: ${operation}`;
      return {
        error: `Unsupported operation: ${operation}`,
        isError: true,
        data: null,
        errorTask,
        optimizedSections,
      };
    }

    const keyR = `resume:${resumeId}:${userId}`;

    let startedAt = await pubClient.hget(jobKey, "startedAt");

    if (operation === "all") {
      const full = await getResumeFromDb(resumeId, "all", keyR);

      if (!full || full.isError) {
        errorTask["resume_not_found"] = full?.error || "Resume not found";
        return {
          error: full?.error || "Resume not found",
          isError: true,
          data: null,
          errorTask,
          optimizedSections,
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
          baseResumeOptimizerSystemInstruction +
          systemInstructionMask[key] +
          prompt;

        const contents = JSON.stringify({
          data: partialData,
          operation: key,
        });

        const aiResult = await aiPartWiseOptimize(
          resumeId,
          key,
          instruction,
          contents,
        );

        if (aiResult.isError) {
          let err = JSON.parse(JSON.stringify(aiResult.error));
          console.log("AI result error in all operation:", key);

          if (err && err.status == 429) {
            err = "AI quota exceeded. Please try again later.";
            console.log("ai quota exceeded", key);
            errorTask["quota_exceeded"] = err;

            await pubClient.hset(jobKey, {
              status: "failed",
              error: err,
              currentOperation: key,
              optimizedSections: JSON.stringify(optimizedSections),
              startedAt: startedAt,
              updatedAt: Date.now(),
              completedAt: Date.now(),
              resumeId,
              userId,
              errorTask: JSON.stringify(errorTask),
            });

            await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

            return {
              error: err,
              isError: true,
              data: null,
              errorTask,
              optimizedSections,
            };
          } else if (err && err.status == 503) {
            err =
              "AI service is currently unavailable. Please try again later.";
            console.log("ai service unavailable", key);
            errorTask["service_unavailable"] = err;

            await pubClient.hset(jobKey, {
              status: "failed",
              error: err,
              currentOperation: key,
              optimizedSections: JSON.stringify(optimizedSections),
              startedAt: startedAt,
              updatedAt: Date.now(),
              completedAt: Date.now(),
              resumeId,
              userId,
              errorTask: JSON.stringify(errorTask),
            });

            await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration
            return {
              error: err,
              isError: true,
              data: null,
              errorTask,
              optimizedSections,
            };
          }

          errorTask[key] = err;
          optimizedSections[key] = {
            isError: true,
            error: aiResult.error,
            data: partialData,
          };
          continue;
        }

        // Merge safely (no nesting bug)
        updatedResume[key] = aiResult.data[key];
        optimizedSections[key] = {
          isError: false,
          error: null,
          data: aiResult.data[key],
        };

        await pubClient.hset(jobKey, {
          status: "running",
          error: null,
          currentOperation: key,
          optimizedSections: JSON.stringify(optimizedSections),
          startedAt: startedAt,
          updatedAt: Date.now(),
          completedAt: null,
          resumeId,
          userId,
          errorTask: JSON.stringify(errorTask),
        });
      }

      await pubClient.hset(jobKey, {
        status: "completed",
        error: null,
        currentOperation: null,
        optimizedSections: JSON.stringify(optimizedSections),
        startedAt: startedAt,
        updatedAt: Date.now(),
        completedAt: Date.now(),
        resumeId,
        userId,
        errorTask: JSON.stringify(errorTask),
      });
      await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

      return {
        error: null,
        isError: false,
        data: updatedResume,
        errorTask,
        optimizedSections,
      };
    }

    const resumeData = await getResumeFromDb(resumeId, operation, keyR);

    if (!resumeData || resumeData.isError) {
      errorTask["resume_not_found"] = resumeData?.error || "Resume not found";
      return {
        error: resumeData?.error || "Failed to fetch resume data",
        isError: true,
        data: null,
        errorTask,
        optimizedSections,
      };
    }

    const instruction =
      baseResumeOptimizerSystemInstruction +
      systemInstructionMask[operation] +
      prompt;

    const contents = JSON.stringify({
      data: resumeData.data,
      operation,
    });

    const aiResult = await aiPartWiseOptimize(
      resumeId,
      operation,
      instruction,
      contents,
    );

    if (aiResult.isError) {
      let err = JSON.parse(JSON.stringify(aiResult.error));

      if (err && err.status === 429) {
        err = "AI quota exceeded. Please try again later.";
        errorTask["quota_exceeded"] = err;

        await pubClient.hset(jobKey, {
          status: "failed",
          error: err,
          currentOperation: operation,
          optimizedSections: JSON.stringify(optimizedSections),
          startedAt: startedAt,
          updatedAt: Date.now(),
          completedAt: Date.now(),
          resumeId,
          userId,
          errorTask: JSON.stringify(errorTask),
        });

        await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

        return {
          error: err,
          isError: true,
          data: null,
          errorTask,
          optimizedSections,
        };
      } else if (err && err.status === 503) {
        err = "AI service is currently unavailable. Please try again later.";
        errorTask["service_unavailable"] = err;

        await pubClient.hset(jobKey, {
          status: "failed",
          error: err,
          currentOperation: operation,
          optimizedSections: JSON.stringify(optimizedSections),
          startedAt: startedAt,
          updatedAt: Date.now(),
          completedAt: Date.now(),
          resumeId,
          userId,
          errorTask: JSON.stringify(errorTask),
        });

        await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

        return {
          error: err,
          isError: true,
          data: null,
          errorTask,
          optimizedSections,
        };
      }

      errorTask[operation] = err;

      optimizedSections[operation] = {
        isError: true,
        error: aiResult.error,
        data: resumeData.data,
      };

      await pubClient.hset(jobKey, {
        status: "failed",
        error: err,
        currentOperation: operation,
        optimizedSections: JSON.stringify(optimizedSections),
        startedAt: startedAt,
        updatedAt: Date.now(),
        completedAt: Date.now(),
        resumeId,
        userId,
        errorTask: JSON.stringify(errorTask),
      });

      await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

      return {
        error: aiResult.error,
        isError: true,
        data: null,
        errorTask,
        optimizedSections,
      };
    }

    optimizedSections[operation] = {
      isError: false,
      error: null,
      data: aiResult.data[operation],
    };
    await pubClient.hset(jobKey, {
      status: "completed",
      error: null,
      currentOperation: null,
      optimizedSections: JSON.stringify(optimizedSections),
      startedAt: startedAt,
      updatedAt: Date.now(),
      completedAt: Date.now(),
      resumeId,
      userId,
      errorTask: JSON.stringify(errorTask),
    });

    await pubClient.expire(jobKey, 60 * 10); // 10 minutes expiration

    return {
      error: null,
      isError: false,
      data: aiResult.data[operation],
      errorTask,
      optimizedSections,
    };
  } catch (error) {
    console.error("Resume optimizer error:", error);
    let errorTask = {};
    errorTask["server_error"] = error;

    return {
      error,
      isError: true,
      data: null,
      errorTask,
      optimizedSections: {},
    };
  }
};
