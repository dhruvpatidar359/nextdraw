// this file consist of the surrounding bounds around the shapes 
// for proper manipulation

export const drawBounds = (Canvas2DContext,element,selectedElement) => {

    const {x1,y1,x2,y2,id,type,isSelected} = element;
    let  minX = Math.min(x1,x2);
    let  maxX = Math.max(x1,x2);
    let  minY = Math.min(y1,y2);
    let  maxY = Math.max(y1,y2);
    if(type != 'line' && isSelected === true) {
        if(selectedElement != null && selectedElement.id === id ) {
        
          Canvas2DContext.strokeStyle = "black";
          Canvas2DContext.strokeRect(minX-8,minY-8,maxX-minX + 16,maxY-minY + 16);
          Canvas2DContext.fillStyle = 'black';
          Canvas2DContext.beginPath();
          Canvas2DContext.roundRect(minX-12,minY-12, 10, 10, 3);
          Canvas2DContext.roundRect(maxX + 2,maxY + 2, 10, 10, 3);
          Canvas2DContext.roundRect(maxX + 2,minY - 12, 10, 10, 3);
          Canvas2DContext.roundRect(minX - 12,maxY + 2, 10, 10, 3);
          Canvas2DContext.roundRect(minX -12 ,minY-12 + (maxY + 2-(minY-12)) / 2,10,10,3);
          Canvas2DContext.roundRect(maxX + 2,minY-12 + (maxY + 2-(minY-12)) / 2,10,10,3);
          Canvas2DContext.roundRect(minX -4 + (maxX - minX) / 2,minY - 12,10,10,3);
          Canvas2DContext.roundRect(minX -4 + (maxX - minX) / 2,maxY + 2,10,10,3);
          Canvas2DContext.fill();
          Canvas2DContext.stroke();
        }
       
      } else if (type === 'line' && isSelected === true) {
        Canvas2DContext.strokeStyle = 'black';
        Canvas2DContext.fillStyle = 'black';
      
        // Set the dimensions of the rounded rectangle
        const rectWidth = 10;
        const rectHeight = 10;
        const cornerRadius = 5;
      
        // Draw the first rounded rectangle centered around (x1, y1)
        Canvas2DContext.beginPath();
        Canvas2DContext.roundRect(x1 - rectWidth / 2, y1 - rectHeight / 2, rectWidth, rectHeight, cornerRadius);
        Canvas2DContext.fill();
        Canvas2DContext.stroke();
      
        // Draw the second rounded rectangle centered around (x2, y2)
        Canvas2DContext.beginPath();
        Canvas2DContext.roundRect(x2 - rectWidth / 2, y2 - rectHeight / 2, rectWidth, rectHeight, cornerRadius);
        Canvas2DContext.fill();
        Canvas2DContext.stroke();
      }
      
}

