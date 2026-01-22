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
    atsScore: 0,
    contentClarityScore: 0,
    structureScore: 0,
    impactScore: 0,
    projectScore: 0,
    experienceScore: 0,
    skillMap: {
      "Programming Languages": [], // java , python etc

      "Frameworks & Libraries": [], // react , angular , Spring Boot etc

      "Databases & Data Technologies": [], // MySQL, MongoDB , Redis etc

      "Tools, Platforms & DevOps": [], // Docker, Kubernetes , AWS etc

      "Core Concepts & Technical Skills": [], // Algorithms , Data Structures etc
    },
    suggestions: [],
    checkedFields: [],
    config: resumeConfig,
  },
  config: resumeConfig,
  currentResumeConfig: resumeConfig,
  globalLoaderForStatus: true,

  statusHelper: {
    status: "",
    loading: true,
    error: null,
    currentOperation: "",
    optimizedSections: {},
    startedAt: Date.now(),
    updatedAt: null,
    completedAt: null,
    resumeId: null,
    userId: null,
    errorTask: {},
  },
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
    setGlobalLoaderForStatus: (state, actions) => {
      state.globalLoaderForStatus = actions.payload;
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
  setGlobalLoaderForStatus,
} = resumeSlice.actions;
const resumeReducer = resumeSlice.reducer;

export default resumeReducer;
