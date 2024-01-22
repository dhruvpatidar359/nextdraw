
import React from 'react'
import ButtonComponent from './ButtonComponent';
import { FaRedo, FaRegSquare, FaUndo } from "react-icons/fa";
import { IoRemoveOutline, IoMove } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { changeTool } from '../Redux/features/toolSlice';
import { redo, undo } from '../Redux/features/elementSlice';





const buttons = [
  { tooltip: 'Rectangle', icon: FaRegSquare, shortcut: '1', tool: 'rect' },
  { tooltip: 'Line', icon: IoRemoveOutline, shortcut: '2', tool: 'line' },
  { tooltip: 'Selection', icon: IoMove, shortcut: '3', tool: 'selection' }
  
];

const Topbar = ({ onButtonTypeChange }) => {
 
  

  const dispath = useDispatch();
  if (typeof window !== 'undefined') {
  window.addEventListener("keydown", (event) => {
    switch(event.key){
      case '1':
        
        dispath(changeTool("rect"));
        return;
      
      case '2':
        dispath(changeTool("line"));
        return;

      case '3':
        dispath(changeTool("selection"));
        return;  

    }
    // do something
  });
}

  return (
    <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2'>

      {buttons.map((button, index) =>

      (
        <div key={index} onClick={() => dispath(changeTool(buttons[index].tool))}>  <ButtonComponent button={button} /> </div>

      )

      )}

<button onClick={() => dispath(undo())} className= {`rounded-md p-4 m-2   bg-[#9c83ee] border-2 text-[#200E3A] relative `}>
        <span className=""><FaUndo/></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {'4'}
        </span>
      </button>
      <button onClick={() => dispath(redo())} className=  {`rounded-md p-4 m-2   bg-[#9c83ee] border-2 text-[#200E3A] relative `}>
        <span className=""><FaRedo/></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {'5'}
        </span>
      </button>
    </div>
  )
}

export default Topbar