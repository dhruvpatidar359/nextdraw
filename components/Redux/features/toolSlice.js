import { createSlice } from "@reduxjs/toolkit";

export const toolSlice = createSlice({
    name:'tool',
    initialState : {
        value : 'selection'
    },

    reducers : {
        changeTool :(state,action) => {

           
            
           

            state.value = action.payload;
        }
    }
})


export const {changeTool} = toolSlice.actions;
export default toolSlice.reducer;