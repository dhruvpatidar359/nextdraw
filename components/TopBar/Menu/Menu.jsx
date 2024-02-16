import React, { useEffect, useState } from 'react'
import {
    AppWindow,
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
} from "lucide-react"

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
const Menu = () => {

    const index = useSelector(state => state.elements.index);
    const elements = useSelector(state => state.elements.value[index], shallowEqual);
    const canvas = useSelector(state => state.canvas.value);
    const [background, setBackground] = useState('#FFFFFF');
    const dispatch = useDispatch();


    useEffect(() => {

        dispatch(setCanvasBackground(background));

    }, [background])


    return (
        <div className='fixed'>
            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <div className='fixed top-3 left-2'>
                        <Button onClick={() => {

                        }} variant="outline" size="icon" className="h-8 w-8">
                            <IoMenuSharp className="h-4 w-4" />
                        </Button>

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
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {

                            save(elements);
                        }}>
                            <Save className="mr-2 h-4 w-4" />
                            <span>Save</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            store.dispatch(setElement([[], false]));
                            ShapeCache.cache = new WeakMap();
                            store.dispatch(setCanvasBackground("#FFFFFF"))
                        }}>
                            <Delete className="mr-2 h-4 w-4" />
                            <span>Reset The Canvas</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            window.open("https://github.com/dhruvpatidar359/nextdraw", "_blank", "noreferrer");
                        }}>
                            <Github className="mr-2 h-4 w-4" />
                            <span>Github</span>
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
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