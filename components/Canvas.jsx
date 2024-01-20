'use client';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import {resizeElement} from './Resize/resize';
import { addElement, adjustElementCoordinates, getElementBelow, getElementObject, updateElement } from './ElementManipulation/Element';
import { mouseCorsourChange } from './Mouse/mouse';
import { move } from './Move/move';
import { draw } from './Drawing/Drawing';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setElement } from './Redux/features/elementSlice';
import {setCanvas} from './Redux/features/canvasSlice'
import { setAction } from './Redux/features/actionSlice';
import {  setNotModifiedValue, setSelectedElement } from './Redux/features/selectedElementSlice';
import { ShapeCache } from './Redux/ShapeCache';
import { setOldElement } from './Redux/features/oldSelectedElementSlice';
import store from '@/app/store';
import { setResizingDirection } from './Redux/features/resizeSlice';




const Canvas = () => {


  // selectors 
  const tool = useSelector(state => state.tool.value);
  const elements = useSelector(state => state.elements.value,shallowEqual);
  const roughCanvasRef = useSelector(state => state.canvas.value);
  const hover = useSelector(state => state.hover.value);
  const action = useSelector(state => state.action.value);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const oldElement  = useSelector(state => state.oldElement.value);
  
 
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);


  // dispatcher
  const dispatch = useDispatch();
  
  
  


  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    }
  }, [height]);


  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
    
      const {x1,y1,x2,y2,id,type} = element;

      if(ShapeCache.cache.has(element)) {

        roughCanvasRef.draw(ShapeCache.cache.get(element));
      } else {
        const { x1,y1,x2,y2,type } = element;
        roughCanvasRef.draw(getElementObject(x1,y1,x2,y2,type));
      }
      
      if(type != 'line') {
        if(selectedElement != null && selectedElement.id === id ) {
        let  minX = Math.min(x1,x2);
        let  maxX = Math.max(x1,x2);
         let  minY = Math.min(y1,y2);
         let  maxY = Math.max(y1,y2);
      
          ctx.strokeStyle = "black";
          ctx.strokeRect(minX-8,minY-8,maxX-minX + 16,maxY-minY + 16);
          ctx.fillStyle = 'black';
          ctx.beginPath();
          ctx.roundRect(minX-12,minY-12, 10, 10, 3);
          ctx.roundRect(maxX + 2,maxY + 2, 10, 10, 3);
          ctx.roundRect(maxX + 2,minY - 12, 10, 10, 3);
          ctx.roundRect(minX - 12,maxY + 2, 10, 10, 3);
          
       
          ctx.fill();
          ctx.stroke();
        }
       
      }

   
   
    });
  }, [elements]);



  const handleMouseDown = (event) => {

    if (tool === "selection") {
     
     
        const ele = getElementBelow(event);
        if(ele != null) {
          const offSetX = event.clientX - ele.x1;
          const offSetY = event.clientY - ele.y1;
          dispatch(setNotModifiedValue(ele));
          dispatch(setOldElement(ele));
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY }));
        
        console.log(ele.id);
          
         
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
      dispatch(setNotModifiedValue(newElement));
      dispatch(setSelectedElement(newElement));
     
    }

  };

  const handleMouseUp = (event) => {
    
    if (action === "drawing") {



    
    // adjusting the coordinates in-case
      const element = elements[elements.length - 1];  
      const adjustedElement = adjustElementCoordinates(element)

      if(adjustedElement != false) {
        const {id,x1,x2,y1,y2,type} = adjustedElement;
        updateElement(id,x1,y1,x2,y2,type);
      }
      
      const currentStateElement = store.getState().elements.value;
        
      const key =  currentStateElement[currentStateElement.length - 1];
     
      const  { x1,y1,x2,y2,type } = key ;
      const shape = getElementObject(x1,y1,x2,y2,type);

 
     ShapeCache.cache.set(key,shape);
    } else if(tool === 'selection') {
        if(action === 'moving') {
       

          if(ShapeCache.cache.has(oldElement)){
            ShapeCache.cache.delete(oldElement);
            // console.log("ker deya delete move🔥");
          }

          const newElement = elements[selectedElement.id];
          const {x1,x2,y1,y2,type} = newElement;
          const shape = getElementObject(x1,y1,x2,y2,type);
          ShapeCache.cache.set(newElement,shape);

      
          
          
        } else if(action === 'resizing') {

            if(ShapeCache.cache.has(oldElement)) {
              ShapeCache.cache.delete(oldElement);
              // console.log("🔥Ker deya delete resize se");
            }

          const element = elements[selectedElement.id];
          const adjustedElement = adjustElementCoordinates(element);

          if(adjustedElement != false) {
            const {id,x1,x2,y1,y2,type} = adjustedElement;
            updateElement(id,x1,y1,x2,y2,type);
           
          }

          const currentStateElement = store.getState().elements.value;
        
          const key =  currentStateElement[currentStateElement.length - 1];
         
          const  { x1,y1,x2,y2,type } = key ;
          const shape = getElementObject(x1,y1,x2,y2,type);
          ShapeCache.cache.set(key,shape);
          // console.log(ShapeCache.cache);
          


        }
    }

    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
    dispatch(setNotModifiedValue(null));
    dispatch(setResizingDirection(null));
  
  }



  const handleMouseMove = (event) => {
  
    if (tool === 'selection') {
      mouseCorsourChange(event,elements);

      if (action === 'moving') {
       
        move(event);

      } else if (action === 'resizing') {
      // console.log(selectedElement);
        const {id,x1,y1,x2,y2,type} = resizeElement(event);
        updateElement(id,x1,y1,x2,y2,type);
    

      }

    } else {
      if (action === 'drawing') {

        draw(event);

      }
    }

  }

  useEffect(() => {
    document.body.style.cursor = `url('defaultCursor.svg'), auto`;
  }, [])
  

  useEffect(() => {
    setHeight(() => window.innerHeight)
    setWidth(() => window.innerWidth)
  }, [ height, width])

  return (

    <canvas
      id='canvas'

      height={height}
      width={width}
      style={{height: height, width: width}}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    ></canvas>

  )
}
export default Canvas