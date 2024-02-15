import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { exportImage } from './export';
import { Switch } from "@/components/ui/switch"
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';


const ExportDialog = ({ open, changeOpen }) => {

    const [backgroundExport, setBackgroundExport] = useState(false);
  
    const { toast } = useToast()




    return (

        <div>

          

            <Dialog open={open} onOpenChange={() => {
                if (open === true) {

                    changeOpen(false);
                } else {
                    changeOpen(true);
                }
            }} >
                <DialogTrigger  >



                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Export Canvas</DialogTitle>
                        <DialogDescription>
                            Select the appropriate configurations
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">

                            <div className='flex-row items-center flex  '>

                                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                    Background
                                </h4>
                                <div className="flex items-center space-x-2 p-4">
                                    <Switch checked={backgroundExport} onCheckedChange={() => {
                                        if (backgroundExport === false) {
                                            setBackgroundExport(true);
                                        } else {
                                            setBackgroundExport(false);
                                        }

                                    }} id="background" />

                                </div>
                            </div>

                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">


                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={async () => {


                                await exportImage(backgroundExport, toast);
                                changeOpen(false);
                      
                        }} type="submit">Export</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default ExportDialog