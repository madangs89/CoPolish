import { createSlice } from "@reduxjs/toolkit";

const resumeConfig = {
  content: {
    order: [
      "skills",
      "projects",
      "experience",
      "education",
      "certifications",
      "achievements",
      "extracurricular",
      "hobbies",
      "personal",
    ],
  },

  layout: {
    type: "single-column", // "two-column" | "timeline"
    columnRatio: [2, 1], // only used for two-column
  },

  page: {
    width: 794,
    minHeight: 1123,
    padding: 36,
    background: "#ffffff",
  },

  typography: {
    fontFamily: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    fontSize: {
      name: 30,
      section: 15,
      body: 14,
      small: 13,
    },
    lineHeight: 1.55,
  },

  colors: {
    primary: "#111827",
    accent: "#2563eb",
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },

  spacing: {
    sectionGap: 28,
    itemGap: 14,
  },

  decorations: {
    showDividers: true,
    dividerStyle: "line", // "dot" | "timeline"
  },

  meta: {
    templateId: "balanced-two-column",
    lastUpdated: new Date().toISOString(),
  },
};

const initialState = {
  isChanged: false,
  currentResumeId: null,
  currentResume: {
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      summary: "",
      github: "",
      linkedin: "",
      address: "",
      hackerRank: "",
    },
    education: [
      {
        degree: "",
        institute: "",
        from: "",
        to: "",
      },
    ],
    experience: [
      {
        role: "",
        company: "",
        from: "",
        to: "",
        duration: "",
        description: [],
      },
    ],
    skills: [],
    projects: [
      {
        title: "",
        description: [],
        technologies: [],
        link: [
          {
            title: "",
            url: null,
          },
        ],
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        year: "",
        credentialUrl: "",
        link: [
          {
            title: "",
            url: null,
          },
        ],
      },
    ],
    achievements: [],
    hobbies: [],
    extracurricular: [
      {
        role: "",
        activity: "",
        year: "",
        description: "",
      },
    ],
    templateId: null,
    changes: [],
    scoreBefore: 0,
    scoreAfter: 0,
    suggestions: [],
  },
  config: resumeConfig,
  currentResumeConfig: resumeConfig,
};

export const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setIsChanged: (state, actions) => {
      state.isChanged = actions.payload;
    },
    setCurrentResumeId: (state, actions) => {
      state.currentResumeId = actions.payload;
    },
    setCurrentResume: (state, actions) => {
      state.currentResume = actions.payload;
    },
  },
});

export const { setIsChanged, setCurrentResumeId, setCurrentResume } =
  resumeSlice.actions;
const resumeReducer = resumeSlice.reducer;

export default resumeReducer;
