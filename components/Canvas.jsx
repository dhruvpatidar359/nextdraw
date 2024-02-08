'use client';
import store from '@/app/store';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import rough from 'roughjs/bundled/rough.esm';
import { draw, renderer } from './Drawing/Drawing';
import { addElement, adjustElementCoordinates, getElementBelow, getElementObject, updateElement } from './ElementManipulation/Element';
import { mouseCursorChange } from './Mouse/mouse';
import { move } from './Move/move';
import { ShapeCache } from './Redux/ShapeCache';
import { setAction } from './Redux/features/actionSlice';
import { setCanvas } from './Redux/features/canvasSlice';
import { setChanged, setDupState, setElement } from './Redux/features/elementSlice';
import { setOldElement } from './Redux/features/oldSelectedElementSlice';
import { setResizingDirection } from './Redux/features/resizeSlice';
import { setSelectedElement } from './Redux/features/selectedElementSlice';
import { changeTool, changeToolWheel } from './Redux/features/toolSlice';
import { resizeElement } from './Resize/resize';
import { getminMax } from '@/utils/common';
import CircularToolBar from './TopBar/CircularToolBar/CircularToolBar';





const Canvas = () => {


  // selectors 
  const tool = useSelector(state => state.tool.value);
  const index = useSelector(state => state.elements.index);
  const elements = useSelector(state => state.elements.value[index], shallowEqual);
  const hover = useSelector(state => state.hover.value);
  const action = useSelector(state => state.action.value);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const oldElement = useSelector(state => state.oldElement.value);
  const changed = useSelector(state => state.elements.changed);
  const dupState = useSelector(state => state.elements.dupState);
  const toolWheel = useSelector(state => state.tool.toolWheel);


  // useState for local height and width of canvas
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [panOffset, setpanOffset] = useState({ x: 0, y: 0 });
  const [scaleOffset, setscaleOffset] = useState({ x: 0, y: 0 });
  const [scale, setscale] = useState(1);
  const textAreaRef = useRef();


  const CLICK_INTERVAL = 500;
  let lastClick = (new Date()).getTime();



  // dispatcher
  const dispatch = useDispatch();

  useEffect(() => {
    const textArea = textAreaRef.current;

    if (textArea) {
      setTimeout(function () {
        textArea.focus();
        textArea.value = selectedElement.text;
        handleInput();
      }, 50);
    }


  }, [action, selectedElement]);

  // this function is called when our textarea is removed by clicking of mouse
  const handleBlur = event => {

    const { id, x1, y1, type, x2, y2 } = selectedElement;
    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
    updateElement(id, x1, y1, x2, y2, type, { text: event.target.value });

  }



  useEffect(() => {

    if (tool === 'rect' ||
      tool === 'line' ||
      tool === 'pencil' ||
      tool === 'ellipse' ||
      tool === 'diamond' || tool === 'text') {


      document.body.style.cursor = 'crosshair';



      if (selectedElement != null && action != 'writing') {

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


  const onZoom = delta => {
    setscale(prevState => Math.min(Math.max(prevState + delta, 0.1), 20));
  }

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Clear the canvas before drawing elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // a single resource for rendering the elements

    const scaleWidth = canvas.width * scale;
    const scaleHeight = canvas.height * scale;

    const scaleOffsetX = (scaleWidth - canvas.width) / (3);
    const scaleOffsetY = (scaleHeight - canvas.height) / (3);

    setscaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    ctx.save();
    ctx.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY);
    ctx.scale(scale, scale);
    renderer(ctx, elements, selectedElement, action);
    ctx.restore();

    console.log(ShapeCache.cache);

  }, [elements, selectedElement, action, panOffset, scale]);


  // scale and pan
  useEffect(() => {

    const handler = (e) => {
      e.preventDefault();
      if (e.ctrlKey) {


        onZoom(e.deltaY * -0.01);
      } else {

        setpanOffset(prevState => ({
          x: prevState.x - e.deltaX / 2,
          y: prevState.y - e.deltaY / 2
        }))

      }
    }

    document.getElementById("canvas").addEventListener("wheel", handler, { passive: false })

    return () => {
      document.getElementById("canvas").removeEventListener("wheel", handler, { passive: false })
    }
  }, [])


  // removes the default zoom behaviour
  useEffect(() => {
    document.addEventListener(
      "wheel",
      function touchHandler(e) {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      }, { passive: false });

    return () => {
      document.removeEventListener(
        "wheel",
        function touchHandler(e) {
          if (e.ctrlKey) {
            e.preventDefault();
          }
        }, { passive: false });
    }
  }, [])


  const modifyClient = (event) => {
    event.clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    event.clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

  }

  const handleMouseDown = (event) => {

    if (event.button == 1) {
      dispatch(changeToolWheel(true));
      return;
    }

    modifyClient(event);
    if (action === 'writing') {
      return;
    }

    if (tool === "selection") {


      const ele = getElementBelow(event, selectedElement);


      if (ele != null) {

        // double click functionality for text edit




        const msNow = (new Date()).getTime()
        if ((msNow - lastClick) < CLICK_INTERVAL) {

          if (selectedElement) {

            if (selectedElement.type === 'text' &&
              event.clientX - selectedElement.offSetX === selectedElement.x1 &&
              event.clientY - selectedElement.offSetY === selectedElement.y1) {

              dispatch(setAction("writing"));
              dispatch(changeTool("text"));
              return;
            }
          }
        }

        lastClick = msNow;


        // to remove the bounds if they are on a element somewhere else
        if (selectedElement != null && selectedElement.id != ele.id) {


          dispatch(setSelectedElement(null));

        }



        // logic for the creation of extra state when we just click on the element
        if (dupState === true) {
          if (changed === true) {
            dispatch(setElement([elements]));
            dispatch(setChanged(false));
            // setChanged(false);
          } else {
            dispatch(setElement([elements, true]));
          }
        } else {
          dispatch(setElement([elements]));
          dispatch(setDupState(true));
          dispatch(setChanged(false));

        }

        const { id, x1, y1, x2, y2, type } = ele;

        let offSetX;
        let offSetY;

        if (type != 'pencil') {
          offSetX = event.clientX - ele.x1;
          offSetY = event.clientY - ele.y1;
          dispatch(setOldElement(ele));
          dispatch(setSelectedElement({ ...ele, offSetX, offSetY }));
          updateElement(id, x1, y1, x2, y2, type, { text: ele.text });
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

      // default behaviour 
      if (hover === 'present') {

        dispatch(setAction("moving"));

      } else if (hover === 'resize') {

        dispatch(setAction("resizing"));
      }

    }


    else {


      // drawing and writing area
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

          dispatch(setChanged(true));

        }

        dispatch(setDupState(false));
      }


      dispatch(setOldElement(newElement));

      // we don't want the bounding box if it is a pencil and it is drawn afresh
      if (newElement.type != 'pencil') {
        dispatch(setSelectedElement(newElement));
      }



    }

  };

  const handleMouseUp = (event) => {
    // according to scale and traslation , we have to modify indexes
    
    modifyClient(event);

    if (action === 'writing') {
      return;
    }

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


      ShapeCache.cache.set(key, shape);
      if (key.type != "pencil") {
        dispatch(changeTool("selection"));
      }

    } else if (tool === 'selection') {


      if (action === 'moving') {


        if (ShapeCache.cache.has(oldElement)) {
          ShapeCache.cache.delete(oldElement);
          console.log("ker deya delete move🔥");
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
          updateElement(id, x1, y1, x2, y2, type, { text: element.text });
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
    } else if (tool === 'text') {
      dispatch(changeTool("selection"));
    }

    dispatch(setAction("none"));
    dispatch(setResizingDirection(null));


  }



  const handleMouseMove = (event) => {
    modifyClient(event);
    if (tool === 'selection') {

      mouseCursorChange(event, elements, selectedElement);

      if (action === 'moving') {

        // used for chaching mechanisms

        dispatch(setChanged(true));

        move(event, elements);

      } else if (action === 'resizing') {

        // used for chaching mechanisms
        dispatch(setChanged(true));
        if (selectedElement.type === 'pencil') {
          resizeElement(event, elements);
        } else {
          const { id, x1, y1, x2, y2, type, text } = resizeElement(event, elements);
          if (type != 'pencil') {
            if (type != 'text') {
              updateElement(id, x1, y1, x2, y2, type);
            } else {

              updateElement(id, x1, y1, x2, y2, type, { text: text });
            }

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




      {(action === 'writing' && tool === 'text' && selectedElement != null) ?
        (<textarea id='textarea' ref={textAreaRef} onInput={handleInput} onBlur={handleBlur} style={{
          position: "fixed", top: (selectedElement.y1 + panOffset.y) * scale - scaleOffset.y,
          left: (selectedElement.x1 + panOffset.x) * scale - scaleOffset.x

          , font: `${24 * scale}px Virgil`, margin: 0, padding: 0, border: 0, outline: 0, resize: 'auto', overflow: 'hidden',
          background: 'transparent', whiteSpace: 'pre'
          , resize: 'none', maxHeight: height - (selectedElement.y1 + panOffset.y) * scale + scaleOffset.y, maxWidth: width - (selectedElement.x1 + panOffset.x) * scale + scaleOffset.x

        }} />) : null
      }

      <canvas
        id='canvas'
        height={height}
        width={width}
        style={{ height: height, width: width, zIndex: 1 }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>


  )
}
export default Canvas