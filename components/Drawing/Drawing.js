
import store from "@/app/store";
import { drawBounds } from "../ElementManipulation/Bounds";
import { getElementObject, updateElement } from "../ElementManipulation/Element";
import { ShapeCache } from "../Redux/ShapeCache";
import { GlobalProps } from "../Redux/GlobalProps";





export const draw = (event) => {
  const histIndex = store.getState().elements.index;
  const elements = store.getState().elements.value[histIndex];


  const index = elements.length - 1;

  const { x1, y1, type } = elements[index];

  updateElement(GlobalProps.username + "#" + index, x1, y1, event.clientX, event.clientY, type)



}

// the main function that is responsilbe for rendering
export const drawElements = (ctx, element) => {

  const roughCanvasRef = store.getState().canvas.value;



  // roughCanvasRef.path('M 10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10', { fill: 'green',seed:10 });
  switch (element.type) {
    case "line":
    case "rectangle":
    case "ellipse":
    case "diamond":
      if (ShapeCache.cache.has(element)) {
        // console.log(`using cache ${element.id}`);

        roughCanvasRef.draw(ShapeCache.cache.get(element));
      } else {
       
        roughCanvasRef.draw(getElementObject(element));
      }
      break;

    case 'pencil':
      ctx.fillStyle = element.stroke;
      if (ShapeCache.cache.has(element)) {

        ctx.fill(ShapeCache.cache.get(element));
      } else {
        ctx.fill(getElementObject(element));
      }

      break;


    case "text":

      ctx.textBaseline = "top";
      ctx.font = `${element.fontSize}px Virgil`;

      var txt = element.text;

      var lineheight = element.fontSize + 6;
      var lines = txt.split('\n');
      ctx.fillStyle = element.stroke;
      for (var i = 0; i < lines.length; i++)
        ctx.fillText(lines[i], element.x1, element.y1 + 6 + (i * lineheight));
      break;

    default:
      break;
  }
}


export const renderer = (ctx, elements, selectedElement, action, scale) => {

  let boundedElement = null;

  elements.forEach((element) => {

    if (selectedElement != null && selectedElement.id === element.id) {
      boundedElement = element;
    }
    if (action === 'writing' && selectedElement != null && selectedElement.id === element.id) {
      return;
    }

    drawElements(ctx, element, selectedElement);

  });



  drawBounds(ctx, boundedElement, action, scale);

}