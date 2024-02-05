
import store from '@/app/store';
import { useEffect } from 'react';
import { FaCircle, FaPencilAlt, FaRedo, FaSlash, FaSquare, FaUndo } from "react-icons/fa";
import { FaDiamond } from "react-icons/fa6";
import { IoMove, IoText } from "react-icons/io5";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateElement } from '../ElementManipulation/Element';
import { setAction } from '../Redux/features/actionSlice';
import { redo, setChanged, setElement, undo } from '../Redux/features/elementSlice';
import { setSelectedElement } from '../Redux/features/selectedElementSlice';
import { changeTool } from '../Redux/features/toolSlice';
import ButtonComponent from './ButtonComponent';
import { ShapeCache } from '../Redux/ShapeCache';
import { setOldElement } from '../Redux/features/oldSelectedElementSlice';

const buttons = [
  { tooltip: 'Rectangle', icon: FaSquare, shortcut: '1', tool: 'rect' },
  { tooltip: 'Line', icon: FaSlash, shortcut: '2', tool: 'line' },
  { tooltip: 'Selection', icon: IoMove, shortcut: '3', tool: 'selection' },
  { tooltip: 'Pencil', icon: FaPencilAlt, shortcut: '4', tool: 'pencil' },
  { tooltip: 'Ellipse', icon: FaCircle, shortcut: '5', tool: 'ellipse' },
  { tooltip: 'Diamond', icon: FaDiamond, shortcut: '6', tool: 'diamond' },
  { tooltip: 'Text', icon: IoText, shortcut: '7', tool: 'text' },


];

const Topbar = () => {

  const dispatch = useDispatch();
  const toolIndex = useSelector(state => state.tool.index);
  const action = useSelector(state => state.action.value);
  const index = useSelector(state => state.elements.index);
  const elements = useSelector(state => state.elements.value[index], shallowEqual);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const changed = useSelector(state => state.elements.changed);


  const updateText = () => {
    if (store.getState().action.value === 'writing') {
      const textArea = document.getElementById('textarea').value

      const { id, x1, y1, type, x2, y2 } = store.getState().selectedElement.value;
      // console.log(textArea);
      updateElement(id, x1, y1, x2, y2, type, { text: textArea });
      dispatch(setAction("none"));
      dispatch(setSelectedElement(null));
    }

  }

  // keyboard handler 
  useEffect(() => {
    const handler = (event) => {
  
      // when we are writing we should not listen to any changeTool
      if (action === 'writing') {
        return;
      }

      if (event.key === '1') {


        dispatch(changeTool("rect"));
        updateText();


      } else if (event.key === '2') {
        dispatch(changeTool("line"));
        updateText();
      } else if (event.key === '3') {
        dispatch(changeTool("selection"));
        updateText();
      } else if (event.key === '4') {

        dispatch(changeTool("pencil"));
        updateText();
      } else if (event.key === '5') {
        dispatch(changeTool('ellipse'))
        updateText();
      }
      else if (event.key === '6') {
        dispatch(changeTool('diamond'))
        updateText();
      } else if (event.key === '7') {
        dispatch(changeTool('text'))
        updateText();
      }

      else if ((event.key === 'z' || event.key === 'Z') && (event.ctrlKey || event.metaKey) && event.shiftKey) {
        if (store.getState().action.value === 'writing') {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(redo());

      } else if (event.ctrlKey && (event.key === 'z' || event.key === 'Z')) {
        if (store.getState().action.value === 'writing') {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(undo());
      } else if (event.key === 'Delete') {

        if (selectedElement != null) {
          let elementsCopy = [];
          const id = selectedElement.id;


          elements.forEach((element, index) => {
           
            if (index < id) {
              elementsCopy.push(element);
            } else if (index === id) {

              const elementToDelete = elements[index];

              if (ShapeCache.cache.has(elementToDelete)) {

                ShapeCache.cache.delete(elementToDelete);
              }
            } else {

              const newElement = { ...element, id: index - 1 };

              console.log(newElement);
              console.log(ShapeCache.cache.get(element));
              ShapeCache.cache.set(newElement,ShapeCache.cache.get(element));

              if (ShapeCache.cache.has(element)) {

                ShapeCache.cache.delete(element);
              }
              elementsCopy.push(newElement);

            }

          });
          if(!changed) {
            dispatch(setElement([elementsCopy,true]));
            dispatch(setChanged(true));
          } else {
            dispatch(setElement([elementsCopy]));
           
          }
         
      
          dispatch(setSelectedElement(null));
        }
      }


    }
    if (typeof window !== 'undefined') {

      window.addEventListener("keydown", handler);
    }

    return () => window.removeEventListener("keydown", handler)
  });


  // mouse wheel handler 
  // useEffect(() => {
  //   const handleWheel = (event) => {



  //     let currentTool;
  //     console.log(event.deltaY);
  //     if (event.deltaY > 0) {
  //       currentTool = (toolIndex + 1) % (buttons.length + 1);
  //     } else {
  //       currentTool = (toolIndex - 1) === 0 ? buttons.length : toolIndex - 1;
  //     }


  //     currentTool = currentTool === 0 ? 1 : currentTool;


  //     if(store.getState().action.value === 'writing') {
  //      const textArea =  document.getElementById('textarea').value

  //      const {id,x1,y1,type,x2,y2} = store.getState().selectedElement.value;

  //       updateElement(id,x1,y1,x2,y2,type,{text : textArea});
  //       dispatch(setAction("none"));
  //       dispatch(setSelectedElement(null));
  //     }


  //     switch (currentTool) {
  //       case 1:
  //         dispatch(changeTool("rect"));
  //         break;
  //       case 2:
  //         dispatch(changeTool("line"));
  //         break;
  //       case 3:
  //         dispatch(changeTool("selection"));
  //         break;
  //       case 4:
  //         dispatch(changeTool("pencil"));
  //         break;
  //       case 5:
  //         dispatch(changeTool("ellipse"));
  //         break;
  //       case 6:
  //         dispatch(changeTool("diamond"));
  //         break;

  //       case 7:
  //         dispatch(changeTool("text"));
  //         break;

  //       default:
  //         break;
  //     }
  //   };

  //   document.addEventListener('wheel', handleWheel);

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     document.removeEventListener('wheel', handleWheel);
  //   };
  // }, [toolIndex]);






  return (
    <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2'>

      {buttons.map((button, index) =>

      (
        <div key={index} onClick={() => {

          dispatch(changeTool(buttons[index].tool))
        }}>  <ButtonComponent button={button} /> </div>

      )

      )}

      <button onClick={() => {
        if (store.getState().action.value === 'writing') {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(undo());
      }} className={`rounded-md p-4 m-2   bg-[#9c83ee] border-2 text-[#200E3A] relative `}>
        <span className=""><FaUndo /></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {'8'}
        </span>
      </button>
      <button onClick={() => {
        if (store.getState().action.value === 'writing') {
          return;
        }
        dispatch(setSelectedElement(null));
        dispatch(redo())
      }} className={`rounded-md p-4 m-2   bg-[#9c83ee] border-2 text-[#200E3A] relative `}>
        <span className=""><FaRedo /></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {'9'}
        </span>
      </button>
    </div>
  )
}

export default Topbar