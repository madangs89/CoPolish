import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  error: null,
  seenJobs: {},
  loading: false,
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobLoading: (state, actions) => {
      state.loading = actions.payload;
    },
    setJobError: (state, actions) => {
      state.error = actions.payload;
    },
    setJobSeenJobs: (state, actions) => {
      let seenJobs = state.seenJobs;
      seenJobs[actions.payload.id] = actions.payload.data;
      state.seenJobs = seenJobs;
    },
  },
});

export const { setJobLoading, setJobError, setJobSeenJobs } = jobSlice.actions;
const jobReducer = jobSlice.reducer;

export default jobReducer;
