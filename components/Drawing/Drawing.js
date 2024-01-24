
import { addElement, getElementObject, updateElement } from "../ElementManipulation/Element";
import { setElement } from "../Redux/features/elementSlice";
import store from "@/app/store";
import { setSelectedElement } from "../Redux/features/selectedElementSlice";
import { ShapeCache } from "../Redux/ShapeCache";
import getStroke from "perfect-freehand";
import { drawBounds } from "../ElementManipulation/Bounds";





export const draw = (event) => {
    const histIndex = store.getState().elements.index;
    const elements = store.getState().elements.value[histIndex];
    

    const index = elements.length - 1;
    // const tempNewArray = [...elements];
    const { x1, y1, type } = elements[index];

    // const updatedElement = addElement(index, x1, y1, event.clientX, event.clientY, type);

    updateElement(index, x1, y1, event.clientX, event.clientY, type)
    // tempNewArray[index] = updatedElement;

    // // kept separate so that i can set the selectedElement separately from the updateElement
    // store.dispatch(setElement([tempNewArray,true]));
    // store.dispatch(setSelectedElement(updatedElement));


}


export  const drawElements = (ctx,element,selectedElement) => {

    const roughCanvasRef = store.getState().canvas.value;


    switch(element.type) {
      case "line":
      case "rect":
        if (ShapeCache.cache.has(element)) {
          console.log(`using cache ${element.id}`);
          roughCanvasRef.draw(ShapeCache.cache.get(element));
        } else {
    
          roughCanvasRef.draw(getElementObject(element));
        }
        break;

      case 'pencil':
        ctx.fillStyle = 'red';
        if(ShapeCache.cache.has(element)) {
          console.log(`pencil detected ${element.id}`);
          ctx.fill(ShapeCache.cache.get(element));
        } else {
          ctx.fill(getElementObject(element));
        }
     
        break;  
      
       default:
        break; 
    }

  
    drawBounds(ctx, element, selectedElement);
  }
