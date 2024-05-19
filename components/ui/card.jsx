import * as React from "react"
import { setClose, setOpen, toggleClose } from "../Redux/Close/closeSlice";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => {

  return (
    <div
      ref={ref}
      className={cn("rounded-lg  text-card-foreground shadow-sm", className)}
      {...props}
    >

    </div>
  );
});
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"
const Close = React.forwardRef(({ className, ...props }, ref) => {
  const isOpen = useSelector((state) => state.close.isOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (!isOpen) {
      dispatch(setOpen());
    } else {
      dispatch(setClose());
    }
  };

  return (
    <div
      ref={ref}
      className={cn("flex justify-end w-full", className)}
      {...props}
    >
      <button
        className="text-gray-500 hover:text-gray-700"
        onClick={handleClose}
      >
        <svg
          className="w-5 h-5  "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
});

Close.displayName = "Close";
export default Close;
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-1 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
