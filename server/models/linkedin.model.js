import mongoose from "mongoose";

const linkedInProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    extractedFrom: {
      type: String,
      enum: ["resume", "linkedin"],
    },
    isLinkedInConnected: {
      type: Boolean,
      default: false,
    },
    linkedInToken: {
      type: Object,
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
      bannerUrl: String,
      profilePicUrl: String,
    },
    headline: {
      currentTone: {
        type: String,
        enum: ["FORMAL", "CONFIDENT", "BOLD"],
        required: true,
      },
      options: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          text: String,
          type: {
            type: String,
            // enum: ["KEYWORD", "IMPACT", "SAFE", "STARTUP"],
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

    about: {
      currentTone: {
        type: String,
        enum: ["FORMAL", "CONFIDENT", "BOLD"],
        required: true,
      },
      options: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          text: String,
          structure: {
            type: String,
            default: "PARAGRAPH",
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

    experience: [
      {
        role: String,
        company: String,
        from: String,
        to: String,
        bullets: {
          currentTone: {
            type: String,
            enum: ["FORMAL", "CONFIDENT", "BOLD"],
            required: true,
          },
          suggestions: [
            {
              _id: mongoose.Schema.Types.ObjectId,
              bullets: [String],
              improvementType: {
                type: String,
                enum: ["IMPACT", "ATS", "CLARITY"],
              },
              tone: {
                type: String,
                enum: ["FORMAL", "CONFIDENT", "BOLD"],
                required: true,
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

    skills: [String],

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
    score: {
      before: {
        type: Number,
        default: 0,
      },
      currentScore: {
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
    lastOptimizedAt: Date,
    sectionsTouched: [String],
    posts: [
      {
        postId: {
          type: mongoose.Schema.Types.ObjectId,

          required: true,
        },

        content: {
          text: String,
          hashtags: [String],
          mentions: [String],
          links: [
            {
              url: String,
              title: String,
            },
          ],
        },
        media: [
          {
            type: String,
            url: String,
            thumbnailUrl: String,
          },
        ],

        posting: {
          status: {
            type: String,
            enum: ["DRAFT", "SCHEDULED", "POSTED"],
            default: "DRAFT",
          },
          scheduledAt: Date,
          postedAt: Date,
          linkedInPostUrl: String,
        },
        privacy: {
          visibility: {
            type: String,
            default: "public",
            required: true,
          },
          enum: ["public", "private", "connections"],
        },
        aiMeta: {
          generatedByAi: Boolean,
          tone: String,
          topic: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    changes: {
      headline: [],
      about: [],
      experience: [],
    },
  },
  { timestamps: true },
);

const LinkedInProfile = mongoose.model(
  "LinkedInProfile",
  linkedInProfileSchema,
);

export default LinkedInProfile;
