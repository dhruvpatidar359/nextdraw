import { createSlice } from "@reduxjs/toolkit";

export const actionSlice = createSlice({
    name:'action',
    initialState : {
        value : "none"
    },

    reducers : {
        setAction :(state,action) => {
            state.value = action.payload;
        }
    }
})


export const {setAction} = actionSlice.actions;
export default actionSlice.reducer;