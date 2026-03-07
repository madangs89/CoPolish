import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
      enum: ["OOPS", "DBMS", "OS", "CN", "DSA"],
    },
    topic: {
      type: String,
      required: true,
    },
    topicOrder: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Basic", "Easy", "Medium", "Hard"],
      required: true,
      default: "Basic",
    },

    question: {
      type: String,
      required: true,
    },

    shortAnswer: {
      answer: {
        type: String,
        required: true,
      },
      example: {
        type: String,
        default: "",
      },
    },

    detailedAnswer: {
      definition: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      video: {
        type: String,
        default: "",
      },
      interviewTip: {
        type: String,
        default: "",
      },
      commonMistake: {
        type: String,
        default: "",
      },
      realWorldExample: {
        type: String,
        default: "",
      },
    },

    codeSnippet: {
      js: {
        type: String,
        default: "",
        code: "",
      },
      java: {
        type: String,
        default: "",
        code: "",
      },
      cpp: {
        type: String,
        default: "",
        code: "",
      },
      python: {
        type: String,
        default: "",
        code: "",
      },
      c: {
        type: String,
        default: "",
        code: "",
      },
    },

    keywords: [String],

    isPremium: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    interviewCount: {
      type: Number,
      default: 0,
    },
    company: [String],
  },
  { timestamps: true },
);

questionSchema.index({ slug: 1 }, { unique: true });
questionSchema.index({ subject: 1, topicOrder: 1 });
questionSchema.index({ subject: 1, difficulty: 1, topicOrder: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;
