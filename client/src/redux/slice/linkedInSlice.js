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
    setUpdatedLinkedInPostData: (state, actions) => {
      const { postId, newPostData } = actions.payload;

      if (state.currentLinkedInData?.posts) {
        const postIndex = state.currentLinkedInData.posts.findIndex(
          (p) => p._id === postId,
        );
        if (postIndex !== -1) {
          state.currentLinkedInData.posts[postIndex] = newPostData;
        }
      }
    },
    setSectionLoader: (state, actions) => {
      state.sectionLoaders = actions.payload;
    },
    setLinkedInConnectedTrue: (state, actions) => {
      if (state.currentLinkedInData) {
        state.currentLinkedInData.isLinkedInConnected = true;
      }
    },
  },
});

export const {
  setCurrentLinkedInData,
  setCurrentToneForHeadline,
  setGlobalLoader,
  setSectionLoader,
  setLinkedInConnectedTrue,
  setUpdatedLinkedInPostData,
} = linkedInSlice.actions;
const linkedInReducer = linkedInSlice.reducer;

export default linkedInReducer;
