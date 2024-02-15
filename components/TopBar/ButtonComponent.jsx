import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const ButtonComponent = ({ button }) => {

  const tool = useSelector(state => state.tool.value);

  return (

    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" style={{ width: '45px', height: '40px' }} className={`rounded px-2 m-2 ${button.tool === tool ? 'bg-[#d4d9d6] border-2' : "bg-[#F6FDC3] border-2"} text-[#200E3A] relative hover:bg-[${button.tool === tool ? '#CDFADB' : '#F6FDC3'}]`}>
            <img src={button.icon} alt="icon" className="h-4 w-4 m-1" />
            <span className="absolute bottom-0 right-0.5 text-[#040404b9]  rounded ">
              {button.shortcut.split("-")[1]}
            </span>
          </Button>


        </TooltipTrigger>
        <TooltipContent>
          <p>{button.shortcut}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>


  );
};

export default ButtonComponent;