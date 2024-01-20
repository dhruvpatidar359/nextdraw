import { useDispatch, useSelector } from "react-redux";
import { setElement } from "../Redux/features/elementSlice";
import store from "@/app/store";



export function addElement(id, x1, y1, x2, y2, type,isSelected) {
  
    switch (type) {
      case 'rect':
       
        return { id, x1, x2, y1, y2, type ,isSelected};


      case 'line':
      
        return { id, x1, x2, y1, y2, type ,isSelected};

      default:
      
        return { id, x1, x2, y1, y2, type ,isSelected};

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

        
            const total_length = Math.sqrt((Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
            const initial = Math.sqrt((Math.pow(y1 - event.clientY, 2) + Math.pow(x1 - event.clientX, 2)));
            const final = Math.sqrt((Math.pow(y2 - event.clientY, 2) + Math.pow(x2 - event.clientX, 2)));

            const diff = Math.abs(total_length - (initial + final));

            // console.log("here i am ");
            // console.log(diff);
            // console.log(element.id);
            if (diff < 5) {
              found = true;
              // console.log(element.id);
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

  
  // updates the old element with new one having new props or any change
  export const updateElement = (id,x1,y1,x2,y2,type,isSelected) => {

    const elements = store.getState().elements.value;
    const updatedElement = addElement(id, x1, y1,x2,y2 , type,isSelected);
   
    const tempNewArray = [...elements];

    tempNewArray[id] = updatedElement;
   
    
    store.dispatch(setElement(tempNewArray));
    
    
    
    
    
  } 


  export const adjustElementCoordinates = element => {
    const {id, type, x1, y1, x2, y2 } = element;
    if (type === "rect") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return {id, x1: minX, y1: minY, x2: maxX, y2: maxY ,type};
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return false;
      } else {
        return {id, x1: x2, y1: y2, x2: x1, y2: y1 ,type};
      }
    }
  };