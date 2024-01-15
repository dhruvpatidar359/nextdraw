import { createSlice } from "@reduxjs/toolkit";

export const timeSlice = createSlice({
    name:'selectedElement',
    initialState : {
        value : 0
    },

    reducers : {
        setH :(state,action) => {
            state.value = action.payload;
        }
    }
})


export const {setH} = timeSlice.actions;
export default timeSlice.reducer;