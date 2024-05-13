import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlignCenter, AlignLeft, AlignRight, Dot, Minus, Spline } from 'lucide-react'
import { useEffect, useState } from 'react'
import SimpleColorPicker from '../TopBar/Menu/SimpleColorPicker'
import { Button } from '../ui/button'

import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { ScrollArea } from '../ui/scroll-area'

import { setElement } from '../Redux/features/elementSlice'

import { MdRoundedCorner } from "react-icons/md"
import { GlobalProps } from '../Redux/GlobalProps'


const PropertiesBar = () => {



    const [stroke, setStroke] = useState("#000000");
    const [background, setBackground] = useState(null);
    const [fillStyle, setFillStyle] = useState('solid');
    const [strokeStyle, setStrokeStyle] = useState([]);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [sharp, setSharp] = useState(false);
    const [bowing, setBowing] = useState(2);
    const [fontSize, setFontSize] = useState(24);

    const selectedElement = useSelector(state => state.selectedElement.value);
    const index = useSelector(state => state.elements.index);
    const tool = useSelector(state => state.tool.value);
    let element;
    const elements = useSelector(state => state.elements.value[index][0], shallowEqual);
    const [changedByUser, setChangedByUser] = useState(false);

    // used to ensure that the inital first useEffect to prefetch the properties
    // should work first than the other useEffect.
    const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);


    const dispatch = useDispatch();

    const solids = [
        '#E2E2E2',
        '#9fff5b',
        '#70e2ff',
        '#cd93ff',
        '#09203f',
    ]

    const fillStyles = [
        'solid',
        'zigzag',
        'cross-hatch',
        // 'dots',
        'sunburst',
        'dashed',
        'zigzag-line'
    ]

    // useEffect used to preload the already applied properties on the elements
    useEffect(() => {

        if (selectedElement !== null) {
            element = elements[parseInt(selectedElement.id.split("#")[1])];
            if (element === null || element === undefined) {

                const currentStroke = GlobalProps.stroke


                const currentBackground = GlobalProps.fill;
                const currentStrokeStyle = GlobalProps.strokeStyle;
                const currentStrokeWidth = GlobalProps.strokeWidth;
                const currentSharp = GlobalProps.sharp;
                const bowing = GlobalProps.bowing;
                const currentFontSize = GlobalProps.fontSize;
                const currentFillStyle = GlobalProps.fillStyle;

                setBackground(currentBackground);
                setFillStyle(currentFillStyle);
                setStrokeStyle(currentStrokeStyle);
                setStrokeWidth(currentStrokeWidth);
                setSharp(currentSharp);
                setBowing(bowing);
                setFontSize(currentFontSize);
                setStroke(currentStroke);

            } else {

                const currentStroke = element.stroke

                if (element.type !== "text") {
                    const currentBackground = element.fill;
                    const currentFillStyle = element.fillStyle;
                    const currentStrokeStyle = element.strokeStyle;
                    const currentStrokeWidth = element.strokeWidth;
                    const currentSharp = element.sharp;
                    const bowing = element.bowing;

                    setBackground(currentBackground);
                    setFillStyle(currentFillStyle);
                    setStrokeStyle(currentStrokeStyle);
                    setStrokeWidth(currentStrokeWidth);
                    setSharp(currentSharp);
                    setBowing(bowing);
                } else if (element.type === 'text') {
                    const currentFontSize = element.fontSize;
                    setFontSize(currentFontSize);

                }
                setStroke(currentStroke);
            }
        } else {

            const currentStroke = GlobalProps.stroke
            const currentBackground = GlobalProps.fill;
            const currentFillStyle = GlobalProps.fillStyle;
            const currentStrokeStyle = GlobalProps.strokeStyle;
            const currentStrokeWidth = GlobalProps.strokeWidth;
            const currentSharp = GlobalProps.sharp;
            const bowing = GlobalProps.bowing;
            const currentFontSize = GlobalProps.fontSize;

            setBackground(currentBackground);
            setFillStyle(currentFillStyle);
            setStrokeStyle(currentStrokeStyle);
            setStrokeWidth(currentStrokeWidth);
            setSharp(currentSharp);
            setBowing(bowing);
            setFontSize(currentFontSize);
            setStroke(currentStroke);

        }
        setFirstEffectCompleted(true);
    }, [selectedElement, tool]);

    // to update the properties of elements
    useEffect(() => {


        if (!firstEffectCompleted) {
            return; // Exit early if the first useEffect hasn't completed
        }

        if (selectedElement === null || tool !== 'selection') {
            GlobalProps.stroke = stroke;
            GlobalProps.fill = background;
            GlobalProps.fillStyle = fillStyle;
            GlobalProps.strokeStyle = strokeStyle;
            GlobalProps.strokeWidth = strokeWidth;
            GlobalProps.sharp = sharp;
            GlobalProps.bowing = bowing;
            GlobalProps.fontSize = fontSize;
            return;
        }


        element = elements[parseInt(selectedElement.id.split("#")[1])];

        if (!changedByUser) {
            return; // Exit early if stroke hasn't changed by user
        }
        if (stroke.length === 0) {
            return;
        }


        let id = element.id.split("#");
        const key = id[0];
        id = parseInt(id[1]);
        const type = element.type;

        let options;


        switch (type) {
            case "rectangle":
            case "diamond":
            case "ellipse":
                options = { stroke: stroke, fill: background, fillStyle: fillStyle, strokeStyle: strokeStyle, strokeWidth: strokeWidth, sharp: sharp, bowing: bowing };
                break;
            case "text":
                options = { stroke: stroke, fontSize: fontSize };
                break;
            case "pencil":
                options = { stroke: stroke, strokeWidth: strokeWidth };
                break;

            case "line":
                options = { stroke: stroke, strokeStyle: strokeStyle, strokeWidth: strokeWidth, bowing: bowing };
                break;

            default:
                break;

        }




        let tempNewArray = [...elements];

        if (type === "text") {
            const context = document.getElementById("canvas").getContext('2d');
            context.font = `${fontSize}px Virgil`;



            let textWidth = element.x1;
            let textHeight = element.y1;

            var txt = element.text;
            var lines = txt.split('\n');
            var linesLength = lines.length;

            var textWidthVar = 0;
            for (let i = 0; i < linesLength; i++) {
                const line = lines[i];
                textWidthVar = Math.max(textWidthVar, context.measureText(line).width)
            }


            textWidth += textWidthVar;
            textHeight = textHeight + (linesLength) * (fontSize + 6);
            let newElement = { ...element, x2: textWidth, y2: textHeight, ...options };
            tempNewArray[id] = newElement;
        } else {

            let newElement = { ...element, ...options };
            tempNewArray[id] = newElement;
        }


        dispatch(setElement([tempNewArray, false, key]));

        const roomId = GlobalProps.room;
        if (roomId != null) {
            tempNewArray = tempNewArray[id];
            GlobalProps.socket.emit("render-elements", { tempNewArray, roomId, key });
        }



        setChangedByUser(false);
    }, [firstEffectCompleted, stroke, background,fillStyle, strokeStyle, strokeWidth, sharp, bowing, fontSize])


  if (tool === "eraser") {
    return null;
  }

    return (
        <div className='absolute left-2 top-20'>
            <ScrollArea className="h-[400px] rounded-md border p-2 bg-white">
                <Card >

                    <CardContent >
                        <span className='text-xs'>Stroke</span>
                        <div className="flex flex-row">  {solids.map((s) => (
                            <div
                                key={s}

                                style={{ background: s }}
                                className={`rounded-md h-6 w-6 m-1 cursor-pointer active:scale-105  ${stroke === s ? 'border-2 border-black' : null} `}
                                onClick={() => {
                                    setChangedByUser(true);
                                    setStroke(s);


                                }}
                            />

                        ))}


                            <div className="flex h-6 items-center space-x-4 text-sm m-1">

                                <Separator orientation="vertical" />



                            </div>

                            <SimpleColorPicker stroke={stroke} setStroke={setStroke} setChangedByUser={setChangedByUser}></SimpleColorPicker></div>

                    </CardContent>


                    {(tool != 'pencil' && tool != 'text' && tool != 'line' && selectedElement === null) || (selectedElement != null && selectedElement.type != "pencil" && selectedElement.type != 'text' && selectedElement.type != "line" === true) ? <CardContent >
                        <span className='text-xs'>Background</span>
                        <div className="flex flex-row">  {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className={`rounded-md h-6 w-6 m-1 cursor-pointer active:scale-105  ${background === s ? 'border-2 border-black' : null} `}
                                onClick={() => {
                                    setChangedByUser(true);
                                    setBackground(s);

                                }}
                            />

                        ))}


                            <div className="flex h-6 items-center space-x-4 text-sm m-1">

                                <Separator orientation="vertical" />



                            </div>

                            <SimpleColorPicker stroke={background} setStroke={setBackground} setChangedByUser={setChangedByUser}></SimpleColorPicker></div>

                    </CardContent>

                        : null}
                    
                        {(tool != 'pencil' && tool != 'text' && tool != 'line' && selectedElement === null) || (selectedElement != null && selectedElement.type != "pencil" && selectedElement.type != 'text' && selectedElement.type != "line" === true) ? <CardContent >
                        <span className='text-xs'>Fill style</span>
                        <div className="flex flex-wrap max-w-[230px] gap-2 mt-1">
                            {fillStyles.map((style) => (
                                <div key={style} className={`border border-1 cursor-pointer active:scale-105 inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10  ${fillStyle === style ? 'border-2 border-black ' : null}`}
                                onClick={() => {
                                    setChangedByUser(true);
                                    setFillStyle(style);
                                }}>
                                <p className="text-xs rounded-md ">
                                    {style}
                                </p>  
                            </div>
                        ))}
                        </div>

                    </CardContent>

                        : null}

                    {(tool === 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type === 'text') ? <CardContent>
                        <span className='text-xs'>Font size</span>
                        <div className='flex flex-row'>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setFontSize(24);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${fontSize === 24 ? "bg-[#d4d9d6]" : null} `}>
                                <span className='text-xl font-normal'>S</span>
                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setFontSize(32);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${fontSize === 32 ? "bg-[#d4d9d6]" : null} `}>
                                <span className='text-xl font-normal'>M</span>
                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setFontSize(40);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${fontSize === 40 ? "bg-[#d4d9d6]" : null} `}>
                                <span className='text-xl font-normal'>L</span>
                            </Button>

                            <Button onClick={() => {
                                setChangedByUser(true);
                                setFontSize(48);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${fontSize === 48 ? "bg-[#d4d9d6]" : null} `}>
                                <span className='text-xl font-normal'>XL</span>
                            </Button>
                        </div>

                    </CardContent>
                        : null}
                    {(tool === 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type === 'text') ? <CardContent>
                        <span className='text-xs'>Text align (Coming Soon)</span>
                        <div className='flex flex-row'>

                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100" >
                                <span>  <AlignLeft className='h-4 w-4' /></span>

                            </Button>
                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105  bg-indigo-100">
                                <span>  <AlignCenter className='h-4 w-4'></AlignCenter></span>
                            </Button>
                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105  bg-indigo-100">
                                <span>  <AlignRight className='h-4 w-4'></AlignRight></span>
                            </Button>


                        </div>

                    </CardContent>
                        : null}

                    {(tool != 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type != 'text') ? <CardContent>
                        <span className='text-xs'>Stroke width</span>
                        <div className='flex flex-row'>

                            <Button onClick={() => {

                                setChangedByUser(true);
                                setStrokeWidth(2);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${strokeWidth === 2 ? "bg-[#d4d9d6]" : null} `} >
                                <span>  <Minus className='h-4 w-4' strokeWidth={1.75} /></span>

                            </Button>
                            <Button onClick={() => {

                                setChangedByUser(true);
                                setStrokeWidth(4);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${strokeWidth === 4 ? "bg-[#d4d9d6]" : null} `}>
                                <span>  <Minus className='h-4 w-4' strokeWidth={2.5} /></span>
                            </Button>
                            <Button onClick={() => {

                                setChangedByUser(true);
                                setStrokeWidth(6);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${strokeWidth === 6 ? "bg-[#d4d9d6]" : null} `}>
                                <span>  <Minus className='h-4 w-4' strokeWidth={3.25} /></span>
                            </Button>


                        </div>

                    </CardContent>
                        : null}
                    {(tool != 'pencil' && tool != 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
                        <span className='text-xs'>Stroke style</span>
                        <div className='flex flex-row'>

                            <Button onClick={() => {
                                setChangedByUser(true);
                                setStrokeStyle([]);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${JSON.stringify(strokeStyle) === JSON.stringify([]) ? "bg-[#d4d9d6]" : null} `} >
                                <span>  <Minus className='h-4 w-4' /></span>

                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setStrokeStyle([20, 10]);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${JSON.stringify(strokeStyle) === JSON.stringify([20, 10]) ? "bg-[#d4d9d6]" : null} `}>
                                <span className='h-4 w-4 flex flex-row'>

                                    <Minus className='h-4 w-2' strokeWidth={5} />
                                    <Minus className='h-4 w-2' strokeWidth={5} />
                                    <Minus className='h-4 w-2' strokeWidth={5} />
                                </span>
                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setStrokeStyle([10, 10]);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${JSON.stringify(strokeStyle) === JSON.stringify([10, 10]) ? "bg-[#d4d9d6]" : null} `}>
                                <span className='h-4 w-4 flex flex-row'>

                                    <Dot className='h-4 w-3' strokeWidth={5} />
                                    <Dot className='h-4 w-3' strokeWidth={5} />
                                    <Dot className='h-4 w-3' strokeWidth={5} />
                                    <Dot className='h-4 w-3' strokeWidth={5} />
                                </span>
                            </Button>


                        </div>

                    </CardContent>
                        : null}


                    {(tool != 'pencil' && tool != 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
                        <span className='text-xs'>Sloppiness</span>
                        <div className='flex flex-row'>

                            <Button onClick={() => {
                                setChangedByUser(true);
                                setBowing(2);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${bowing === 2 ? "bg-[#d4d9d6]" : null} `} >
                                <span>  <Spline className='h-4 w-4' /></span>

                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setBowing(10);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${bowing === 10 ? "bg-[#d4d9d6]" : null} `}>
                                <div className="flex relative">
                                    <span className="">
                                        <Spline className="relative left-2 h-4 w-4" strokeWidth={2} />
                                    </span>
                                    <Spline className="relative right-1  h-4 w-4" strokeWidth={2} />
                                </div>

                            </Button>
                            <Button onClick={() => {
                                setChangedByUser(true);
                                setBowing(14);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${bowing === 14 ? "bg-[#d4d9d6]" : null} `}>
                                <div className="flex relative">

                                    <Spline className="relative left-4 h-4 w-4" strokeWidth={2} />

                                    <Spline className="relative right-1  h-4 w-4" strokeWidth={2} />
                                    <Spline className="relative right-3  h-4 w-4" strokeWidth={2} />
                                </div>
                            </Button>


                        </div>

                    </CardContent>
                        : null}
                    {(tool != 'pencil' && tool != 'text' && selectedElement === null) || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
                        <span className='text-xs'>Edges</span>

                        <div className='flex flex-row'>

                            <Button onClick={() => {
                                setChangedByUser(true);
                                setSharp(true);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${sharp === true ? "bg-[#d4d9d6]" : null} `} >

                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="img" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" strokeWidth="1.5">
                                        <path d="M3.33334 9.99998V6.66665C3.33334 6.04326 3.33403 4.9332 3.33539 3.33646C4.95233 3.33436 6.06276 3.33331 6.66668 3.33331H10"></path>
                                        <path d="M13.3333 3.33331V3.34331"></path>
                                        <path d="M16.6667 3.33331V3.34331"></path>
                                        <path d="M16.6667 6.66669V6.67669"></path>
                                        <path d="M16.6667 10V10.01"></path>
                                        <path d="M3.33334 13.3333V13.3433"></path>
                                        <path d="M16.6667 13.3333V13.3433"></path>
                                        <path d="M3.33334 16.6667V16.6767"></path>
                                        <path d="M6.66666 16.6667V16.6767"></path>
                                        <path d="M10 16.6667V16.6767"></path>
                                        <path d="M13.3333 16.6667V16.6767"></path>
                                        <path d="M16.6667 16.6667V16.6767"></path>
                                    </svg></div>
                            </Button>


                            <Button onClick={() => {
                                setChangedByUser(true);
                                setSharp(false);
                            }} variant={"ghost"} className={`rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100 ${sharp === false ? "bg-[#d4d9d6]" : null} `}>
                                <span>  <MdRoundedCorner className='-scale-x-90 h-4 w-4' /></span>
                            </Button>


                        </div>

                    </CardContent>
                        : null}


                </Card>

            </ScrollArea>
        </div>
    )
}

export default PropertiesBar
