import { createSlice } from "@reduxjs/toolkit";

export const selectedElementSlice = createSlice({
  name: "selectedElement",
  initialState: {
    value: null,
    selectedElementHistory: [],
    copyElement: null,
  },

  reducers: {
    setSelectedElement: (state, action) => {
      state.value = action.payload;
    },

    setSelectedElementHistory: (state, action) => {
      state.selectedElementHistory = action.payload;
    },

    setCopyElement: (state, action) => {
      state.copyElement = action.payload;
    },
  },
});

export const { setSelectedElement, setSelectedElementHistory, setCopyElement } =
  selectedElementSlice.actions;
export default selectedElementSlice.reducer;
