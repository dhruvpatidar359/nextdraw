import store from "@/app/store";
import {  updateElement } from "../ElementManipulation/Element";

export const move = (event) => {
    const selectedElement = store.getState().selectedElement.value;
    console.log(selectedElement);
    const { id, x1, x2, y1, y2, type, offSetX, offSetY } = selectedElement;

        const width = x2 - x1;
        const height = y2 - y1;

        updateElement(id, event.clientX - offSetX, event.clientY - offSetY, event.clientX - offSetX + width, event.clientY - offSetY + height, type);
       

}