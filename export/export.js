import store from "@/app/store";
import { getElementObject } from "@/components/ElementManipulation/Element";
import rough from 'roughjs/bundled/rough.esm';



export const exportImage = () => {


    const index = store.getState().elements.index;
    const elements = store.getState().elements.value[index];

    let newCanvas = document.createElement("canvas");
    let ctx = newCanvas.getContext('2d');

    let x1 = elements[0].x1,
        x2 = elements[0].x2,
        y1 = elements[0].y1,
        y2 = elements[0].y2;

    elements.forEach(element => {
        x1 = Math.min(x1, element.x1);
        x2 = Math.max(x2, element.x2);
        y1 = Math.min(y1, element.y1);
        y2 = Math.max(y2, element.y2);
    });

    let width = x2 - x1 + 20;
    let height = y2 - y1 + 20;

    const dpr = window.devicePixelRatio;
    newCanvas.width = width * dpr;
    newCanvas.height = height * dpr;

    ctx?.scale(dpr, dpr);


    ctx.fillStyle = "#FFF";
    // ctx.fillRect(0, 0, width, height);

    let rC = rough.canvas(newCanvas);

    x1 = -x1 + 10;
    y1 = -y1 + 10;

    elements.forEach(element => {

        switch (element.type) {
            case "rect":
            case "line":
            case "diamond":
            case "ellipse":

                const drawElement = { ...element, x1: element.x1 + x1, y1: element.y1 + y1, x2: x1 + element.x2, y2: y1 + element.y2 };
                rC.draw(getElementObject(drawElement));
                break;
            case "pencil":

                let elementCopy = { ...element };
                let points = [];

                element.points.forEach((value) => {
                    points.push({ x: value.x + x1, y: value.y + y1 })
                })

                elementCopy.points = points;
                ctx.fillStyle = "red"
                ctx.fill(getElementObject(elementCopy));

                break;

            case "text":
                ctx.textBaseline = "top";
                ctx.font = "24px Virgil";

                var txt = element.text;

                var lineheight = 30;
                var lines = txt.split('\n');
                ctx.fillStyle = 'black';
                for (var i = 0; i < lines.length; i++)
                    ctx.fillText(lines[i], element.x1 + x1, element.y1 + y1 + 6 + (i * lineheight));

                break;
        }



    })



    let canvasUrl = newCanvas.toDataURL("image/png");

    // Create an anchor, and set the href value to our data URL
    const createEl = document.createElement('a');
    createEl.href = canvasUrl;

    // This is the name of our downloaded file
    createEl.download = "download-this-canvas";

    // Click the download button, causing a download, and then remove it
    createEl.click();
    createEl.remove();
}


