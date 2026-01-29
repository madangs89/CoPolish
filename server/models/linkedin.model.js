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
      bannerUrl: String,
      profilePicUrl: String,
    },
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

    experience: [
      {
        role: String,
        company: String,
        from: String,
        to: String,

        bullets: {
          current: [String],
          currentId: String,
          suggestions: [
            {
              _id: mongoose.Schema.Types.ObjectId,
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
          status: String,
          scheduledAt: Date,
          postedAt: Date,
          linkedInPostUrl: String,
        },
        privacy: {
          visibility: String,
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
  },
  { timestamps: true },
);

const LinkedInProfile = mongoose.model(
  "LinkedInProfile",
  linkedInProfileSchema,
);

export default LinkedInProfile;
