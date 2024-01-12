import { distance } from "@/utils/common";
import { addElement } from "../ElementManipulation/Element";


export const resizeElement = (event,selectedElement,resizeDirection,roughCanvasRef) => {

    const cx = event.clientX;
    const cy = event.clientY;
    const { id, x1, x2, y1, y2, type} = selectedElement;

    switch(resizeDirection) {
     
      case 4:

       return  addElement(id, 
         x1,
         y1, 
         cx, 
         y2,
         type,roughCanvasRef);
   
      default:
        break;  
    }
  }


 
  export const getCurrentResizingNode = (event,element) => {
    const cx = event.clientX;
    const cy = event.clientY;

    if (element != null) {
      const { x1, x2, y1, y2 } = element;

  
      if (distance(x1, y1, cx, cy) < 10) {
        // top left
        
        console.log("top left");
        return [1,"se-resize",1];

      } else if (distance(x2, y1, cx, cy) < 10) {
        // top right
        console.log("top right");
        return [1,"sw-resize",3];

      } else if (distance(x1, y2, cx, cy) < 10) {
        // bottom left
        console.log("bottom left"); 
        return [1,"ne-resize",7];

      } else if (distance(x2, y2, cx, cy) < 10) {
        // bottom right
        console.log("bottom right"); 
        return [1,"nw-resize",5];

      } else if (distance(x1, y1 + (y2 - y1) / 2, cx, cy) < 10) {
        // left mid
        console.log("left mid"); 
        return [1,"ew-resize",8];
      } else if (distance(x2,y1 +  (y2 - y1) / 2, cx, cy) < 10) {
        // right mid
        console.log("right mid"); 
        return [1,"ew-resize",4];
      } else if (distance(x1 + (x2 - x1) / 2, y1, cx, cy) < 10) {
        // top mid
        console.log("top mid");
        return [1,"n-resize",2];
      } else if (distance(x1 + (x2 - x1) / 2, y2, cx, cy) < 10) {
        // bottom mid
        console.log("bottom mid"); 
        return [1,"s-resize",6];
      }
      return [0];
    }
  }


