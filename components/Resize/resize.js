import { distance } from "@/utils/common";
import { addElement } from "../ElementManipulation/Element";
import store from "@/app/store";


export const resizeElement = (event) => {
  
const selectedElement = store.getState().selectedElement.value;
const resizeDirection = store.getState().resizeDirection.value;

    const cx = event.clientX;
    const cy = event.clientY;
   
    const { id, x1, x2, y1, y2, type} = selectedElement;
if(type === 'rect') {
  switch(resizeDirection) {
     
    case 4:

     return  {id : id, 
      x1: x1,
      y1 : y1, 
      x2 :  cx, 
      y2 : y2,
      type: type};

    case 1:
      return {id : id ,x1 : cx,y1 : cy,x2 : x2,y2 : y2,type : type};
      
    case 2:
      return {id:id, x1:x1,y1:cy,x2:x2,y2:y2,type:type};
    
    case 3:
      return {id : id ,x1 : x1 ,y1 :cy,x2 : cx,y2 : y2,type : type};
    
    case 5:
      return {id : id ,x1 : x1,y1 : y1,x2 : cx,y2 : cy,type : type};

    case 6:
      return {id:id, x1:x1,y1:y1,x2:x2,y2:cy,type:type};

    case 7:
      return {id : id ,x1 : cx,y1 : y1,x2 : x2,y2 : cy,type : type};
    
    case 8:

return  {id : id, 
      x1: cx,
      y1 : y1, 
      x2 :  x2, 
      y2 : y2,
      type: type};
 
    default:
      break;  
  }
} else if(type === 'line') {
  switch(resizeDirection){
    case 1:
      return {id:id,x1:cx,y1:cy,x2:x2,y2:y2,type:type};
      

    case 2:
      return {id:id,x1:x1,y1:y1,x2:cx,y2:cy,type:type};
      
    default:
      break;  
  }
}
   
  }


 // gives the current resizing node on which the mouse is lying
  export const getCurrentResizingNode = (event,element) => {
    const cx = event.clientX;
    const cy = event.clientY;

    if (element != null) {
      const { x1, x2, y1, y2 ,type} = element;

  if(type === 'rect') {
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
  } else if(type === 'line') {

    if(distance(x1,y1,cx,cy) < 10) {
      console.log("upper point of line");
      return [1,'se-resize',1];
    } else if(distance(x2,y2,cx,cy) < 10) {
      console.log("lower point of the line");
      return [1,'se-resize',2];
    }
  }
     
      return [0];
    }
  }


