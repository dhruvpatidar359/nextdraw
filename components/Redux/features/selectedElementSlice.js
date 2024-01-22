import { createSlice } from "@reduxjs/toolkit";

export const selectedElementSlice = createSlice({
    name:'selectedElement',
    initialState : {
        value : null,
        source : 'drawing'
       
        
    },

    reducers : {
        setSelectedElement :(state,action) => {
            state.value = action.payload;
        }
,
        setSelectedElementSource :(state,action) => {
            state.source = action.payload;
        }


    }
})


export const {setSelectedElement,setSelectedElementSource} = selectedElementSlice.actions;
export default selectedElementSlice.reducer;