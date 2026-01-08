import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import socketReducer from "./slice/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
});
