import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import socketReducer from "./slice/socketSlice";
import resumeReducer from "./slice/resumeSlice";
import jobReducer from "./slice/jobSlice";
import linkedInReducer from "./slice/linkedInSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    resume: resumeReducer,
    job: jobReducer,
    linkedin: linkedInReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socket.socket"],
        ignoredActions: [
          "socket/setSocket",
          "socket/clearSocket",
          "socket/socket",
          "socket/setSocket",
        ],
      },
    }),
});
