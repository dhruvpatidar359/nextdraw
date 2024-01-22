import { createSlice } from "@reduxjs/toolkit";

export const elementSlice = createSlice({
    name:'elements',
    initialState : {
        value : [[]],
        index : 0
    },

    reducers : {
        setElement :(state,action) => {

            const newState = action.payload[0];
            let overwrite = false;
            if(action.payload.length == 2) {
                overwrite = action.payload[1];
            }
        

            if(overwrite) {
                const histroyCopy = [...state.value];
                histroyCopy[state.index] = newState;
                state.value = histroyCopy;
            } else {
                const updatedState = [...state.value].slice(0,state.index + 1);
                state.value = [...updatedState,newState];
                state.index = state.index + 1;
            }
        },
        undo :(state,action) => {
            if(state.index > 0) {
                state.index = state.index - 1;
            }
        
        }    
,
        redo :(state,action) => {
            if(state.index < state.value.length - 1) {
                state.index = state.index + 1;
            }
            
        }
        
    }
})


export const {setElement,undo,redo} = elementSlice.actions;
export default elementSlice.reducer;