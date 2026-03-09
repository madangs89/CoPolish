import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPaymentModelOpen: false,
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setIsPaymentModelOpen: (state, actions) => {
      state.isPaymentModelOpen = actions.payload;
    },
  },
});

export const { setIsPaymentModelOpen } = paymentSlice.actions;
const paymentReducer = paymentSlice.reducer;

export default paymentReducer;
