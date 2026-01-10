import { createSlice } from "@reduxjs/toolkit";

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
        link: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        year: "",
        credentialUrl: "",
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
  },
});

export const { setIsChanged, setCurrentResumeId, setCurrentResume } =
  resumeSlice.actions;
const resumeReducer = resumeSlice.reducer;

export default resumeReducer;
