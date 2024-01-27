import { createSlice, current } from "@reduxjs/toolkit";
import { ShapeCache } from "../ShapeCache";

export const elementSlice = createSlice({
    name:'elements',
    initialState : {
        value : [[]],
        index : 0
    },

    reducers : {


        setIndex :(state,action) => {
            state.index = state.index - 1;
        },
        setElement :(state,action) => {

            const newState = action.payload[0];
            let overwrite = false;
            if(action.payload.length === 2) {
                console.log("overwriting");
                overwrite = action.payload[1];
            }
        

            if(overwrite) {
                const histroyCopy = [...state.value];
                histroyCopy[state.index] = newState;
                state.value = histroyCopy;
            } else {
                let length = state.value.length;
                const updatedState = [...state.value].slice(0,state.index + 1);
                const latestState = [...state.value][length-1];



                // we are deleteing those elements from the weakmap that are 
                // removed from the history

                // console.log(current(updatedState[updatedState.length-1]));
                // console.log(current(latestState));

                var set = new Set();
                current(updatedState[updatedState.length-1]).forEach(e => {
                    set.add(e);
                });
           
                current(latestState).forEach(e => {
                    if(!set.has(e)) {
                    
                        if(ShapeCache.cache.has(e)) {
                            // console.log("we are deleteing elements");
                            ShapeCache.cache.delete(e);
                        }
                       
                    }
                });
                
               
                state.value = [...updatedState,newState];
                state.index = state.index + 1;
                // console.log(ShapeCache.cache);

                

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


export const {setElement,undo,redo,setIndex} = elementSlice.actions;
export default elementSlice.reducer;