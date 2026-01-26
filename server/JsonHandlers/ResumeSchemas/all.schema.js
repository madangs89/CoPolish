export const personalSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personal: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: {
          anyOf: [{ type: "string", minLength: 1 }, { type: "null" }],
        },
        title: { type: ["string", "null"] },
        email: {
          anyOf: [{ type: "string", format: "email" }, { type: "null" }],
        },
        phone: {
          type: ["string", "null"],
          pattern: "^[0-9+\\-()\\s]{7,20}$",
        },
        summary: { type: ["string", "null"] },
        github: { type: ["string", "null"], format: "uri" },
        linkedin: { type: ["string", "null"], format: "uri" },
        address: { type: ["string", "null"] },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};
export const educationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    education: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: ["string", "null"] },
          institute: { type: ["string", "null"] },
          from: { type: ["string", "null", "number"] },
          to: { type: ["string", "null", "number"] },
        },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",

        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};
export const experienceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experience: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: ["string", "null"] },
          company: { type: ["string", "null"] },
          from: { type: ["string", "null", "number"] },
          to: { type: ["string", "null", "number"] },
          duration: { type: ["string", "null", "number"] },
          description: {
            type: "array",
            default: [],
            items: { type: "string", minLength: 1 },
          },
        },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",

        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const projectsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    projects: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: ["string", "null"] },
          description: {
            type: "array",
            default: [],
            items: { type: "string" },
          },
          technologies: {
            type: "array",
            default: [],
            items: { type: "string" },
          },
          link: {
            type: "array",
            default: [],
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: ["string", "null"] },
                url: {
                  anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
                },
              },
            },
          },
        },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",

        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const skillsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    skills: {
      type: "array",
      default: [],
      items: { type: "string", minLength: 1 },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const certificationsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    certifications: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: ["string", "null"] },
          issuer: { type: ["string", "null"] },
          year: { type: ["string", "null", "number"] },
          credentialUrl: {
            anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
          },
          link: {
            type: "array",
            default: [],
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: ["string", "null"] },
                url: {
                  anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
                },
              },
            },
          },
        },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const achievementsSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    achievements: {
      type: "array",
      default: [],
      items: { type: ["string", "null"] },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const hobbiesSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hobbies: {
      type: "array",
      default: [],
      items: { type: "string" },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const extracurricularSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    extracurricular: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: ["string", "null"] },
          activity: { type: ["string", "null"] },
          year: { type: ["string", "null", "number"] },
          description: { type: ["string", "null"] },
        },
      },
    },
    changes: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        required: ["section", "before", "after", "reason"],
        properties: {
          section: { type: ["string", "null"] },
          before: { type: ["string", "null"] },
          after: { type: ["string", "null"] },
          reason: { type: ["string", "null"] },
        },
      },
    },
  },
};

export const resumeScoreSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resumeScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    atsScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    contentClarityScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    structureScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    impactScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    projectScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    experienceScore: {
      anyOf: [{ type: "number", minimum: 0, maximum: 100 }, { type: "null" }],
    },
    optimizationSuggestions: {
      type: "array",
      default: [],
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          suggestion: { type: "string" },
          impact: {
            type: "string",
            enum: ["High", "Medium", "Low", "high", "medium", "low"],
          },
        },
      },
    },
  },
};

export const parseResumeSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "personal",
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "achievements",
    "hobbies",
    "extracurricular",
    "resumeScore",
    "optimizationSuggestions",
    "atsScore",
    "contentClarityScore",
    "structureScore",
    "impactScore",
    "projectScore",
    "experienceScore",
    "skillMap",
  ],

  properties: {
    // ───────────────────
    // PERSONAL
    // ───────────────────
    personal: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: ["string", "null"] },
        title: { type: ["string", "null"] },
        email: {
          anyOf: [{ type: "string", format: "email" }, { type: "null" }],
        },
        phone: {
          type: ["string", "null"],
          pattern: "^[0-9+\\-()\\s]{7,20}$",
        },
        summary: { type: ["string", "null"] },
        github: { type: ["string", "null"], format: "uri" },
        linkedin: { type: ["string", "null"], format: "uri" },
        address: { type: ["string", "null"] },
      },
    },

    // ───────────────────
    // EDUCATION
    // ───────────────────
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          degree: { type: ["string", "null"] },
          institute: { type: ["string", "null"] },
          from: { type: ["string", "null", "number"] },
          to: { type: ["string", "null", "number"] },
        },
      },
    },

    // ───────────────────
    // EXPERIENCE
    // ───────────────────
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: ["string", "null"] },
          company: { type: ["string", "null"] },
          from: { type: ["string", "null", "number"] },
          to: { type: ["string", "null", "number"] },
          duration: { type: ["string", "null", "number"] },
          description: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },

    // ───────────────────
    // SKILLS
    // ───────────────────
    skills: {
      type: "array",
      items: { type: "string" },
    },

    // ───────────────────
    // PROJECTS
    // ───────────────────
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: ["string", "null"] },
          description: {
            type: "array",
            items: { type: "string" },
          },
          technologies: {
            type: "array",
            items: { type: "string" },
          },
          link: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: ["string", "null"] },
                url: {
                  anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
                },
              },
            },
          },
        },
      },
    },

    // ───────────────────
    // CERTIFICATIONS
    // ───────────────────
    certifications: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: ["string", "null"] },
          issuer: { type: ["string", "null"] },
          year: { type: ["string", "null", "number"] },

          credentialUrl: {
            anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
          },
          link: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: ["string", "null"] },
                url: {
                  anyOf: [{ type: "string", format: "uri" }, { type: "null" }],
                },
              },
            },
          },
        },
      },
    },

    // ───────────────────
    // ACHIEVEMENTS
    // ───────────────────
    achievements: {
      type: "array",
      items: { type: "string" },
    },

    // ───────────────────
    // HOBBIES
    // ───────────────────
    hobbies: {
      type: "array",
      items: { type: "string" },
    },

    // ───────────────────
    // EXTRACURRICULAR
    // ───────────────────
    extracurricular: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          role: { type: ["string", "null"] },
          activity: { type: ["string", "null"] },
          year: { type: ["string", "null", "number"] },
          description: { type: ["string", "null"] },
        },
      },
    },

    // ───────────────────
    // RESUME SCORE
    // ───────────────────
    resumeScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    atsScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    contentClarityScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    structureScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    impactScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    projectScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },
    experienceScore: {
      anyOf: [
        { type: "number", minimum: 0, maximum: 100 },
        { type: "string", pattern: "^[0-9]{1,3}$" },
        { type: "null" },
      ],
    },

    // ───────────────────
    // OPTIMIZATION SUGGESTIONS
    // ───────────────────
    optimizationSuggestions: {
      type: "array",
      minItems: 1,
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          suggestion: { type: "string" },
          impact: {
            type: "string",
            enum: ["High", "Medium", "Low", "high", "medium", "low"],
          },
        },
      },
    },
    skillMap: {
      type: "object",
      additionalProperties: false,
      required: [
        "Programming Languages",
        "Frameworks & Libraries",
        "Databases & Data Technologies",
        "Tools, Platforms & DevOps",
        "Core Concepts & Technical Skills",
      ],
      properties: {
        "Programming Languages": {
          type: "array",
          items: { type: "string" },
        },
        "Frameworks & Libraries": {
          type: "array",
          items: { type: "string" },
        },
        "Databases & Data Technologies": {
          type: "array",
          items: { type: "string" },
        },
        "Tools, Platforms & DevOps": {
          type: "array",
          items: { type: "string" },
        },
        "Core Concepts & Technical Skills": {
          type: "array",
          items: { type: "string" },
        },
      },
    },
  },
};
