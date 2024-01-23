
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
    const { x1, y1, x2, y2, id, type } = element;
    const roughCanvasRef = store.getState().canvas.value;


    switch(element.type) {
      case "line":
      case "rect":
        if (ShapeCache.cache.has(element)) {
          // console.log(`using cache ${index1}`);
          roughCanvasRef.draw(ShapeCache.cache.get(element));
        } else {
    
          roughCanvasRef.draw(getElementObject(x1, y1, x2, y2, type));
        }
        break;

      case 'pencil':

        const outlinePoints = getStroke(element.points);
        const pathData = getSvgPathFromStroke(outlinePoints)

        

        const path = new Path2D(pathData);

        ctx.fill(path);
        break;  
      
       default:
        break; 
    }

  
    drawBounds(ctx, element, selectedElement);
  }

  const average = (a, b) => (a + b) / 2


  function getSvgPathFromStroke(points) {
    const len = points.length
  
    if (!len) {
      return ''
    }
  
    const first = points[0]
    let result = `M${first[0].toFixed(3)},${first[1].toFixed(3)}Q`
  
    for (let i = 0, max = len - 1; i < max; i++) {
      const a = points[i]
      const b = points[i + 1]
      result += `${a[0].toFixed(3)},${a[1].toFixed(3)} ${average(
        a[0],
        b[0]
      ).toFixed(3)},${average(a[1], b[1]).toFixed(3)} `
    }
  
    result += 'Z'
  
    return result
  }

 