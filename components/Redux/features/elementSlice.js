import { createSlice, current } from "@reduxjs/toolkit";
import { GlobalProps } from "../GlobalProps";
import { ShapeCache } from "../ShapeCache";

export const elementSlice = createSlice({
    name: 'elements',
    initialState: {
        value: [[[],null]],
        index: 0,
        changed: false,
        dupState: false
    },

    reducers: {


        setIndex: (state, action) => {
            state.index = state.index - 1;
        },

        setChanged: (state, action) => {
            state.changed = action.payload;
        },

        setDupState: (state, action) => {
            state.dupState = action.payload;
        },

        setElement: (state, action) => {
           
            const newState = action.payload[0];

            let overwrite = action.payload[1];

            let changedElementId = action.payload[2];
         
            if (overwrite) {
                const historyCopy = [...state.value];
                if(state.index != 0) {
                    historyCopy[state.index-1] = [historyCopy[state.index-1][0],changedElementId];
                    historyCopy[state.index] = [newState,null];
                } else {
                    historyCopy[state.index] = [newState,changedElementId];
                
                }
               
               
                state.value = historyCopy;
            } else {
                let length = state.value.length;
                const updatedState = [...state.value].slice(0, state.index + 1);
                const latestState = [...state.value][length - 1];



                // we are deleteing those elements from the weakmap that are 
                // removed from the history

                var set = new Set();
                current(updatedState[updatedState.length - 1][0]).forEach(e => {
                    
                    set.add(e);
                });

                current(latestState[0]).forEach(e => {
             
                    if (!set.has(e)) {

                        if (ShapeCache.cache.has(e)) {
                            // console.log("we are deleteing elements");
                            ShapeCache.cache.delete(e);
                        }

                    }
                });
               
                
                state.value = [...updatedState, [newState,changedElementId]];
                state.index = state.index + 1;






            }
        },
        undo: (state, action) => {
            if (state.index > 0) {

                state.index = state.index - 1;
                if(state.value[state.index][1] === null) {
                    return;
                }
                const key = state.value[state.index][1];
                const undoElementIndex = GlobalProps.indexMap.get(GlobalProps.username + key);

                const undoElement = state.value[state.index][0][undoElementIndex];
                const roomId =   GlobalProps.room;
                if(roomId != null) {

                  GlobalProps.socket.emit("undo-element", { roomId,undoElement,key });
                }
              
            }

        }
        ,
        redo: (state, action) => {
            if (state.index < state.value.length - 1) {
                state.index = state.index + 1;
                const tempNewArray = state.value[state.index][0];
                const roomId =   GlobalProps.room;
  if(roomId != null) {
    GlobalProps.socket.emit("render-elements", { tempNewArray, roomId });
  }

            }

        }

    }
})


export const { setElement, undo, redo, setIndex, setChanged, setDupState } = elementSlice.actions;
export default elementSlice.reducer;