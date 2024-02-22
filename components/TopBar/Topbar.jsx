
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
import { Mutex } from 'async-mutex';


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
  const elements = useSelector(state => state.elements.value[index][0], shallowEqual);
  const selectedElement = useSelector(state => state.selectedElement.value);
  const changed = useSelector(state => state.elements.changed);
  const toolWheel = useSelector(state => state.tool.toolWheel);
  const [open, changeOpen] = useState(false);
  const [inputRoom, setInputRoom] = useState("");
  const indexMutex = new Mutex();




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
        if (GlobalProps.room != null) return;
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
          let elementsCopy = [...elements];
          const key = selectedElement.id.split("#")[0];
          const id = parseInt(selectedElement.id.split("#")[1]);

          if (ShapeCache.cache.has(elements[id])) {

            ShapeCache.cache.delete(elements[id]);
          }

          elementsCopy[id] = null;


          if (!changed) {
            dispatch(setElement([elementsCopy, true, key]));
            dispatch(setChanged(true));


          } else {


            dispatch(setElement([elementsCopy, false, key]));

          }
          const roomId = GlobalProps.room;
          if (roomId != null) {
            GlobalProps.socket.emit("delete-element", { roomId, key });

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
  const [createClicked, setCreateClicked] = useState(false);

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



          }} variant="outline" className='absolute right-2 top-2'>Collaborate</Button>

        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Speed up by using Collaboration</DialogTitle>



          </DialogHeader>
          {/* <text className=''>Create Your Own Room</text> */}
          {
            createClicked === true && room === null ? <span>Generating...</span> : null}

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
              GlobalProps.socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET);
            }


            let i = store.getState().elements.index;
            let e = store.getState().elements.value[i][0];
            GlobalProps.socket.emit('create-room', e)
            setCreateClicked(true);
            GlobalProps.socket.on('room-created', roomId => {
              GlobalProps.room = roomId;
              setRoom(roomId);

            });

            GlobalProps.socket.on('render-elements', ({ tempNewArray }) => {
              console.log("receing from the ");
              let id = tempNewArray.id.split("#")[0];
              let i = store.getState().elements.index;
              let e = store.getState().elements.value[i][0];
              let elementCopy = [...e];

              console.log(GlobalProps.indexMap);

              indexMutex.runExclusive(async () => {
                if (GlobalProps.indexMap.has(id)) {


                  const index = GlobalProps.indexMap.get(id);
                  tempNewArray = { ...tempNewArray, id: id + "#" + index };
                  elementCopy[index] = tempNewArray;
                } else {

                  const index = e.length;

                  GlobalProps.indexMap.set(id, index);
                  tempNewArray = { ...tempNewArray, id: id + "#" + index };
                  elementCopy.push(tempNewArray);
                }

                dispatch(setElement([elementCopy, true, null]));
              })

            });

            GlobalProps.socket.on("delete-element-socket", ({ key }) => {
              const index = GlobalProps.indexMap.get(key);

              let i = store.getState().elements.index;
              let e = store.getState().elements.value[i][0];
              let elementCopy = [...e];

              if (ShapeCache.cache.has(elementCopy[index])) {
                ShapeCache.cache.delete(elementCopy[index]);
              }
              console.log(elementCopy[index]);
              elementCopy[index] = null;
              dispatch(setElement([elementCopy, true, null]));
            });

            // TODO
            // GlobalProps.socket.on('undo-element-socket',({undoElement,key})=> {
            //   let i = store.getState().elements.index;
            //   let e = store.getState().elements.value[i][0];

            //   e.forEach()
            // })

          }} variant="outline" className=''>Create Room</Button>

          {/* <text className=''>Join a Room</text> */}

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

              GlobalProps.room = null;
              GlobalProps.socket = null;
              setRoom(null);
              setCreateClicked(false);
              toast({
                title: "Session has been stopped",
                description: "Success",
                duration: 3000
              });

            }} className='bg-red-600' type="submit">Stop</Button>


            <Button onClick={() => {

              if (GlobalProps.socket === null) {

                GlobalProps.socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET);

              }
              const roomId = inputRoom;
              GlobalProps.socket.emit('join-room', { roomId });
              GlobalProps.socket.on('error', error => {
                toast({
                  title: "Uh oh! Something went wrong.",
                  description: error,
                  duration: 3000
                });
              })

              GlobalProps.socket.on('join-success', () => {
                toast({
                  title: "Join Success",
                  description: "Success",
                  duration: 3000
                });
              })
              GlobalProps.room = inputRoom;




              GlobalProps.socket.on('render-elements', ({ tempNewArray }) => {

                let id = tempNewArray.id.split("#")[0];
                let i = store.getState().elements.index;
                let e = store.getState().elements.value[i][0];
                let elementCopy = [...e];

                indexMutex.runExclusive(async () => {
                  if (GlobalProps.indexMap.has(id)) {
                    const index = GlobalProps.indexMap.get(id);
                    tempNewArray = { ...tempNewArray, id: id + "#" + index };
                    elementCopy[index] = tempNewArray;
                  } else {

                    const index = e.length;
                    GlobalProps.indexMap.set(id, index);
                    tempNewArray = { ...tempNewArray, id: id + "#" + index };
                    elementCopy.push(tempNewArray);
                  }

                  dispatch(setElement([elementCopy, true, null]));
                })

              });


              GlobalProps.socket.on("delete-element-socket", ({ key }) => {

                let i = store.getState().elements.index;
                let e = store.getState().elements.value[i][0];
                const index = GlobalProps.indexMap.get(key);
                let elementCopy = [...e];

                if (ShapeCache.cache.has(elementCopy[index])) {
                  ShapeCache.cache.delete(elementCopy[index]);
                }
                elementCopy[index] = null;
                dispatch(setElement([elementCopy, true, null]));
              })


            }} type="submit">Join Room</Button>



          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default Topbar