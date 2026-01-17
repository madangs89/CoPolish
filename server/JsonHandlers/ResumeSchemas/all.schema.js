export const personalSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personal: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: ["string", "null"], minLength: 1 },
        title: { type: ["string", "null"] },
        email: { type: ["string", "null"], format: "email" },
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
          from: { type: ["string", "null"] },
          to: { type: ["string", "null"] },
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
          from: { type: ["string", "null"] },
          to: { type: ["string", "null"] },
          duration: { type: ["string", "null"] },
          description: {
            type: "array",
            default: [],
            items: { type: "string", minLength: 1 },
          },
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
                title: { type: "string" },
                url: { type: "string", format: "uri" },
              },
            },
          },
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
          year: { type: ["string", "null"] },
          credentialUrl: { type: ["string", "null"], format: "uri" },
          link: {
            type: "array",
            default: [],
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                url: { type: "string", format: "uri" },
              },
            },
          },
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
      items: { type: "string" },
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
          year: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
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
        email: { type: ["string", "null"], format: "email" },
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
          from: { type: ["string", "null"] },
          to: { type: ["string", "null"] },
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
          from: { type: ["string", "null"] },
          to: { type: ["string", "null"] },
          duration: { type: ["string", "null"] },
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
                title: { type: "string" },
                url: { type: "string", format: "uri" },
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
          year: { type: ["string", "null"] },
          credentialUrl: { type: ["string", "null"], format: "uri" },
          link: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                url: { type: "string", format: "uri" },
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
          year: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
      },
    },

    // ───────────────────
    // RESUME SCORE
    // ───────────────────
    resumeScore: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },

    // ───────────────────
    // OPTIMIZATION SUGGESTIONS
    // ───────────────────
    optimizationSuggestions: {
      type: "array",
      minItems: 5,
      maxItems: 8,
      items: { type: "string" },
    },
  },
};
