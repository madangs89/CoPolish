import { createSlice } from "@reduxjs/toolkit";
import BalancedTwoColumnResume from "../../components/ResumeTemplates/BalancedTwoColumnResume";
import CareerTimelineResume from "../../components/ResumeTemplates/CareerTimelineResume";
import HarvardResume from "../../components/ResumeTemplates/HarvardResume";
import ModernMinimalResume from "../../components/ResumeTemplates/ModernMinimalResume";
import ProfessionalSidebarResume from "../../components/ResumeTemplates/ProfessionalSidebarResume";
import ResumeClassicBlue from "../../components/ResumeTemplates/ResumeClassicBlue";
import ResumeClassicV1 from "../../components/ResumeTemplates/ResumeClassicV1";
import CleanProfessionalResume from "../../components/ResumeTemplates/CleanProfessionalResume";

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
    padding: 12,
    background: "#ffffff",
  },

  typography: {
    fontFamily: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
    },
    fontSize: {
      name: 25,
      section: 15,
      body: 10,
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
    sectionGap: 10,
    itemGap: 10,
  },

  decorations: {
    showDividers: true,
    dividerStyle: "line", // "dot" | "timeline"
  },

  listStyle: "numbers",

  meta: {
    templateId: "balanced-two-column",
    lastUpdated: new Date().toISOString(),
  },
};

const templateMask = {
  BalancedTwoColumnResume: "BalancedTwoColumnResume",
  CareerTimelineResume: "CareerTimelineResume",
  CleanProfessionalResume: "CleanProfessionalResume",
  HarvardResume: "HarvardResume",
  ModernMinimalResume: "ModernMinimalResume",
  ProfessionalSidebarResume: "ProfessionalSidebarResume",
  ResumeClassicBlue: "ResumeClassicBlue",
  ResumeClassicV1: "ResumeClassicV1",
  "default-template": "CleanProfessionalResume",
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
  templates: templateMask,
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
