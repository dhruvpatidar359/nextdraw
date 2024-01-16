import { useDispatch, useSelector } from "react-redux";
import { setElement } from "../Redux/features/elementSlice";
import store from "@/app/store";
import { setOldSelectedElement, setSelectedElement } from "../Redux/features/selectedElementSlice";



export function addElement(id, x1, y1, x2, y2, type) {
  
    switch (type) {
      case 'rect':
       
        return { id, x1, x2, y1, y2, type };


      case 'line':
      
        return { id, x1, x2, y1, y2, type };

      default:
      
        return { id, x1, x2, y1, y2, type };

    }

  }


export const getElementObject = (x1,y1,x2,y2,type)=>{
  const roughCanvasRef = store.getState().canvas.value;
  const root = roughCanvasRef.generator;

  let elementObject;

  switch (type) {
    case 'rect':
      elementObject = root.rectangle(x1,
        y1,
        x2 - x1,
        y2 - y1, { seed: 15, strokeWidth: 3, fillStyle: 'solid', fill: 'grey' }
      );
      break;


    case 'line':
      elementObject = root.line(x1, y1, x2, y2, { seed: 15 });
      break;

    default:
      elementObject = root.line(x1, y1, x2, y2, { seed: 15 });
      break;

  }
  return elementObject;

}
  



export const getElementBelow = (event) => {
  const elements = store.getState().elements.value;

    for (var i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const { x1, y1, x2, y2, type } = element;

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      let found = false;


      switch (type) {
        case "rect":

          if (event.clientX > minX - 10 && event.clientX < maxX + 10 && event.clientY > minY - 10 && event.clientY < maxY + 10) {
            found = true;
          }
          break;

        case "line":

          if (event.clientX > minX - 10 &&
            event.clientX < maxX + 10 &&
            event.clientY > minY - 10 &&
            event.clientY < maxY + 10) {

            const total_length = Math.sqrt((Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
            const initial = Math.sqrt((Math.pow(y1 - event.clientY, 2) + Math.pow(x1 - event.clientX, 2)));
            const final = Math.sqrt((Math.pow(y2 - event.clientY, 2) + Math.pow(x2 - event.clientX, 2)));

            const diff = Math.abs(total_length - (initial + final));


            if (diff < 1) {
              found = true;
            }

          }
          break;

        default:

          break;


      }
      if (found) {

        return element;

      }
    }
  }

  export const adjustingElement = () => {
    
  }

  export const updateElement = (id,x1,y1,x2,y2,type) => {

    const elements = store.getState().elements.value;
    const updatedElement = addElement(id, x1, y1,x2,y2 , type);
   
    const tempNewArray = [...elements];

    tempNewArray[id] = updatedElement;
  
    store.dispatch(setElement(tempNewArray));
    
    
    
    
    
  } 


  export const adjustElementCoordinates = element => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };