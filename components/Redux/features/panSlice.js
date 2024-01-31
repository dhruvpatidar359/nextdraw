import { createSlice } from "@reduxjs/toolkit";

export const panSlice = createSlice({
    name:'pan',
    initialState : {
        panOffsetX : 0,
        panOffsetY : 0
    },

    reducers : {
        setPanOffsetX :(state,action) => {
            state.panOffsetX = action.payload;
        }
,
        setPanOffsetY :(state,action) => {
            state.panOffsetY = action.payload;
        }
    }
})


export const {setPanOffsetX,setPanOffsetY} = panSlice.actions;
export default panSlice.reducer;