import { useDispatch, useSelector } from "react-redux";
import { setElement } from "../Redux/features/elementSlice";
import store from "@/app/store";
import { setSelectedElement } from "../Redux/features/selectedElementSlice";
import getStroke from "perfect-freehand";
import { onLine } from "../Mouse/mouse";



export function addElement(id, x1, y1, x2, y2, type) {

  switch (type) {
    case 'rect':
    case "ellipse":
    case 'line':
    case 'diamond':

      return { id, x1, x2, y1, y2, type };



    case "pencil":
      return { id, type, points: [{ x: x1, y: y1 }] };

    case "text":
    
      return {id,type,x1,y1,x2  ,y2,text : ""};  

    default:

      return { id, x1, x2, y1, y2, type };

  }

}


export const getElementObject = (element) => {

  const { x1, y1, x2, y2, type, points } = element;

  const roughCanvasRef = store.getState().canvas.value;
  const root = roughCanvasRef.generator;

  let elementObject;

  switch (type) {
    case 'rect':
      elementObject = root.rectangle(x1,
        y1,
        x2 - x1,
        y2 - y1, { seed: 25, strokeWidth: 3, fillStyle: 'solid', fill: 'grey' }
      );
      break;


    case 'line':
      elementObject = root.line(x1, y1, x2, y2, { seed: 12 });
      break;

    case 'pencil':
      const outlinePoints = getStroke(element.points);
      const pathData = getSvgPathFromStroke(outlinePoints);
      const path = new Path2D(pathData);
      elementObject = path;
      break;


    case 'ellipse':
      const centerX = x1 + (x2 - x1) / 2;
      const centerY = y1 + (y2 - y1) / 2;

      elementObject = root.ellipse(centerX,
        centerY,
        x2 - x1,
        y2 - y1, { seed: 11, strokeWidth: 3, fillStyle: 'solid', fill: 'grey' }
      );
      break;


    case "diamond" :

    const top = [x1 + (x2-x1) / 2,y1];
    const left = [x1 , y1 + (y2-y1) / 2];
    const bottom = [x1 + (x2-x1) / 2,y2];
    const right = [x2 , y1 + (y2-y1) / 2];

    elementObject = root.polygon([top,left,bottom,right],{seed : 17});
        
      break;  
    default:
      elementObject = root.line(x1, y1, x2, y2, { seed: 6 });
      break;

  }
  return elementObject;

}

export const getElementBelow = (event, selectedElement) => {
  const histIndex = store.getState().elements.index;
  const elements = store.getState().elements.value[histIndex];

  for (var i = elements.length - 1; i >= 0; i--) {
    const element = elements[i];
    const { x1, y1, x2, y2, type } = element;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    let found = false;


    if (selectedElement != null && selectedElement.type != 'line') {

      const { x1, y1, x2, y2 } = elements[selectedElement.id];

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      if (event.clientX > minX - 15 && event.clientX < maxX + 15 && event.clientY > minY - 15 && event.clientY < maxY + 15) {
        return elements[selectedElement.id];
      }


    }


    switch (type) {
      case "ellipse":
      case "rect":
      case "diamond":
      case "text":

        if (event.clientX > minX - 15 && event.clientX < maxX + 15 && event.clientY > minY - 15 && event.clientY < maxY + 15) {
          found = true;
        }
        break;

      case "line":


        const total_length = Math.sqrt((Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)));
        const initial = Math.sqrt((Math.pow(y1 - event.clientY, 2) + Math.pow(x1 - event.clientX, 2)));
        const final = Math.sqrt((Math.pow(y2 - event.clientY, 2) + Math.pow(x2 - event.clientX, 2)));

        const diff = Math.abs(total_length - (initial + final));


        if (diff < 5) {
          found = true;

        }


        break;

      case "pencil":
        const betweenAnyPoint = element.points.some((point, index) => {

          const nextPoint = element.points[index + 1];

          if (nextPoint === undefined) {
            return;
          }
          return onLine(point.x, point.y, nextPoint.x, nextPoint.y, event, 5) != false;

        });

        if (betweenAnyPoint) {
          found = true;
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
export const updateElement = (id, x1, y1, x2, y2, type,options) => {

  const histIndex = store.getState().elements.index;
  const elements = store.getState().elements.value[histIndex];
  const action = store.getState().action.value;
  const tempNewArray = [...elements];

  switch (type) {
    case "line":
    case "rect":
    case "ellipse":
    case "diamond":

      const updatedElement = addElement(id, x1, y1, x2, y2, type)
      tempNewArray[id] = updatedElement;
      if (action === 'drawing') {
        store.dispatch(setSelectedElement(updatedElement));
      }
      break;

    case "pencil":

      tempNewArray[id] = {
        ...tempNewArray[id],
        points: [...tempNewArray[id].points, { x: x2, y: y2 }],
      };
      break;


      case "text":

      const textWidth =x1 +  document.getElementById("canvas").getContext('2d').measureText(options.text).width
      const textHeight =y1 +  24;
      
        tempNewArray[id] = {...addElement(id,x1,y1,textWidth,textHeight,type),text : options.text}
        break;

    default:
      break;
  }

  store.dispatch(setElement([tempNewArray, true]));





}


export const adjustElementCoordinates = element => {
  const { id, type, x1, y1, x2, y2 } = element;
  if (type === "rect" || type === 'ellipse' || type === 'diamond') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { id, x1: minX, y1: minY, x2: maxX, y2: maxY, type };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { id, x1, y1, x2, y2, type };
    } else {
      return { id, x1: x2, y1: y2, x2: x1, y2: y1, type };
    }
  }
};


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

