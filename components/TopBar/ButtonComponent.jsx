import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"

const ButtonComponent = ({ button }) => {

  const tool = useSelector(state => state.tool.value);

  return ( 

    <Button variant="ghost" className={`rounded-md py-5 px-4 m-2  ${button.tool === tool ? 'bg-[#d4d9d6] border-2' : "bg-[#F6FDC3] border-2"} text-[#200E3A] relative hover:bg-[${button.tool === tool ? '#CDFADB' : '#F6FDC3'}] `}>
      <img src= {button.icon} alt="icon" className="h-5 w-5" />
      <span className="absolute bottom-0 right-0 text-black p-1 rounded">
        {button.shortcut}
      </span>
    </Button>

  );
};

export default ButtonComponent;