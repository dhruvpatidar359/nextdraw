import { createSlice } from "@reduxjs/toolkit";

export const canvasSlice = createSlice({
    name:'canvas',
    initialState : {
        value : null
    },

    reducers : {
        setCanvas :(state,action) => {
            state.value = action.payload;
        }
    }
})


export const {setCanvas} = canvasSlice.actions;
export default canvasSlice.reducer;