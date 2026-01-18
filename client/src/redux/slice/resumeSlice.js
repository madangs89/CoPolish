import { createSlice } from "@reduxjs/toolkit";
import { templateRegistry } from "../../config/templateRegistory";

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
    type: "single-column",
    columnRatio: [2, 1],
  },

  page: {
    width: 794,
    minHeight: 1123,
    padding: 16,
    background: "#ffffff",
  },

  typography: {
    fontFamily: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    fontSize: {
      name: 25,
      section: 18,
      body: 16,
      small: 13,
    },
    lineHeight: 1.2,
  },

  colors: {
    primary: "#111827",
    accent: "#2563eb",
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },

  spacing: {
    sectionGap: 7,
    itemGap: 6,
  },

  decorations: {
    showDividers: true,
    dividerStyle: "line",
  },

  listStyle: "numbers",
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
    checkedFields: [],
    config: resumeConfig,
  },
  config: resumeConfig,
  currentResumeConfig: resumeConfig,
  templates: templateRegistry,
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
    setCurrentResumeConfig: (state, actions) => {
      state.currentResume.config = actions.payload;
      state.currentResumeConfig = actions.payload;
    },
    setCurrentResumeTemplateId: (state, actions) => {
      state.currentResume.templateId = actions.payload;
    },
    setCheckedField: (state, actions) => {
      state.currentResume.checkedFields = actions.payload;
    },
  },
});

export const {
  setIsChanged,
  setCurrentResumeId,
  setCurrentResume,
  setCurrentResumeConfig,
  setCurrentResumeTemplateId,
  setCheckedField,
} = resumeSlice.actions;
const resumeReducer = resumeSlice.reducer;

export default resumeReducer;
