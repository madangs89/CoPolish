import { ai } from "../config/google.js";

const resumeSchema = {
  personal: {
    name: null,
    title: null,
    email: null,
    phone: null,
    summary: null,
    github: null,
    linkedin: null,
    address: null,
  },
  education: [
    {
      degree: null,
      institute: null,
      from: null,
      to: null,
    },
  ],
  experience: [
    {
      role: null,
      company: null,
      duration: null,
      description: [], // Array of strings
    },
  ],
  skills: [],
  projects: [
    {
      title: null,
      description: [],
      technologies: [],
      link: null,
    },
  ],
  certifications: [
    {
      name: null,
      issuer: null,
      year: null,
      credentialUrl: null,
    },
  ],
  achievements: [], // Array of strings
  hobbies: [], // Array of strings
  extracurricular: [
    {
      role: null,
      activity: null,
      year: null,
      description: null,
    },
  ],
  resumeScore: 0, // Numerical score representing resume quality
  optimizationSuggestions: [], // Array of strings with suggestions for improvement
};

const systemInstruction = `

You are an ATS-style resume parsing and evaluation engine.

Your job has TWO distinct responsibilities:

────────────────────────────
PART 1: STRUCTURED EXTRACTION
────────────────────────────

TASK:
Extract structured information from the resume text provided.

STRICT RULES FOR EXTRACTION:
- Use ONLY information explicitly present in the resume text
- Do NOT guess or fabricate missing data
- Do NOT infer job titles, companies, dates, or skills if not clearly mentioned
- If a field is not found, set it to null or an empty array []
- Do NOT repeat identical education, experience, or project entries
- If sections are duplicated, merge them logically
- Do NOT add explanations
- Do NOT add extra fields
- Output MUST match the schema EXACTLY
- Output VALID JSON ONLY

SCHEMA:
${JSON.stringify(resumeSchema)}

────────────────────────────
PART 2: ATS RESUME SCORING
────────────────────────────

TASK:
Calculate an ATS-style resume score between 0 and 100.

SCORING GUIDELINES (use ATS best practices):
- Clarity of job titles and role descriptions
- Presence of measurable impact (numbers, percentages, outcomes)
- Skill relevance and keyword density
- Proper section structure (summary, skills, experience, projects)
- Consistency of dates and roles
- Presence of links (GitHub, LinkedIn, portfolio)
- Avoidance of vague statements
- Overall readability for automated screening

IMPORTANT SCORING RULES:
- Resume score MAY use general ATS knowledge
- Resume score MUST be based on the extracted data
- Do NOT assume experience that does not exist
- Do NOT penalize missing data harshly if resume is clearly a fresher profile

Set:
"resumeScore": <number between 0 and 100>

────────────────────────────
PART 3: OPTIMIZATION SUGGESTIONS
────────────────────────────

TASK:
Provide ATS-focused resume improvement suggestions.

RULES FOR SUGGESTIONS:
- Provide a MINIMUM of 5 suggestions
- Suggestions must be specific and actionable
- Suggestions must be based on ATS optimization
- Suggestions MAY use general industry knowledge
- Suggestions must NOT invent resume content
- Suggestions must NOT reference missing data as if it exists

Examples of good suggestions:
- Improve bullet points with measurable outcomes
- Add missing technical keywords commonly used in ATS
- Strengthen resume summary for role targeting
- Improve project descriptions with impact
- Add relevant certifications or links if applicable

Set:
"optimizationSuggestions": [ minimum 5 strings ]

────────────────────────────
FINAL OUTPUT RULES
────────────────────────────

- Output a SINGLE JSON object
- No markdown
- No comments
- No explanations
- No extra keys
- Strictly follow schema

`;

export const aiResumeParser = async (text) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: text,
      config: {
        systemInstruction,
      },
    });
    console.log(response.text);

    console.log(response.usageMetadata);

    return response.text;
  } catch (error) {
    console.error("Error parsing resume:", error);
    return error;
  }
};
