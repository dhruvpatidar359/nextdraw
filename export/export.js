import store from "@/app/store";
import { getElementObject } from "@/components/ElementManipulation/Element";
import rough from 'roughjs/bundled/rough.esm';



export const exportImage = (backgroundExport, toast) => {

    return new Promise((resolve, reject) => {


        const index = store.getState().elements.index;
        const elements = store.getState().elements.value[index];
        const canvasBackground = store.getState().canvas.background;

        if (elements.length == 0) {
            toast({
                title: "Uh oh! Canvas is Empty.",
                description: "You hav't drawn anything YET",
                duration: 3000
            });

            return;
        }

        let newCanvas = document.createElement("canvas");
        let ctx = newCanvas.getContext('2d');

        let x1 = elements[0].x1,
            x2 = elements[0].x2,
            y1 = elements[0].y1,
            y2 = elements[0].y2;

        elements.forEach(element => {
            x1 = Math.min(x1, element.x1, element.x2);
            x2 = Math.max(x2, element.x2, element.x1);
            y1 = Math.min(y1, element.y1, element.y2);
            y2 = Math.max(y2, element.y2, element.y1);
        });



        let width = x2 - x1 + 20;
        let height = y2 - y1 + 20;

        const dpr = window.devicePixelRatio;
        newCanvas.width = width * dpr;
        newCanvas.height = height * dpr;

        ctx?.scale(dpr, dpr);



        ctx.globalCompositeOperation = 'destination-under'

        // ctx.fillStyle = canvasBackground;


        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        let gradientColorsList = [];

        for (let i = 0; i < canvasBackground.length; i++) {
            if (canvasBackground[i] === "#") {
                gradientColorsList.push(canvasBackground.substring(i, i + 7));

            }
        }
        let stop = 0;
        let setBackground = true;
        const incremnet = 1 / gradientColorsList.length;
        gradientColorsList.forEach(value => {
            if (value.length != 7) {
                setBackground = false;
                return;
            }
            gradient.addColorStop(stop, value);
            stop += incremnet;
        })

        // Set the fill style and draw a rectangle
        if (setBackground) {
            ctx.fillStyle = gradient;


            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (backgroundExport) {
            ctx.fillRect(0, 0, width, height);
        }


        let rC = rough.canvas(newCanvas);

        x1 = -x1 + 10;
        y1 = -y1 + 10;

        elements.forEach(element => {

            switch (element.type) {
                case "rectangle":
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
        createEl.download = "Art";

        // Click the download button, causing a download, and then remove it
        createEl.click();
        createEl.remove();
        resolve();
    }

    )
}



