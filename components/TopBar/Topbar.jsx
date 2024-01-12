
import React from 'react'
import ButtonComponent from './ButtonComponent';
import { FaRegSquare } from "react-icons/fa";
import { IoRemoveOutline, IoMove } from "react-icons/io5";



const buttons = [
  { tooltip: 'Rectangle', icon: FaRegSquare, shortcut: '1', tool: 'rect' },
  { tooltip: 'Line', icon: IoRemoveOutline, shortcut: '2', tool: 'line' },
  { tooltip: 'Selection', icon: IoMove, shortcut: '3', tool: 'selection' }
  // Add more buttons as needed
];

const Topbar = ({ onButtonTypeChange }) => {
  function handleButtonClick(tool) {
    onButtonTypeChange(tool);
    console.log(" we have chnageed");
  };

  return (
    <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2'>

      {buttons.map((button, index) =>

      (
        <div key={index} onClick={handleButtonClick.bind(this, buttons[index].tool)}>  <ButtonComponent button={button} /> </div>

      )

      )}


    </div>
  )
}

export default Topbar