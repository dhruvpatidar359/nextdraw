import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";

const ButtonComponent = ({ button }) => {
  const tool = useSelector((state) => state.tool.value);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            style={{ width: "35px", height: "35px", position: "relative" }}
            className={` rounded px-2 m-1 ${button.tool === tool ? "bg-[#d4d9d6]" : null} `}
          >
            {/* <img src={button.icon} alt="icon" className="h-4 w-4 " /> */}
            <button.icon className="h-4 w-4 opacity-80"></button.icon>
            <span
              className="absolute    text-[#040404b9] "
              style={{
                fontSize: "12px",
                paddingTop: "1.3rem",
                paddingLeft: "1.5rem",
              }}
            >
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
