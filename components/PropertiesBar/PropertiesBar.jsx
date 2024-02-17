import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import SimpleColorPicker from '../TopBar/Menu/SimpleColorPicker'
import { Separator } from "@/components/ui/separator"
import { Button } from '../ui/button'
import { AlignCenter, AlignLeft, AlignRight, Dot, Minus, MoreHorizontal, RectangleVertical, Spline, Square } from 'lucide-react'
import { Slider } from '../ui/slider'
import { ScrollArea } from '../ui/scroll-area'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addElement, updateElement } from '../ElementManipulation/Element'
import { setElement } from '../Redux/features/elementSlice'
import { FaRegSquareFull } from 'react-icons/fa6'
import { MdRoundedCorner } from "react-icons/md";
import { GlobalProps } from '../Redux/GlobalProps'


const PropertiesBar = () => {



    const [stroke, setStroke] = useState("#000000");
    const [background, setBackground] = useState(null);
    const [strokeStyle, setStrokeStyle] = useState([]);
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [sharp, setSharp] = useState(false);
    const [bowing, setBowing] = useState(1);
    const [fontSize, setFontSize] = useState(24);

    const selectedElement = useSelector(state => state.selectedElement.value);
    const index = useSelector(state => state.elements.index);
    const tool = useSelector(state => state.tool.value);
    let element;
    const elements = useSelector(state => state.elements.value[index], shallowEqual);
    const [changedByUser, setChangedByUser] = useState(false);


    const dispatch = useDispatch();

    const solids = [
        '#E2E2E2',
        '#9fff5b',
        '#70e2ff',
        '#cd93ff',
        '#09203f',
    ]





    useEffect(() => {



        if (selectedElement != null) {
            element = elements[selectedElement.id];

            const currentStroke = element.stroke

            if (element.type != "pencil" || element.type != "text") {
                const currentBackground = element.fill;
                const currentStrokeStyle = element.strokeStyle;
                const currentStrokeWidth = element.strokeWidth;
                const currentSharp = element.sharp;
                const bowing = element.bowing;

                setBackground(currentBackground);
                setStrokeStyle(currentStrokeStyle);
                setStrokeWidth(currentStrokeWidth);
                setSharp(currentSharp);
                setBowing(bowing);
            } else if (element.type === 'text') {
                const currentFontSize = element.fontSize;
                setFontSize(currentFontSize);

            }


            setStroke(currentStroke);




        } else {

            const currentStroke = GlobalProps.stroke


            const currentBackground = GlobalProps.fill;
            const currentStrokeStyle = GlobalProps.strokeStyle;
            const currentStrokeWidth = GlobalProps.strokeWidth;
            const currentSharp = GlobalProps.sharp;
            const bowing = GlobalProps.bowing;

            setBackground(currentBackground);
            setStrokeStyle(currentStrokeStyle);
            setStrokeWidth(currentStrokeWidth);
            setSharp(currentSharp);
            setBowing(bowing);

            const currentFontSize = GlobalProps.fontSize;
            setFontSize(currentFontSize);




            setStroke(currentStroke);
        }
    }, [selectedElement, tool]);


    useEffect(() => {

        if (selectedElement === null) {
            GlobalProps.stroke = stroke;
            GlobalProps.fill = background;
            GlobalProps.strokeStyle = strokeStyle;
            GlobalProps.strokeWidth = strokeWidth;
            GlobalProps.sharp = sharp;
            GlobalProps.bowing = bowing;
            GlobalProps.fontSize = fontSize;
            return;
        }
        element = elements[selectedElement.id];
        console.log("chingin");
        if (!changedByUser) {
            return; // Exit early if stroke hasn't changed by user
        }
        if (stroke.length === 0) {
            return;
        }


        const id = element.id;
        const type = element.type;

        let options;


        switch (type) {
            case "rectangle":
            case "diamond":
            case "ellipse":
                options = { stroke: stroke, fill: background, strokeStyle: strokeStyle, strokeWidth: strokeWidth, sharp: sharp, bowing: bowing };
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




        let tempCopy = [...elements];

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
            tempCopy[id] = newElement;
        } else {

            let newElement = { ...element, ...options };
            tempCopy[id] = newElement;
        }


        dispatch(setElement([tempCopy, false]));




        setChangedByUser(false);
    }, [stroke, background, strokeStyle, strokeWidth, sharp, bowing, fontSize])


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


                    {(tool != 'pencil' && tool != 'text') || (selectedElement != null && selectedElement.type != "pencil" && selectedElement.type != 'text' === true) ? <CardContent >
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

                    {(tool === 'text') || (selectedElement != null && selectedElement.type === 'text') ? <CardContent>
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
                    {(tool === 'text') || (selectedElement != null && selectedElement.type === 'text') ? <CardContent>
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

                    {(tool != 'text') || (selectedElement != null && selectedElement.type != 'text') ? <CardContent>
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
                    {(tool != 'pencil' && tool != 'text') || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
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


                    {(tool != 'pencil' && tool != 'text') || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
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
                    {(tool != 'pencil' && tool != 'text') || (selectedElement != null && selectedElement.type != 'text' && selectedElement.type != "pencil") ? <CardContent>
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