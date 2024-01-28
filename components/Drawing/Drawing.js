
import store from "@/app/store";
import { drawBounds } from "../ElementManipulation/Bounds";
import { getElementObject, updateElement } from "../ElementManipulation/Element";
import { ShapeCache } from "../Redux/ShapeCache";





export const draw = (event) => {
    const histIndex = store.getState().elements.index;
    const elements = store.getState().elements.value[histIndex];
    

    const index = elements.length - 1;
  
    const { x1, y1, type } = elements[index];
    updateElement(index, x1, y1, event.clientX, event.clientY, type)
   


}

// the main function that is responsilbe for rendering
export  const drawElements = (ctx,element,selectedElement) => {

    const roughCanvasRef = store.getState().canvas.value;

   

    switch(element.type) {
      case "line":
      case "rect":
      case "ellipse":
      case "diamond":
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
        
        
        case "text":
         
          ctx.textBaseline = "top";
          ctx.font="24px Virgil";
          ctx.fillText(element.text, element.x1 ,  element.y1);

          break;

       default:
        break; 
    }
  }


export const  renderer = (ctx ,elements,selectedElement) => {

  let boundedElement = null;

  elements.forEach((element) => {

    if(selectedElement != null && selectedElement.id === element.id) {
      boundedElement = element;
    }
    drawElements(ctx, element, selectedElement);

  });
  


  drawBounds(ctx,boundedElement);

  }