import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, actions) => {
      state.socket = actions.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
const socketReducer = socketSlice.reducer;

export default socketReducer;
