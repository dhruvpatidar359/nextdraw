import { createSlice } from "@reduxjs/toolkit";

export const selectedElementSlice = createSlice({
    name: 'selectedElement',
    initialState: {
        value: null,
        selectedElementHistory: [],

    },

    reducers: {
        setSelectedElement: (state, action) => {
            state.value = action.payload;
        }

        , setSelectedElementHistory :(state,action) => {
            state.selectedElementHistory = action.payload;
        }

    }
})


export const { setSelectedElement,setSelectedElementHistory } = selectedElementSlice.actions;
export default selectedElementSlice.reducer;