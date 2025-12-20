import mongoose from "mongoose";

const resumeTemplateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
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
      default: "",
    },
  },
  { timestamps: true }
);

const ResumeTemplate = mongoose.model("ResumeTemplate", resumeTemplateSchema);
export default ResumeTemplate;
