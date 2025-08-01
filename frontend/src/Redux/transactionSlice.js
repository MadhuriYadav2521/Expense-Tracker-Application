import { createSlice } from "@reduxjs/toolkit";

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    transactionAdded: false,
  },
  reducers: {
    setTransactionAdded: (state, action) => {
      state.transactionAdded = action.payload;
    },
  },
});

export const { setTransactionAdded } = transactionsSlice.actions;
export default transactionsSlice.reducer;
