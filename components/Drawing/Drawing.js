
import { addElement } from "../ElementManipulation/Element";
import { setElement } from "../Redux/features/elementSlice";
import store from "@/app/store";
import { setSelectedElement } from "../Redux/features/selectedElementSlice";





export const draw = (event) => {
    const histIndex = store.getState().elements.index;
    const elements = store.getState().elements.value[histIndex];
    const roughCanvasRef = store.getState().canvas.value;

    const index = elements.length - 1;
    const tempNewArray = [...elements];
    const { x1, y1, type } = elements[index];

    const updatedElement = addElement(index, x1, y1, event.clientX, event.clientY, type);
    tempNewArray[index] = updatedElement;

    // kept separate so that i can set the selectedElement separately from the updateElement
    store.dispatch(setElement([tempNewArray,true]));
    store.dispatch(setSelectedElement(updatedElement));


}