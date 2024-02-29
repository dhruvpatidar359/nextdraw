import store from '@/app/store';
import { GlobalProps } from '@/components/Redux/GlobalProps';
import { ShapeCache } from '@/components/Redux/ShapeCache';
import { setCanvasBackground } from '@/components/Redux/features/canvasSlice';
import { setElement } from '@/components/Redux/features/elementSlice';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Recorder, RecorderStatus } from "canvas-record";
import {
    AppWindow,
    Circle,
    Delete,
    Folder,
    Github,
    Save,
    Video
} from "lucide-react";
import { AVC } from "media-codecs";
import { useEffect, useState } from 'react';
import { IoMenuSharp } from 'react-icons/io5';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ColorPicker } from './ColorPicker';
import { open, save } from './menuActions';
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
            frameRate: 60,
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

                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {

                            save(elements);
                        }}>
                            <Save className="mr-2 h-4 w-4" />
                            <span>Save</span>

                        </DropdownMenuItem>
                        {GlobalProps.room === null ? <DropdownMenuItem onClick={() => {
                            store.dispatch(setElement([[], false, null]));
                            ShapeCache.cache = new WeakMap();
                            store.dispatch(setCanvasBackground("#FFFFFF"))
                            localStorage.setItem('elements', "");
                            GlobalProps.indexMap = new Map();
                        }}>
                            <Delete className="mr-2 h-4 w-4" />
                            <span>Reset The Canvas</span>

                        </DropdownMenuItem> : null}

                        {recording === false ? <DropdownMenuItem onClick={async () => {

                            // Start and encode frame 0
                            await canvasRecorder.start();
                            setRecording(true);


                        }}>
                            <Video className="mr-2 h-4 w-4" />
                            <span>Record</span>

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