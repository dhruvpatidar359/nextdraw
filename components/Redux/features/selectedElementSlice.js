import { createSlice } from "@reduxjs/toolkit";

export const selectedElementSlice = createSlice({
    name:'selectedElement',
    initialState : {
        value : null,
        notModifiedValue : null
        
    },

    reducers : {
        setSelectedElement :(state,action) => {
            state.value = action.payload;
        }
,
        setNotModifiedValue :(state,action) => {
            state.value = action.payload;
        }

    }
})


export const {setSelectedElement,setNotModifiedValue} = selectedElementSlice.actions;
export default selectedElementSlice.reducer;