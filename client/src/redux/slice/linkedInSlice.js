import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLinkedInData: null,
  globalLoader: "",
  sectionLoaders: [],
};

export const linkedInSlice = createSlice({
  name: "linkedIn",
  initialState,
  reducers: {
    setCurrentLinkedInData: (state, actions) => {
      state.currentLinkedInData = actions.payload;
    },
    setCurrentToneForHeadline: (state, actions) => {
      if (state.currentLinkedInData?.headline) {
        state.currentLinkedInData.headline.currentTone = actions.payload;
      }
    },
    setGlobalLoader: (state, actions) => {
      state.globalLoader = actions.payload;
    },
    setSectionLoader: (state, actions) => {
      state.sectionLoaders = actions.payload;
    },
  },
});

export const {
  setCurrentLinkedInData,
  setCurrentToneForHeadline,
  setGlobalLoader,
  setSectionLoader,
} = linkedInSlice.actions;
const linkedInReducer = linkedInSlice.reducer;

export default linkedInReducer;
