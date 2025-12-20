import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: localStorage.getItem("token") ? true : false,
  loading: false,
  user: JSON.parse(localStorage.getItem("user") || "null"),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTrue: (state, actions) => {
      state.isAuth = actions.payload;
    },
  },
});

export const { setAuthTrue } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
