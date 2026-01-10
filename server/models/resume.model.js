import mongoose from "mongoose";

const resumeTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeGroupId: {
      type: String,
      required: true,
      index: true,
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
    },
    changes: [
      {
        section: String,
        before: String,
        after: String,
        reason: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    scoreBefore: {
      type: Number,
      default: 0,
    },
    scoreAfter: {
      type: Number,
      default: 0,
    },
    suggestions: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

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
