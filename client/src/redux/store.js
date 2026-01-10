import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import socketReducer from "./slice/socketSlice";
import resumeReducer from "./slice/resumeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
    resume: resumeReducer,
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
