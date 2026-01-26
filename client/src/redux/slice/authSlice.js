import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  loading: false,
  user: null,
  authOpen: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTrue: (state, actions) => {
      state.isAuth = true;
    },
    setAuthFalse: (state, actions) => {
      state.isAuth = false;
    },
    setAuthOpen: (state, actions) => {
      state.authOpen = actions.payload;
    },
    setUser: (state, actions) => {
      state.isAuth = actions.payload.isAuth;
      state.user = actions.payload.user;
    },
    setCredits: (state, actions) => {
      state.user.totalCredits = actions.payload;
    },
  },
});

export const { setAuthTrue, setCredits, setUser, setAuthFalse, setAuthOpen } =
  authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
