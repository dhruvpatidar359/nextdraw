import { createSlice } from "@reduxjs/toolkit";

export const canvasSlice = createSlice({
  name: "canvas",
  initialState: {
    value: null,
    background: "#FFFFFF",
  },

  reducers: {
    setCanvas: (state, action) => {
      state.value = action.payload;
    },
    setCanvasBackground: (state, action) => {
      state.background = action.payload;
    },
  },
});

export const { setCanvas, setCanvasBackground } = canvasSlice.actions;
export default canvasSlice.reducer;
