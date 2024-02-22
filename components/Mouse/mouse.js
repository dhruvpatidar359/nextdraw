import store from "@/app/store";
import { setHover } from "../Redux/features/hoverSlice";
import { getCurrentResizingNode } from "../Resize/resize";
import { setResizingDirection } from "../Redux/features/resizeSlice";



export const mouseCursorChange = (event, elements, selectedElement, scale) => {


  for (var i = elements.length - 1; i >= 0; i--) {

    const element = elements[i];
    if (element === null) {
      continue;
    }
    const { x1, y1, x2, y2, type } = element;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    let elementFound = false;
    let resizerFound = null;

    // using this so that if there is selected element then only for
    // that we will be seeing the handlers not for others 
    let selectedElementCase = false;


    if (selectedElement != null && selectedElement.type != 'line') {
      const selectedElementFromElements = elements[parseInt(selectedElement.id.split("#")[1])];
      if(selectedElementFromElements != null) {
        const { x1, y1, x2, y2 } = selectedElementFromElements;

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
  
        if (event.clientX > minX - 15 && event.clientX < maxX + 15 && event.clientY > minY - 15 && event.clientY < maxY + 15) {
  
          const onResizeNode = getCurrentResizingNode(event, elements[parseInt(selectedElement.id.split("#")[1])], scale);
          if (onResizeNode[0] === 1) {
  
            resizerFound = onResizeNode;
            selectedElementCase = true;
  
          }
          elementFound = true;
  
        }
      }
     


    }



    if (!elementFound) {
      switch (type) {

        case "ellipse":
        case "diamond":
        case "text":
        case "rectangle":

          if (event.clientX > minX - 15 && event.clientX < maxX + 15 && event.clientY > minY - 15 && event.clientY < maxY + 15) {

            const onResizeNode = getCurrentResizingNode(event, element, scale);
            if (onResizeNode[0] === 1) {

              resizerFound = onResizeNode;

            }
            elementFound = true;

          }

          break;
        case "line":

          const betweenPoint = onLine(x1, y1, x2, y2, event, 5);
          const onResizeNode = getCurrentResizingNode(event, element, scale);

          if (onResizeNode[0] === 1) {

            resizerFound = onResizeNode;

          }

          if (betweenPoint) {
            elementFound = true;
          }


          break;

        case "pencil":

          // console.log(element.points);
          const betweenAnyPoint = element.points.some((point, index) => {

            const nextPoint = element.points[index + 1];

            if (nextPoint === undefined) {
              return;
            }
            return onLine(point.x, point.y, nextPoint.x, nextPoint.y, event, 8) != false;

          });


          if (betweenAnyPoint) {
            elementFound = true;
          }

          const resizeNode = getCurrentResizingNode(event, element, scale);
          if (resizeNode[0] === 1) {

            resizerFound = resizeNode;

          }


          break;

        default:

          break;

      }
    }

    // console.log(elementFound);

    if (resizerFound != null &&
      elementFound === true &&
      store.getState().selectedElement.value != null &&
      (selectedElementCase === true || type === 'line')

    ) {

      // keeping the action as it is so that mouse cursor remains same all the time
      // same applies for other

      if (store.getState().action.value === 'none') {
        document.body.style.cursor = resizerFound[1];
      }


      store.dispatch(setHover("resize"));
      if (store.getState().resizeDirection.value === null &&
        store.getState().selectedElement.value != null &&
        store.getState().action.value != 'none' &&
        (selectedElementCase === true || type === 'line')
      ) {
        store.dispatch(setResizingDirection(resizerFound[2]));
      }

      break;
    }



    if (elementFound) {
      if (store.getState().action.value === 'none') {
        document.body.style.cursor = 'move';
      }

      store.dispatch(setHover("present"));

      break;

    } else {

      store.dispatch(setHover("none"));
      if (store.getState().action.value === 'none') {
        document.body.style.cursor = `url('defaultCursor.svg'), auto`;
      }
    }

  }


}


export const onLine = (x1, y1, x2, y2, event, distance = 5) => {
  const total_length = Math.sqrt((Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
  const initial = Math.sqrt((Math.pow(y1 - event.clientY, 2) + Math.pow(x1 - event.clientX, 2)));
  const final = Math.sqrt((Math.pow(y2 - event.clientY, 2) + Math.pow(x2 - event.clientX, 2)));

  const diff = Math.abs(total_length - (initial + final));

  if (diff < distance) {
    return true;
  }

  return false;

}