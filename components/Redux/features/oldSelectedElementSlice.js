import { createSlice } from "@reduxjs/toolkit";

export const oldElement = createSlice({
    name:'oldElement',
    initialState : {
        value : null,
        
    },

    reducers : {
        setOldElement :(state,action) => {
            state.value = action.payload;
        }
       
    }
})


export const {setOldElement} = oldElement.actions;
export default oldElement.reducer;