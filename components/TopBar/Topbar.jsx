
import React from 'react'
import ButtonComponent from './ButtonComponent';
import { FaRegSquare } from "react-icons/fa";
import { IoRemoveOutline, IoMove } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { changeTool } from '../Redux/features/toolSlice';





const buttons = [
  { tooltip: 'Rectangle', icon: FaRegSquare, shortcut: '1', tool: 'rect' },
  { tooltip: 'Line', icon: IoRemoveOutline, shortcut: '2', tool: 'line' },
  { tooltip: 'Selection', icon: IoMove, shortcut: '3', tool: 'selection' }
  
];

const Topbar = ({ onButtonTypeChange }) => {
 

  const dispath = useDispatch();

  return (
    <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2'>

      {buttons.map((button, index) =>

      (
        <div key={index} onClick={() => dispath(changeTool(buttons[index].tool))}>  <ButtonComponent button={button} /> </div>

      )

      )}


    </div>
  )
}

export default Topbar