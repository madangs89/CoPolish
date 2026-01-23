import mongoose from "mongoose";

const linkedInProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: [String],
    industry: [String],
    experienceLevel: {
      type: String,
      enum: ["FRESHER", "MID", "SENIOR"],
    },

    personalInfo: {
      fullName: String,
      location: String,
      email: String,
      phone: String,
      linkedinUrl: String,
      portfolioUrl: String,

      githubUrl: String,
    },
    // ---------- HEADLINE ----------
    headline: {
      currentId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      options: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          text: String,
          type: {
            type: String,
            enum: ["KEYWORD", "IMPACT", "SAFE", "STARTUP"],
          },
          keywords: [String],
          tone: {
            type: String,
            enum: ["FORMAL", "CONFIDENT", "BOLD"],
          },
          score: Number,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // ---------- ABOUT ----------
    about: {
      currentId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      options: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          text: String,
          structure: {
            type: String,
            enum: ["PARAGRAPH", "BULLETS"],
          },
          tone: {
            type: String,
            enum: ["FORMAL", "CONFIDENT", "BOLD"],
          },
          hookScore: Number,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // ---------- EXPERIENCE ----------
    experience: [
      {
        role: String,
        company: String,
        from: String,
        to: String,

        bullets: {
          current: [String],
          suggestions: [
            {
              bullets: [String],
              improvementType: {
                type: String,
                enum: ["IMPACT", "ATS", "CLARITY"],
              },
              createdAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
        },
      },
    ],

    // ---------- SKILLS ----------
    skills: {
      current: [String],
      suggestions: [
        {
          skills: [String],
          reason: {
            type: String,
            enum: ["JD_MATCH", "GAP_FILL", "TRENDING"],
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // ---------- SEO / KEYWORDS ----------
    seo: {
      activeKeywords: [String],
      suggestedSets: [
        {
          keywords: [String],
          jobRole: String,
          matchScore: Number,
        },
      ],
    },

    // ---------- SCORING ----------
    score: {
      before: {
        type: Number,
        default: 0,
      },
      after: {
        type: Number,
        default: 0,
      },
      searchability: Number,
      clarity: Number,
      impact: Number,
    },

    // ---------- META ----------
    lastOptimizedAt: Date,
    sectionsTouched: [String],
  },
  { timestamps: true },
);

const LinkedInProfile = mongoose.model(
  "LinkedInProfile",
  linkedInProfileSchema,
);

export default LinkedInProfile;
