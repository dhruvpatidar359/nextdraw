
'use client';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import {resizeElement} from './Resize/resize';
import { addElement } from './ElementManipulation/Element';
import { mouseCorsourChange } from './Mouse/mouse';


const Canvas = ({ type: tool }) => {


  const roughCanvasRef = useRef(null);
  const [action, setAction] = useState("none");
  const [hover, setHover] = useState("none");
  const [elements, setelements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [resizingNode, setResizingNode] = useState(null);
  const [resizeDirection,setResizingDirection] = useState(null);


  useEffect(() => {

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio;
    const scalingRect = canvas.getBoundingClientRect();

    canvas.width = scalingRect.width * dpr;
    canvas.height = scalingRect.height * dpr;

    ctx?.scale(dpr, dpr);

    canvas.style.width = `${scalingRect.width}px`;
    console.log(scalingRect.width);
    canvas.style.height = `${scalingRect.height}px`;

    roughCanvasRef.current = rough.canvas(canvas);





  }, []);



  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(({ ele }) => {
      roughCanvasRef.current.draw(ele);
    });
  }, [elements]);







   

 


  const handleMouseDown = (event) => {

    if (tool === "selection") {
      // console.log(hover);
     
        const ele = getElementBelow(event);
        if(ele != null) {
          const offSetX = event.clientX - ele.x1;
          const offSetY = event.clientY - ele.y1;
          setSelectedElement({ ...ele, offSetX, offSetY });
        }
       
        
      if (hover === 'present') {

        setAction("moving");

      } else if (hover === 'resize') {
        setAction("resizing");
      }

    } else {

      setAction('drawing');
      const newElement = addElement(elements.length, event.clientX, event.clientY, event.clientX, event.clientY, tool,roughCanvasRef);
      setelements((prevElements) => [...prevElements, newElement]);


    }

  };

  const handleMouseUp = (event) => {
    setAction("none");
    setSelectedElement(null);
  }

  const getElementBelow = (event) => {
    for (var i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      const { x1, y1, x2, y2, type } = element;

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      let found = false;


      switch (type) {
        case "rect":

          if (event.clientX > minX - 10 && event.clientX < maxX + 10 && event.clientY > minY - 10 && event.clientY < maxY + 10) {
            found = true;
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
              found = true;
            }

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


  



  const handleMouseMove = (event) => {
    if (tool === 'selection') {
      mouseCorsourChange(event,elements,setHover,setResizingDirection);

      if (action === 'moving') {

        const { id, x1, x2, y1, y2, type, offSetX, offSetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const updatedElement = addElement(id, event.clientX - offSetX, event.clientY - offSetY, event.clientX - offSetX + width, event.clientY - offSetY + height, type,roughCanvasRef);

        const tempNewArray = [...elements];
        tempNewArray[id] = updatedElement;
        setelements(tempNewArray);
      } else if (action === 'resizing') {

    
        const updatedElement = resizeElement(event,selectedElement,resizeDirection,roughCanvasRef);
        const {id} = updatedElement;
        const tempNewArray = [...elements];
        tempNewArray[id] = updatedElement;
        setelements(tempNewArray);
      }

    } else {
      if (action === 'drawing') {
        const index = elements.length - 1;
        const tempNewArray = [...elements];
        const { x1, y1, type } = elements[index];

        const updatedElement = addElement(index, x1, y1, event.clientX, event.clientY, type,roughCanvasRef);
        tempNewArray[index] = updatedElement;
        setelements(tempNewArray);
      }
    }

  }


  return (

    <canvas
      id='canvas'
      height={window.innerHeight}
      width={window.innerWidth}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    ></canvas>

  )
}
export default Canvas