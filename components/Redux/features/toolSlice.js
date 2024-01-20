import { createSlice } from "@reduxjs/toolkit";

export const toolSlice = createSlice({
    name:'tool',
    initialState : {
        value : 'selection'
    },

    reducers : {
        changeTool :(state,action) => {
            
            
            if(action.payload === 'rect' || action.payload === 'line') {
                document.body.style.cursor = 'crosshair';
            } else {
                document.body.style.cursor = `url('defaultCursor.svg'), auto`;
            }

            state.value = action.payload;
        }
    }
})


export const {changeTool} = toolSlice.actions;
export default toolSlice.reducer;