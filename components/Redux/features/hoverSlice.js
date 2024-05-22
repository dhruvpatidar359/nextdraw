import { createSlice } from "@reduxjs/toolkit";

export const hoverSlice = createSlice({
  name: "hover",
  initialState: {
    value: "none",
  },

  reducers: {
    setHover: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setHover } = hoverSlice.actions;
export default hoverSlice.reducer;
