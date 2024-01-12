import { getCurrentResizingNode } from "../Resize/resize";

export const mouseCorsourChange = (event,elements,setHover,setResizingDirection) => {
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

            
          console.log(document.body.style.cursor);
          const onResizeNode = getCurrentResizingNode(event,element);
            if(onResizeNode[0] === 1 ) {
              console.log("working");
              resizerFound = onResizeNode;
              
            }
           
              elementFound = true;
            
           
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
              elementFound = true;
            }

          }
          break;

        default:

          break;

      }


      if(resizerFound != null) {
        
        document.body.style.cursor = resizerFound[1];
        setHover('resize');
        setResizingDirection(resizerFound[2]);

        break;
      }

      if (elementFound) {

        document.body.style.cursor = 'move';
        setHover("present");
        break;

      } else {
        setHover("none");
        document.body.style.cursor = 'default';
      }

    }

  }