import store from "@/app/store";
import { setHover } from "../Redux/features/hoverSlice";
import { getCurrentResizingNode } from "../Resize/resize";
import { setResizingDirection } from "../Redux/features/resizeSlice";



export const mouseCorsourChange = (event,elements) => {
  
    for (var i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const { x1, y1, x2, y2, type } = element;

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      let elementFound = false;
      let resizerFound = null;

      switch (type) {
        case "rect":

          if (event.clientX > minX - 10 && event.clientX < maxX + 10 && event.clientY > minY - 10 && event.clientY < maxY + 10) {

            
   
          const onResizeNode = getCurrentResizingNode(event,element);
            if(onResizeNode[0] === 1 ) {
        
              resizerFound = onResizeNode;
              
            }
           
              elementFound = true;
            
           
          }

          break;
        case "line":


         



            const total_length = Math.sqrt((Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
            const initial = Math.sqrt((Math.pow(y1 - event.clientY, 2) + Math.pow(x1 - event.clientX, 2)));
            const final = Math.sqrt((Math.pow(y2 - event.clientY, 2) + Math.pow(x2 - event.clientX, 2)));

            const diff = Math.abs(total_length - (initial + final));

            
console.log(diff);
            
          const onResizeNode = getCurrentResizingNode(event,element);
       
          if(onResizeNode[0] === 1 ) {
      
            resizerFound = onResizeNode;
            
          }

            if (diff < 5) {
              elementFound = true;
              // console.log(element.id);
            }



          
          break;

        default:

          break;

      }


      if(resizerFound != null && elementFound == true) {
        
        document.body.style.cursor = resizerFound[1];
        // console.log(element);
        store.dispatch(setHover("resize"));
       if(store.getState().resizeDirection.value == null && store.getState().selectedElement.value != null) {
        store.dispatch(setResizingDirection(resizerFound[2]));
       }
    
       
        
       
       
        break;
      }

      if (elementFound) {

        document.body.style.cursor = 'move';
        store.dispatch(setHover("present"));
       
        break;

      } else {
        store.dispatch(setHover("none"));
     
        document.body.style.cursor = 'default';
      }

    }

  }