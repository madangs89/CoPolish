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

// export const optimize
