import React, { useEffect, useState } from 'react'
import {
    AppWindow,
    Circle,
    Cloud,
    CreditCard,
    Delete,
    Folder,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MenuIcon,
    MenuSquareIcon,
    MessageSquare,
    Plus,
    PlusCircle,
    Save,
    Settings,
    User,
    UserPlus,
    Users,
    Video,
} from "lucide-react"
import { Recorder, RecorderStatus, Encoders } from "canvas-record";
import { AVC } from "media-codecs";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoLogoGithub, IoMenu, IoMenuSharp } from 'react-icons/io5'
import store from '@/app/store'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { toast } from '@/components/ui/use-toast'
import { open, save } from './menuActions'
import { exportImage } from '@/export/export'
import { setElement } from '@/components/Redux/features/elementSlice'
import { ShapeCache } from '@/components/Redux/ShapeCache'
import { FaGithub } from 'react-icons/fa'
import { ColorPicker, GradientPicker } from './ColorPicker'
import { setCanvasBackground } from '@/components/Redux/features/canvasSlice'
import { GlobalProps } from '@/components/Redux/GlobalProps'
const Menu = () => {

    const index = useSelector(state => state.elements.index);
    const elements = useSelector(state => state.elements.value[index][0], shallowEqual);
    const canvas = useSelector(state => state.canvas.value);
    const [background, setBackground] = useState('#FFFFFF');
    const [recording, setRecording] = useState(false);
    const [canvasRecorder, setCanvasRecorder] = useState(null);

    const dispatch = useDispatch();


    useEffect(() => {

        dispatch(setCanvasBackground(background));

    }, [background]);



    const currentDate = new Date();


    useEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext("2d");

        const recorder = new Recorder(ctx, {
            name: "ART",
            duration: Infinity,
            encoderOptions: {
                codec: AVC.getCodec({ profile: "Main", level: "5.2" }),
            },
        });
        setCanvasRecorder(recorder);
    }, []);

    useEffect(() => {
        if (!canvasRecorder) return;

        const tick = async () => {
            if (canvasRecorder.status !== RecorderStatus.Recording) return;
            await canvasRecorder.step();

            if (canvasRecorder.status !== RecorderStatus.Stopped) {
                requestAnimationFrame(tick);
            }
        };

        if (recording) {
            tick();
        }
    }, [recording, canvasRecorder]);




    return (
        <div className='fixed'>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <div className='fixed top-3 left-2 flex-row'>
                        {recording === true ? <Circle color='red' fill='red' className=" absolute h-2 w-2 justify-center items-center"></Circle> : null}
                        <Button onClick={() => {

                        }} variant="outline" size="icon" className="h-8 w-8">
                            <IoMenuSharp className="h-4 w-4" />
                        </Button>
                        {recording === true ? <span className='m-2'>Recording</span> : null}

                    </div>


                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 m-2">
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => {
                            open();
                        }}>
                            <Folder className="mr-2 h-4 w-4" />
                            <span>Open</span>
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {

                            save(elements);
                        }}>
                            <Save className="mr-2 h-4 w-4" />
                            <span>Save</span>
                            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        {GlobalProps.room === null ? <DropdownMenuItem onClick={() => {
                            store.dispatch(setElement([[], false, null]));
                            ShapeCache.cache = new WeakMap();
                            store.dispatch(setCanvasBackground("#FFFFFF"))
                            localStorage.setItem('elements', "");
                        }}>
                            <Delete className="mr-2 h-4 w-4" />
                            <span>Reset The Canvas</span>
                            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                        </DropdownMenuItem> : null}

                        {recording === false ? <DropdownMenuItem onClick={async () => {

                            // Start and encode frame 0
                            await canvasRecorder.start();
                            setRecording(true);


                        }}>
                            <Video className="mr-2 h-4 w-4" />
                            <span>Record</span>
                            {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                            : null}
                        {recording === true ? <DropdownMenuItem onClick={async () => {
                            await canvasRecorder.stop();
                            setRecording(false);
                        }}>
                            <Circle color='red' fill='red' className="absolute mb-2 mr-4 h-2 w-2 justify-center items-center"></Circle>
                            <Video className="mr-2 h-4 w-4" />

                            <span>Stop Recording</span>

                        </DropdownMenuItem> : null}

                        <DropdownMenuItem onClick={() => {
                            window.open("https://github.com/dhruvpatidar359/nextdraw", "_blank", "noreferrer");
                        }}>
                            <Github className="mr-2 h-4 w-4" />
                            <span>Github</span>
                            {/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>


                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <AppWindow className="mr-2 h-4 w-4" />
                                <span>Canvas Backgrounds</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={e => {
                                        e.preventDefault();

                                    }}>
                                        <ColorPicker background={background} setBackground={setBackground} className="w-full truncate" />
                                    </DropdownMenuItem>


                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                    </DropdownMenuGroup>



                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Menu