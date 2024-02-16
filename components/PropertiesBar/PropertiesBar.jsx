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
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react'
import { Slider } from '../ui/slider'
import { ScrollArea } from '../ui/scroll-area'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addElement, updateElement } from '../ElementManipulation/Element'
import { setElement } from '../Redux/features/elementSlice'


const PropertiesBar = () => {



    const [stroke, setStroke] = useState("");
    const [background, setBackground] = useState("");

    const selectedElement = useSelector(state => state.selectedElement.value);
    const index = useSelector(state => state.elements.index);
    const element = useSelector(state => state.elements.value[index][selectedElement.id], shallowEqual);
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
        const currentStroke = element.stroke

        if (element.type != "pencil" || element.type != "text") {
            const currentBackground = element.fill;
            setBackground(currentBackground);
        }


        setStroke(currentStroke);

    }, [selectedElement])


    useEffect(() => {
        if (!changedByUser) {
            return; // Exit early if stroke hasn't changed by user
        }
        if (stroke.length === 0) {
            return;
        }


        const id = element.id;
        const type = element.type;

        let options ;


        switch (type) {
            case "rectangle":
            case "diamond":
            case "ellipse":
                options = { stroke: stroke, fill: background };
                break;
            case "text":
                options = { stroke: stroke};
                break;
            case "pencil":
                options = { stroke: stroke};
                break;    

            case "line":
                options = { stroke: stroke};
                break;
                
            default:
                break;    

        }




        let tempCopy = [...elements];




        let newElement = { ...element, ...options };

        tempCopy[id] = newElement;
        dispatch(setElement([tempCopy, false]));




        setChangedByUser(false);
    }, [stroke, background])


    return (
        <div className='absolute left-2 top-20'>
            <ScrollArea className="h-[400px] rounded-md border p-1 bg-white">
                <Card >

                    <CardContent >
                        <span className='text-xs'>Stroke</span>
                        <div className="flex flex-row">  {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className="rounded-md h-6 w-6 m-1 cursor-pointer active:scale-105"
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


                    <CardContent >
                        <span className='text-xs'>Background</span>
                        <div className="flex flex-row">  {solids.map((s) => (
                            <div
                                key={s}
                                style={{ background: s }}
                                className="rounded-md h-6 w-6 m-1 cursor-pointer active:scale-105"
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



                    <CardContent>
                        <span className='text-xs'>Font size</span>
                        <div className='flex flex-row'>
                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105 bg-indigo-100" >
                                <span className='text-xl font-normal'>S</span>
                            </Button>
                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105  bg-indigo-100">
                                <span className='text-xl font-normal'>M</span>
                            </Button>
                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105  bg-indigo-100">
                                <span className='text-xl font-normal'>L</span>
                            </Button>

                            <Button variant={"ghost"} className="rounded-md h-8 w-6 m-1 cursor-pointer active:scale-105  bg-indigo-100">
                                <span className='text-xl font-normal'>XL</span>
                            </Button>
                        </div>

                    </CardContent>

                    <CardContent>
                        <span className='text-xs'>Text align</span>
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

                    <CardContent>
                        <span className='text-xs'>Opacity</span>
                        <Slider className="p-2" max={100} step={1} />


                    </CardContent>

                </Card>

            </ScrollArea>
        </div>
    )
}

export default PropertiesBar