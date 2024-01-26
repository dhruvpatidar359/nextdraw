import { createSlice } from "@reduxjs/toolkit";

export const selectedElementSlice = createSlice({
    name: 'selectedElement',
    initialState: {
        value: null,

    },

    reducers: {
        setSelectedElement: (state, action) => {
            state.value = action.payload;
        }

    }
})


export const { setSelectedElement } = selectedElementSlice.actions;
export default selectedElementSlice.reducer;