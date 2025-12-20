import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  loading: false,
  user: JSON.parse(localStorage.getItem("user") || "null"),
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
    setUser: (state, actions) => {
      state.isAuth = actions.payload.success;
      localStorage.getItem("user", JSON.stringify(actions.payload.user));
      state.user = actions.payload.user;
    },
  },
});

export const { setAuthTrue, setUser, setAuthFalse } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
