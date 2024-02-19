
import store from '@/app/store';
import { useEffect, useState } from 'react';
import { FaCircle, FaImage, FaPencilAlt, FaRedo, FaSlash, FaSquare, FaUndo } from "react-icons/fa";
import { FaDiamond } from "react-icons/fa6";
import { IoMove, IoText } from "react-icons/io5";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getElementObject, updateElement } from '../ElementManipulation/Element';
import { setAction } from '../Redux/features/actionSlice';
import { redo, setChanged, setElement, undo } from '../Redux/features/elementSlice';
import { setSelectedElement } from '../Redux/features/selectedElementSlice';
import { changeTool } from '../Redux/features/toolSlice';
import ButtonComponent from './ButtonComponent';
import { ShapeCache } from '../Redux/ShapeCache';
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { exportImage } from '@/export/export';
import ExportDialog from '@/export/ExportDialog';
import Menu from './Menu/Menu';
import { setHover } from '../Redux/features/hoverSlice';
import { Circle, Copy, CopyCheck, CopyIcon, Diamond, ImageDown, LucideImageDown, Minus, Move, Pencil, Square, Type } from 'lucide-react';
import { GlobalProps } from '../Redux/GlobalProps';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';
import { io } from 'socket.io-client';

const buttons = [
  { tooltip: 'Rectangle', icon: Square, shortcut: 'Rectangle - 1', tool: 'rectangle' },
  { tooltip: 'Line', icon: Minus, shortcut: 'Line - 2', tool: 'line' },
  { tooltip: 'Selection', icon: Move, shortcut: 'Selection - 3', tool: 'selection' },
  { tooltip: 'Pencil', icon: Pencil, shortcut: 'Pencil - 4', tool: 'pencil' },
  { tooltip: 'Ellipse', icon: Circle, shortcut: 'Ellipse - 5', tool: 'ellipse' },
  { tooltip: 'Diamond', icon: Diamond, shortcut: 'Diamond - 6', tool: 'diamond' },
  { tooltip: 'Text', icon: Type, shortcut: 'Text - 7', tool: 'text' },


];

const Topbar = () => {

  const dispatch = useDispatch();
  const toolIndex = useSelector(state => state.tool.index);
  const action = useSelector(state => state.action.value);
  const index = useSelector(state => state.elements.index);
  const elements = useSelector(state => state.elements.value[index], shallowEqual);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const changed = useSelector(state => state.elements.changed);
  const toolWheel = useSelector(state => state.tool.toolWheel);
  const [open, changeOpen] = useState(false);
  const [inputRoom, setInputRoom] = useState(null);




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


        dispatch(changeTool("rectangle"));
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


              ShapeCache.cache.set(newElement, ShapeCache.cache.get(element));

              if (ShapeCache.cache.has(element)) {

                ShapeCache.cache.delete(element);
              }
              elementsCopy.push(newElement);

            }

          });
          const tempNewArray = elementsCopy;
          if (!changed) {
            dispatch(setElement([elementsCopy, true]));
            dispatch(setChanged(true));


          } else {


            dispatch(setElement([elementsCopy]));

          }
          const roomId = GlobalProps.room;
          if (roomId != null) {
            GlobalProps.socket.emit("render-elements", { tempNewArray, roomId });
          }


          dispatch(setSelectedElement(null));
          dispatch(setHover("none"));
          document.body.style.cursor = `url('defaultCursor.svg'), auto`;
        }
      }


    }
    if (typeof window !== 'undefined') {

      window.addEventListener("keydown", handler);
    }

    return () => window.removeEventListener("keydown", handler)
  });



  const [room, setRoom] = useState(GlobalProps.room);

  const copyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room); // Copy room ID to clipboard
      toast({
        title: "Copied Successfully",
        duration: 3000
      });
    }
  };




  return (
    <div className='flex flex-row '>
      <Menu ></Menu>
      <div className='flex flex-row absolute left-1/2 transform -translate-x-1/2 rounded-md bg-white  my-1 shadow-md'>

        {buttons.map((button, index) =>

        (
          <div key={index} onClick={() => {

            dispatch(changeTool(buttons[index].tool))
          }}>  <ButtonComponent button={button} /> </div>

        )

        )}




        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => {
                changeOpen(true);
              }} style={{ width: '35px', height: '35px', position: 'relative' }} className={`rounded px-2 m-1  `}>
                <LucideImageDown className="h-4 w-4 opacity-90"></LucideImageDown>


              </Button>

            </TooltipTrigger>
            <TooltipContent>
              <p>Export</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ExportDialog open={open} changeOpen={changeOpen} ></ExportDialog>




      </div>


      <Dialog>
        <DialogTrigger asChild>
          <Button onClick={() => {

            // GlobalProps.socket.emit('join-room', GlobalProps.room);

            // GlobalProps.socket.emit('create-room', GlobalProps.room)
            // GlobalProps.socket.on('room-created', roomId => {
            //   GlobalProps.room = roomId;

            // });


          }} variant="outline" className='absolute right-2 top-2'>Collaborate</Button>

        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Speed up by using Collaboration</DialogTitle>



          </DialogHeader>
          <text className=''>Create Your Own Room</text>
          {room && (
            <div className="room-id-container">
              <span>{room}</span>
              <Button onClick={copyRoomId} variant="outline" className="m-2">
                <CopyIcon className='h-4 w-4' />
              </Button>
            </div>
          )}

          <Button onClick={() => {

            if (GlobalProps.socket === null) {
              GlobalProps.socket = io('http://localhost:3001');
            }

            GlobalProps.socket.emit('create-room', GlobalProps.room)
            GlobalProps.socket.on('room-created', roomId => {
              GlobalProps.room = roomId;
              setRoom(roomId);

            });


          }} variant="outline" className=''>Create Room</Button>

          <text className=''>Join a Room</text>

          <div className="grid gap-4 ">


            <Input
              id="username"
              placeholder="Room-Id"
              value={inputRoom}
              onChange={(e) => {
                setInputRoom(e.currentTarget.value)
              }}
              className="col-span-3"
            />


          </div>
          <DialogFooter>
            <Button onClick={() => {



              if (GlobalProps.socket === null) {
              
                GlobalProps.socket = io('https://nextdraw.onrender.com:3001');
              }

              GlobalProps.socket.emit('join-room', inputRoom);
              GlobalProps.socket.on('error', error => {
                toast({
                  title: "Uh oh! Something went wrong.",
                  description: error,
                  duration: 3000
                });
              })
              GlobalProps.room = inputRoom;
            }} type="submit">Join Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Topbar