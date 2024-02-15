import React, { useState } from 'react'
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
import { shallowEqual, useSelector } from 'react-redux'
import { toast } from '@/components/ui/use-toast'
import { open, save } from './menuActions'
import { exportImage } from '@/export/export'
import { setElement } from '@/components/Redux/features/elementSlice'
import { ShapeCache } from '@/components/Redux/ShapeCache'
import { FaGithub } from 'react-icons/fa'
import { ColorPicker, GradientPicker } from './ColorPicker'
const Menu = () => {

    const index = useSelector(state => state.elements.index);
    const elements = useSelector(state => state.elements.value[index], shallowEqual);
    const [background, setBackground] = useState('#B4D455')

    return (
        <div className='fixed'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className='fixed top-3 left-2'>
                        <Button onClick={() => {

                        }} variant="outline" size="icon" className="h-8 w-8">
                            <IoMenuSharp className="h-4 w-4" />
                        </Button>

                    </div>


                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
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
                                        <ColorPicker background={background} setBackground={setBackground} />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        <span>Message</span>
                                    </DropdownMenuItem>

                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>New Team</span>
                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Github className="mr-2 h-4 w-4" />
                        <span>GitHub</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>API</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default Menu