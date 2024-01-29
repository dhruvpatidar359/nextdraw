'use client';
import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs/bundled/rough.esm';
import { resizeElement } from './Resize/resize';
import { addElement, adjustElementCoordinates, getElementBelow, getElementObject, updateElement } from './ElementManipulation/Element';
import { mouseCursorChange } from './Mouse/mouse';
import { move } from './Move/move';
import { draw, drawElements, renderer } from './Drawing/Drawing';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setElement, setIndex } from './Redux/features/elementSlice';
import { setCanvas } from './Redux/features/canvasSlice'
import { setAction } from './Redux/features/actionSlice';
import { setSelectedElement } from './Redux/features/selectedElementSlice';
import { ShapeCache } from './Redux/ShapeCache';
import { setOldElement } from './Redux/features/oldSelectedElementSlice';
import store from '@/app/store';
import { setResizingDirection } from './Redux/features/resizeSlice';
import { changeTool } from './Redux/features/toolSlice';
import { drawBounds } from './ElementManipulation/Bounds';





const Canvas = () => {


  // selectors 
  const tool = useSelector(state => state.tool.value);
  const index = useSelector(state => state.elements.index);

  const elements = useSelector(state => state.elements.value[index], shallowEqual);

  const hover = useSelector(state => state.hover.value);
  const action = useSelector(state => state.action.value);
  const selectedElement = useSelector(state => state.selectedElement.value);

  const oldElement = useSelector(state => state.oldElement.value);

  // useState for local height and width of canvas
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [changed, setChanged] = useState(false);
  const [dupState, setDupState] = useState(false);
  const textAreaRef = useRef();



  // dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    const textArea = textAreaRef.current;
  
    if (textArea) {
      setTimeout(function () {
        textArea.focus();
        textArea.value = selectedElement.text;
      }, 50);
    }
  

  }, [action, selectedElement]);

  const handleBlur = event => {
   
    const {id,x1,y1,type,x2,y2} = selectedElement;
    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
    updateElement(id,x1,y1,x2,y2,type,{text : event.target.value});
  }
  


  useEffect(() => {

    if (tool === 'rect' ||
        tool === 'line' ||
        tool === 'pencil' ||
        tool === 'ellipse' ||
        tool === 'diamond') {

      console.log("changed");
      document.body.style.cursor = 'crosshair';

      if (selectedElement != null) {

        dispatch(setSelectedElement(null));
      }

    } else {

      document.body.style.cursor = `url('defaultCursor.svg'), auto`;

    }
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

  useEffect(() => {
    const handleDoubleClick = (event) => {
      console.log("double click");
      if(selectedElement) {
        console.log("working");
        
        if(selectedElement.type === 'text' &&
        event.clientX - selectedElement.offSetX === selectedElement.x1 &&
        event.clientY - selectedElement.offSetY === selectedElement.y1) {
         
          dispatch(setAction("writing"));
          dispatch(changeTool("text"));
          return;
        }
      }
    };

   
    document.addEventListener('dblclick', handleDoubleClick);
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []); 


  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // a single resource for rendering the elements
    renderer(ctx, elements, selectedElement);



  }, [elements, selectedElement]);

  const getminMax = (element) => {
    let minX = element.points[0].x;
    let minY = element.points[0].y;
    let maxX = element.points[0].x;
    let maxY = element.points[0].y;

    element.points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    return { minX, minY, maxX, maxY };
  }



  const handleMouseDown = (event) => {

    if(action === 'writing') {
      return;
    }

    if (tool === "selection") {


      const ele = getElementBelow(event, selectedElement);
    

      if (ele != null) {

        // to remove the bounds if they are on a element somewhere else
        if (selectedElement != null) {


          dispatch(setSelectedElement(null));

        }



        // logic for the creation of extra state when we just click on the element
        if (dupState === true) {
          if (changed === true) {
            dispatch(setElement([elements]));
            setChanged(false);
          } else {
            dispatch(setElement([elements, true]));
          }
        } else {
          dispatch(setElement([elements]));
          setDupState(true);
          setChanged(false);
        }

        const { id, x1, y1, x2, y2, type } = ele;

        let offSetX;
        let offSetY;


        if (type != 'pencil') {
          offSetX = event.clientX - ele.x1;
          offSetY = event.clientY - ele.y1;
          dispatch(setOldElement(ele));
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY }));
          updateElement(id, x1, y1, x2, y2, type,{text : ele.text});
        } else {

          offSetX = ele.points.map(point => event.clientX - point.x);
          offSetY = ele.points.map(point => event.clientY - point.y);
          const rectCoordinatesOffsetX = event.clientX - ele.x1
          const rectCoordinatesOffsetY = event.clientY - ele.y1

          dispatch(setOldElement(ele));
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY, rectCoordinatesOffsetX, rectCoordinatesOffsetY }));
        }


      } else {

        // to remove the bounds if they are on a element somewhere else
        if (selectedElement != null) {


          dispatch(setSelectedElement(null));

        }

      }


      if (hover === 'present') {

        dispatch(setAction("moving"));

      } else if (hover === 'resize') {

        dispatch(setAction("resizing"));
      }

    }


    else {



      // we are drawing (drawing area) and writing
      if (tool === 'text') {
        dispatch(setAction("writing"));
      } else {
        dispatch(setAction("drawing"));
      }


      const newElement = addElement(elements.length, event.clientX, event.clientY, event.clientX, event.clientY, tool);

      if (dupState === false) {
        dispatch(setElement([[...elements, newElement]]));
      } else {
        if (changed) {
          dispatch(setElement([[...elements, newElement]]));
        } else {
          dispatch(setElement([[...elements, newElement], true]));
          setChanged(true);
        }

        setDupState(false);
      }


      dispatch(setOldElement(newElement));

      // we don't want the bounding box if it is a pencil and it is drawn afresh
      if (newElement.type != 'pencil') {
        dispatch(setSelectedElement(newElement));
      }



    }

  };

  const handleMouseUp = (event) => {

      

    if (action === "drawing") {

      // adjusting the coordinates in-case
      const element = elements[elements.length - 1];

      const adjustedElement = adjustElementCoordinates(element)

      if (element.type != 'pencil') {
        const { id, x1, x2, y1, y2, type } = adjustedElement;
        updateElement(id, x1, y1, x2, y2, type);
      } else {
        // we are putting the max and min x and y in the element for resize 



        const { minX, minY, maxX, maxY } = getminMax(element);



        const tempNewArray = [...elements];

        tempNewArray[element.id] = {
          ...tempNewArray[element.id],
          x1: minX, y1: minY, x2: maxX, y2: maxY
        };

        store.dispatch(setElement([tempNewArray, true]));

      }



      const currentStateElement = store.getState().elements.value[index];

      const key = currentStateElement[currentStateElement.length - 1];



      const shape = getElementObject(key);

      //  console.log(key);
      ShapeCache.cache.set(key, shape);
      if (key.type != "pencil") {
        dispatch(changeTool("selection"));
      }

    } else if (tool === 'selection') {

     
      

      if (action === 'moving') {


        if (ShapeCache.cache.has(oldElement)) {
          ShapeCache.cache.delete(oldElement);
          // console.log("ker deya delete move🔥");
        }

        const newElement = elements[selectedElement.id];

        const { type } = newElement;

        if (type === 'pencil') {
          const { minX, minY, maxX, maxY } = getminMax(newElement);

          const tempNewArray = [...elements];

          tempNewArray[newElement.id] = {
            ...tempNewArray[newElement.id],
            x1: minX, y1: minY, x2: maxX, y2: maxY
          };

          store.dispatch(setElement([tempNewArray, true]));
        }


        const currentStateElement = store.getState().elements.value[index];

        const key = currentStateElement[newElement.id];
        const shape = getElementObject(key);

        ShapeCache.cache.set(key, shape);




      } else if (action === 'resizing') {

        if (ShapeCache.cache.has(oldElement)) {
          ShapeCache.cache.delete(oldElement);
          // console.log("🔥Ker deya delete resize se");
        }

        const element = elements[selectedElement.id];
        const adjustedElement = adjustElementCoordinates(element);

        if (element.type != 'pencil') {
          const { id, x1, x2, y1, y2, type } = adjustedElement;
          updateElement(id, x1, y1, x2, y2, type);
        } else {
          const { minX, minY, maxX, maxY } = getminMax(element);

          const tempNewArray = [...elements];

          tempNewArray[element.id] = {
            ...tempNewArray[element.id],
            x1: minX, y1: minY, x2: maxX, y2: maxY
          };

          store.dispatch(setElement([tempNewArray, true]));
        }

        const currentStateElement = store.getState().elements.value[index];

        const key = currentStateElement[selectedElement.id];


        const shape = getElementObject(key);
        ShapeCache.cache.set(key, shape);



      }
    } else if(tool === 'text') {
      dispatch(changeTool("selection"));
    } 

    
    dispatch(setAction("none"));
    dispatch(setResizingDirection(null));

  }



  const handleMouseMove = (event) => {

    if (tool === 'selection') {
      mouseCursorChange(event, elements, selectedElement);

      if (action === 'moving') {

        setChanged(true);
        move(event, elements);

      } else if (action === 'resizing') {

        setChanged(true);
        if (selectedElement.type === 'pencil') {
          resizeElement(event, elements);
        } else {
          const { id, x1, y1, x2, y2, type } = resizeElement(event, elements);
          if (type != 'pencil') {
            updateElement(id, x1, y1, x2, y2, type);
          }
        }


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
  }, [height, width])

  const handleInput = () => {
    const textarea = textAreaRef.current;

    // Set the textarea height to auto and adjust its scrollHeight
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 5}px`;

    // Set the textarea width to auto and adjust its scrollWidth
    textarea.style.width = 'auto';
    textarea.style.width = `${textarea.scrollWidth + 5}px`;
    
  };

  return (
    <div>
      {(action === 'writing' && tool === 'text') ?
        (<textarea ref={textAreaRef} onInput={handleInput}  onBlur = {handleBlur} style={{ position: "fixed", top: selectedElement.y1, left: selectedElement.x1 
      
      ,font : "24px Virgil",margin : 0,padding : 0,border : 0 ,outline : 0,resize:'auto',overflow:'hidden',
      background:'transparent',whiteSpace:'pre'
      , resize: 'none', maxHeight : height - selectedElement.y1,maxWidth : width -selectedElement.x1
      
      }} />) : null
      }




      <canvas
        id='canvas'
        height={height}
        width={width}
        style={{ height: height, width: width }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>


  )
}
export default Canvas