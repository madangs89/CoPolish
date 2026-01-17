import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  achievementsSchema,
  certificationsSchema,
  educationSchema,
  experienceSchema,
  extracurricularSchema,
  hobbiesSchema,
  parseResumeSchema,
  personalSchema,
  projectsSchema,
  skillsSchema,
} from "../ResumeSchemas/all.schema.js";

export const ajv = new Ajv({
  allErrors: true,
  strict: true,
  useDefaults: true,
  allowUnionTypes: true,
});

addFormats(ajv);

export const schemaMap = {
  personal: personalSchema,
  education: educationSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  skills: skillsSchema,
  certifications: certificationsSchema,
  achievements: achievementsSchema,
  hobbies: hobbiesSchema,
  extracurricular: extracurricularSchema,
  parsed: parseResumeSchema,
};

export const validateLLMResponse = (operation, data) => {
  const schema = schemaMap[operation];
  if (!schema) {
    throw new Error(`No schema found for operation: ${operation}`);
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    return {
      isValid: false,
      errors: validate.errors,
    };
  }

  return {
    isValid: true,
    errors: null,
  };
};
