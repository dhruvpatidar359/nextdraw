
'use client';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import {resizeElement} from './Resize/resize';
import { addElement, getElementBelow, getElementObject } from './ElementManipulation/Element';
import { mouseCorsourChange } from './Mouse/mouse';
import { move } from './Move/move';
import { draw } from './Drawing/Drawing';
import { useDispatch, useSelector } from 'react-redux';
import { setElement } from './Redux/features/elementSlice';
import {setCanvas} from './Redux/features/canvasSlice'
import { setAction } from './Redux/features/actionSlice';
import { setSelectedElement } from './Redux/features/selectedElementSlice';


const Canvas = () => {

  // selectors 
  const tool = useSelector(state => state.tool.value);
  const elements = useSelector(state => state.elements.value);
  const roughCanvasRef = useSelector(state => state.canvas.value);
  const hover = useSelector(state => state.hover.value);
  const action = useSelector(state => state.action.value);
  const selectedElement = useSelector(state => state.selectedElement.value);

  // dispatcher
  const dispatch = useDispatch();
  


  
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
 
    canvas.style.height = `${scalingRect.height}px`;

    dispatch(setCanvas(rough.canvas(canvas)));
    

  }, []);


  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach(({ x1,y1,x2,y2,type }) => {
      roughCanvasRef.draw(getElementObject(x1,y1,x2,y2,type));
    });
  }, [elements]);



  const handleMouseDown = (event) => {

    if (tool === "selection") {
     
     
        const ele = getElementBelow(event);
        if(ele != null) {
          const offSetX = event.clientX - ele.x1;
          const offSetY = event.clientY - ele.y1;
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY }));
          
        }
       
        
      if (hover === 'present') {

        dispatch(setAction("moving"));

      } else if (hover === 'resize') {

        dispatch(setAction("resizing"));
      }

    } else {

      dispatch(setAction("drawing"));
      const newElement = addElement(elements.length, event.clientX, event.clientY, event.clientX, event.clientY, tool);
      dispatch(setElement([...elements, newElement]));
     


    }

  };

  const handleMouseUp = (event) => {
    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
  }

 


  



  const handleMouseMove = (event) => {
    if (tool === 'selection') {
      mouseCorsourChange(event,elements,setResizingDirection);

      if (action === 'moving') {

        move(event);

      } else if (action === 'resizing') {

    
        const updatedElement = resizeElement(event);
        const {id} = updatedElement;
        const tempNewArray = [...elements];
        tempNewArray[id] = updatedElement;
        dispatch(setElement(tempNewArray));
        
      }

    } else {
      if (action === 'drawing') {

        draw(event);

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