import { createSlice } from "@reduxjs/toolkit";

export const elementSlice = createSlice({
    name:'elements',
    initialState : {
        value : []
    },

    reducers : {
        setElement :(state,action) => {
            state.value = action.payload;
        }
    }
})


export const {setElement} = elementSlice.actions;
export default elementSlice.reducer;