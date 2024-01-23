'use client';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import {resizeElement} from './Resize/resize';
import { addElement, adjustElementCoordinates, getElementBelow, getElementObject, updateElement } from './ElementManipulation/Element';
import { mouseCorsourChange } from './Mouse/mouse';
import { move } from './Move/move';
import { draw } from './Drawing/Drawing';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setElement, setIndex } from './Redux/features/elementSlice';
import {setCanvas} from './Redux/features/canvasSlice'
import { setAction } from './Redux/features/actionSlice';
import {   setSelectedElement, setSelectedElementSource } from './Redux/features/selectedElementSlice';
import { ShapeCache } from './Redux/ShapeCache';
import { setOldElement } from './Redux/features/oldSelectedElementSlice';
import store from '@/app/store';
import { setResizingDirection } from './Redux/features/resizeSlice';
import { changeTool } from './Redux/features/toolSlice';
import { setHover } from './Redux/features/hoverSlice';
import { drawBounds } from './ElementManipulation/Bounds';




const Canvas = () => {

  // console.log(ShapeCache.cache);
  // selectors 
  const tool = useSelector(state => state.tool.value);
  const index = useSelector(state => state.elements.index);
  const history = useSelector(state => state.elements.value,shallowEqual);
  const elements = useSelector(state => state.elements.value[index],shallowEqual);
  const roughCanvasRef = useSelector(state => state.canvas.value);
  const hover = useSelector(state => state.hover.value);
  const action = useSelector(state => state.action.value);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const selectedElementSource = useSelector(state => state.selectedElement.source);
  const oldElement  = useSelector(state => state.oldElement.value);
  
  // useState for local height and width of canvas
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [changed , setChanged] = useState(false);
  const [dupState , setDupState] = useState(false);


  // dispatcher
  const dispatch = useDispatch();


  
  
  useEffect(() => {
   
      if(tool === 'rect' || tool === 'line') {
        console.log("changed");
        document.body.style.cursor = 'crosshair';

        
        // console.log(selectedElement);
        if(selectedElement != null) {
          // console.log(selectedElement.type);
            // const {id,x1,y1,x2,y2,type} = elements[selectedElement.id];
            // updateElement(id,x1,y1,x2,y2,type);
            dispatch(setSelectedElement(null));
        }

       
    } else {
      // console.log("defualt");
        document.body.style.cursor = `url('defaultCursor.svg'), auto`;
        
    }
    // console.log(document.body.style.cursor);
   
  }, [tool])
  


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

    elements.forEach((element,index1) => {
    
      const {x1,y1,x2,y2,id,type} = element;

      if(ShapeCache.cache.has(element)) {
        // console.log(`using cache ${index1}`);
        roughCanvasRef.draw(ShapeCache.cache.get(element));
      } else {
       
        roughCanvasRef.draw(getElementObject(x1,y1,x2,y2,type));
      }
      // console.log("redering");
      // console.log(selectedElement);
      drawBounds(ctx,element,selectedElement);
      
  
    });
    // console.log(ShapeCache.cache);
  }, [elements,selectedElement]);



  const handleMouseDown = (event) => {
   
    if (tool === "selection") {
     

        const ele = getElementBelow(event);
        if(ele != null) {
          
          if(selectedElement != null) {
            // console.log(history);
            // if(selectedElementSource != 'drawing') {
            //   const copy = [...elements];
            //   dispatch(setIndex());
            //   dispatch(setElement([copy]));
            // }
            dispatch(setSelectedElementSource('none'));
            dispatch(setSelectedElement(null));
          }

          const {id,x1,y1,x2,y2,type} = ele;
          const offSetX = event.clientX - ele.x1;
          const offSetY = event.clientY - ele.y1;


          if(dupState === true) {
            if(changed === true) {
              dispatch(setElement([elements]));
              setChanged(false);
            } else {
              dispatch(setElement([elements,true]));
            }
          } else {
            dispatch(setElement([elements]));
            setDupState(true);
            setChanged(false);
          }
         
        
        
        
          dispatch(setOldElement(ele));
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY }));

          updateElement(id,x1,y1,x2,y2,type);
        } else {
          if(selectedElement != null) {
            // const {id,x1,y1,x2,y2,type} = elements[selectedElement.id];
            // updateElement(id,x1,y1,x2,y2,type);
            // dispatch(setElement(history[index-1]));
            // console.log(history);
            // if(selectedElementSource != 'drawing') {
            //   const copy = [...elements];
            //   dispatch(setIndex());
            //   dispatch(setElement([copy]));
            // }
            dispatch(setSelectedElementSource('none'));
            dispatch(setSelectedElement(null));
          }
      
        }
        console.log(dupState);
    console.log(changed);    
      if (hover === 'present') {

        dispatch(setAction("moving"));
     
      } else if (hover === 'resize') {
        
        dispatch(setAction("resizing"));
      }

    } else {
      // we are drawing

      
      
      dispatch(setAction("drawing"));

      const newElement = addElement(elements.length, event.clientX, event.clientY, event.clientX, event.clientY, tool);
      
      if(dupState === false) {
        dispatch(setElement([[...elements, newElement]]));
      } else {
        if(changed) {
          dispatch(setElement([[...elements, newElement]]));
        } else {
          dispatch(setElement([[...elements, newElement],true]));
          setChanged(true);
        }
       
        setDupState(false);
      }
      
      console.log(dupState);
    console.log(changed);
      dispatch(setOldElement(newElement));
      dispatch(setSelectedElement(newElement));
      dispatch(setSelectedElementSource("drawing"));
     
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
      
      const currentStateElement = store.getState().elements.value[index];
        
      const key =  currentStateElement[currentStateElement.length - 1];
     
      const  { x1,y1,x2,y2,type } = key ;
      const shape = getElementObject(x1,y1,x2,y2,type);

    //  console.log(key);
     ShapeCache.cache.set(key,shape);
     dispatch(changeTool("selection"));
    } else if(tool === 'selection') {
        if(action === 'moving') {
       
// console.log(oldElement);
// console.log(ShapeCache.cache);
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

          const currentStateElement = store.getState().elements.value[index];
        
          const key =  currentStateElement[selectedElement.id];
         
          const  { x1,y1,x2,y2,type } = key ;
          const shape = getElementObject(x1,y1,x2,y2,type);
          // console.log("adding");
          // console.log(key);
          ShapeCache.cache.set(key,shape);
         


        }
    }

    // console.log("seeting null");
    dispatch(setAction("none"));
    dispatch(setResizingDirection(null));
  
  }



  const handleMouseMove = (event) => {

    if (tool === 'selection') {
      mouseCorsourChange(event,elements);

      if (action === 'moving') {
        console.log("movingsadfgfdsa");
        setChanged(true);
        move(event);

      } else if (action === 'resizing') {
        setChanged(true);
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