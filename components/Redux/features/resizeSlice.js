import { createSlice } from "@reduxjs/toolkit";

export const resizeSlice = createSlice({
  name: "resizeDirection",
  initialState: {
    value: null,
  },

  reducers: {
    setResizingDirection: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setResizingDirection } = resizeSlice.actions;
export default resizeSlice.reducer;
