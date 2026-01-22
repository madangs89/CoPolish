import mongoose from "mongoose";

const resumeTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobKey: {
      type: String,
      required: true,
      index: true,
    },
    resumeGroupId: {
      type: String,
      required: true,
      index: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    title: {
      type: String,
      default: () => `Resume Template ${Date.now()}`,
    },
    personal: {
      name: String,
      title: String,
      email: String,
      phone: String,
      summary: String,
      github: String,
      linkedin: String,
      address: String,
      hackerRank: String,
    },
    education: [
      {
        degree: String,
        institute: String,
        from: String,
        to: String,
      },
    ],
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: [String],
        from: String,
        to: String,
      },
    ],

    skills: [String],

    projects: [
      {
        title: String,
        description: [String],
        technologies: [String],
        link: [
          {
            title: String,
            url: String,
          },
        ],
      },
    ],

    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
        credentialUrl: String,
        link: [
          {
            title: String,
            url: String,
          },
        ],
      },
    ],
    achievements: [String],
    hobbies: [String],
    extracurricular: [
      {
        role: String,
        activity: String,
        from: String,
        to: String,
        description: String,
      },
    ],
    templateId: {
      type: String,
      required: true,
      default: "ModernMinimalResume",
    },
    // changes: [
    //   {
    //     section: String,
    //     before: String,
    //     after: String,
    //     reason: String,
    //     timestamp: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],

    changes: {
      type: Object,
      default: {},
    },
    scoreBefore: {
      type: Number,
      default: 0,
    },
    scoreAfter: {
      type: Number,
      default: 0,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    contentClarityScore: {
      type: Number,
      default: 0,
    },
    structureScore: {
      type: Number,
      default: 0,
    },
    impactScore: {
      type: Number,
      default: 0,
    },
    projectScore: {
      type: Number,
      default: 0,
    },
    experienceScore: {
      type: Number,
      default: 0,
    },
    suggestions: {
      type: [
        {
          suggestion: String,
          impact: String,
        },
      ],
      default: [],
    },
    checkedFields: {
      type: [String],
      required: true,
    },

    config: {
      content: {
        order: {
          type: [String],
          required: true,
        },
      },
      layout: {
        type: {
          type: String,
          default: "single-column",
          enum: ["single-column", "two-column", "sidebar"],
        },
        columnRatio: {
          type: Array,
          default: [2, 1],
        },
      },
      page: {
        width: {
          type: Number,
          default: 794,
        },
        minHeight: {
          type: Number,
          default: 1123,
        },
        padding: {
          type: Number,
          default: 16,
        },
        background: {
          type: String,
          default: "#ffffff",
        },
      },
      typography: {
        fontFamily: {
          heading: {
            type: String,
            default: "Inter, system-ui, sans-serif",
          },
          body: {
            type: String,
            default: "Inter, system-ui, sans-serif",
          },
        },
        fontSize: {
          name: {
            type: Number,
            default: 25,
          },
          section: {
            type: Number,
            default: 18,
          },
          body: {
            type: Number,
            default: 16,
          },
          small: {
            type: Number,
            default: 13,
          },
        },
        lineHeight: {
          type: Number,
          default: 1.2,
        },
      },
      colors: {
        primary: {
          type: String,
          default: "#111827",
        },
        accent: {
          type: String,
          default: "#2563eb",
        },
        text: {
          type: String,
          default: "#1f2937",
        },
        muted: {
          type: String,
          default: "#6b7280",
        },
        line: {
          type: String,
          default: "#e5e7eb",
        },
      },
      spacing: {
        sectionGap: {
          type: Number,
          default: 7,
        },
        itemGap: {
          type: Number,
          default: 6,
        },
      },
      decorations: {
        showDividers: {
          type: Boolean,
          default: true,
        },
        dividerStyle: {
          type: String,
          default: "line",
          enum: ["line", "dot", "timeline"],
        },
      },
      listStyle: {
        type: String,
        default: "numbers",
        enum: ["bullets", "numbers", "none", "dash"],
      },
    },
    skillMap: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

resumeTemplateSchema.index({ _id: 1, userId: 1 }, { unique: true });
const ResumeTemplate = mongoose.model("ResumeTemplate", resumeTemplateSchema);
export default ResumeTemplate;

// {
//   "resumeId": "R1",
//   "version": 4,
//   "type": "JD_OPTIMIZATION",
//   "triggeredBy": "USER",
//   "model": "gemini-3-flash",
//   "timestamp": "2026-01-09T10:30",
//   "changes": [
//     {
//       "section": "experience[0].description[1]",
//       "before": "Worked on frontend using React",
//       "after": "Developed responsive React components used by 10,000+ users",
//       "reason": "Added measurable impact and ATS keyword 'responsive'"
//     }
//   ],
//   "scoreBefore": 62,
//   "scoreAfter": 78
// }
