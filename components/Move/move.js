import store from "@/app/store";
import {  updateElement } from "../ElementManipulation/Element";
import { setElement } from "../Redux/features/elementSlice";

export const move = (event,elements) => {
    const selectedElement = store.getState().selectedElement.value;
    
   
    const { id, x1, x2, y1, y2, type, offSetX, offSetY ,rectCoordinatesOffsetX , rectCoordinatesOffsetY} = selectedElement;

    if(type === 'rect' || type === 'line') {
        const width = x2 - x1;
        const height = y2 - y1;

        updateElement(id, event.clientX - offSetX, event.clientY - offSetY, event.clientX - offSetX + width, event.clientY - offSetY + height, type);
    } else {

    
        const newPoints = [];
        selectedElement.points.forEach((_,index) => {
            
            newPoints.push({x : event.clientX - selectedElement.offSetX[index]
            
            ,y : event.clientY - selectedElement.offSetY[index]
            })
        });

      const  tempNewArray = [...elements];
      

        const width = x2 - x1;
        const height = y2 - y1;


        tempNewArray[id] = {
            ...tempNewArray[id],
            points: newPoints,x1 : event.clientX - rectCoordinatesOffsetX,y1 :  event.clientY - rectCoordinatesOffsetY,x2 :  event.clientX - rectCoordinatesOffsetX + width, y2 : event.clientY - rectCoordinatesOffsetY + height
          };
         
          store.dispatch(setElement([tempNewArray,true]));
    }

   
       

}