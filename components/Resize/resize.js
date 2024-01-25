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
} else if(type === 'pen') {

  switch(resizeDirection) {
     
    case 4:

    const newPoints = [];

    selectedElement.points.forEach((_,index) => {
        
        newPoints.push({x : event.clientX - selectedElement.offSetX[index]
        
        ,y : event.clientY - selectedElement.offSetY[index]
        })
    });




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


}
   
  }


 // gives the current resizing node on which the mouse is lying
  export const getCurrentResizingNode = (event,element) => {
    const cx = event.clientX;
    const cy = event.clientY;

    let threshold  = 5;

    if (element != null) {
      let { x1, x2, y1, y2 ,type} = element;
      
      x1 -= threshold;
      y1 -= threshold;
      x2 += threshold;
      y2 += threshold;


  if(type === 'rect') {
    if (distance(x1, y1, cx, cy) < 12) {
      // top left
      
      console.log("top left");
      return [1,"se-resize",1];

    } else if (distance(x2, y1, cx, cy) < 12) {
      // top right
      console.log("top right");
      return [1,"sw-resize",3];

    } else if (distance(x1, y2, cx, cy) < 12) {
      // bottom left
      console.log("bottom left"); 
      return [1,"ne-resize",7];

    } else if (distance(x2, y2, cx, cy) < 12) {
      // bottom right
      console.log("bottom right"); 
      return [1,"nw-resize",5];

    } else if (distance(x1, y1 + (y2 - y1) / 2, cx, cy) < 12) {
      // left mid
      console.log("left mid"); 
      return [1,"ew-resize",8];
    } else if (distance(x2,y1 +  (y2 - y1) / 2, cx, cy) < 12) {
      // right mid
      console.log("right mid"); 
      return [1,"ew-resize",4];
    } else if (distance(x1 + (x2 - x1) / 2, y1, cx, cy) < 12) {
      // top mid
      console.log("top mid");
      return [1,"n-resize",2];
    } else if (distance(x1 + (x2 - x1) / 2, y2, cx, cy) < 12) {
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
  } else if(type === 'pencil') {

    let minX = element.x1;
    let minY = element.y1;
    let maxX = element.x2;
    let maxY = element.y2;

  if (event.clientX > minX - 10 && event.clientX < maxX + 10 && event.clientY > minY - 10 && event.clientY < maxY + 10) {
    if (distance(minX, minY, cx, cy) < 12) {
      // top left
      
      console.log("top left");
      return [1,"se-resize",1];
  
    } else if (distance(maxX, minY, cx, cy) < 12) {
      // top right
      console.log("top right");
      return [1,"sw-resize",3];
  
    } else if (distance(minX, maxY, cx, cy) < 12) {
      // bottom left
      console.log("bottom left"); 
      return [1,"ne-resize",7];
  
    } else if (distance(maxX, maxY, cx, cy) < 12) {
      // bottom right
      console.log("bottom right"); 
      return [1,"nw-resize",5];
  
    } else if (distance(minX, minY + (maxY - minY) / 2, cx, cy) < 12) {
      // left mid
      console.log("left mid"); 
      return [1,"ew-resize",8];
    } else if (distance(maxX,minY +  (maxY - minY) / 2, cx, cy) < 12) {
      // right mid
      console.log("right mid"); 
      return [1,"ew-resize",4];
    } else if (distance(minX + (maxX - minX) / 2, minY, cx, cy) < 12) {
      // top mid
      console.log("top mid");
      return [1,"n-resize",2];
    } else if (distance(minX + (maxX - minX) / 2, maxY, cx, cy) < 12) {
      // bottom mid
      console.log("bottom mid"); 
      return [1,"s-resize",6];
    }
  }
} 
     
      return [0];
    }
  }


