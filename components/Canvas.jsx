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
  


  
  const [resizingNode, setResizingNode] = useState(null);
  const [resizeDirection,setResizingDirection] = useState(null);

  


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

    elements.forEach((element,index) => {
      // console.log(element);
      // console.log(ShapeCache.cache);
      if(ShapeCache.cache.has(element)) {

        console.log("getting from the cachce" + index);
        roughCanvasRef.draw(ShapeCache.cache.get(element));
        
      } else {
        const { x1,y1,x2,y2,type } = element;
        roughCanvasRef.draw(getElementObject(x1,y1,x2,y2,type));
      }
    // console.log(ShapeCache.cache);
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
    console.log(selectedElement);
    console.log(ShapeCache.cache);
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
            console.log("ker deya delete🔥");
          }

          const newElement = elements[selectedElement.id];
          const {x1,x2,y1,y2,type} = newElement;
          const shape = getElementObject(x1,y1,x2,y2,type);
          ShapeCache.cache.set(newElement,shape);

      
          
          
        } else if(action === 'resizing') {

            if(ShapeCache.cache.has(oldElement)) {
              ShapeCache.cache.delete(oldElement);
              console.log("🔥Ker deya delete resize se");
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
          console.log(ShapeCache.cache);
          


        }
    }

    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
    dispatch(setNotModifiedValue(null));
  
  }



  const handleMouseMove = (event) => {
    if (tool === 'selection') {
      mouseCorsourChange(event,elements,setResizingDirection);

      if (action === 'moving') {
       
        move(event);

      } else if (action === 'resizing') {
        console.log(selectedElement);
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