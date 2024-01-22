import React from 'react'
import { useSelector } from 'react-redux';


const ButtonComponent = ({ button }) => {

  const tool = useSelector(state => state.tool.value);

    return (
       

      
      <button  className= {`rounded-md p-4 m-2 ${button.tool === tool ? 'bg-[#52D3D8] border-2' :  "bg-[#9c83ee] border-2"} text-[#200E3A] relative `}>
        <span className=""><button.icon/></span>
        <span className="absolute bottom-0 right-0 text-white p-1 rounded">
          {button.shortcut}
        </span>
      </button>
     
    );
  };
  
  export default ButtonComponent;