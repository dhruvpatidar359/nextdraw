"use client"
import { useSelector } from 'react-redux';
import Canvas from './Canvas';
import Topbar from './TopBar/Topbar';
import CircularToolBar from './TopBar/CircularToolBar/CircularToolBar';
import ExportDialog from '@/export/ExportDialog';
import { useState } from 'react';
import PropertiesBar from './PropertiesBar/PropertiesBar';


const App = () => {

  const toolWheel = useSelector(state => state.tool.toolWheel);
  const selectedElemenet = useSelector(state => state.selectedElement.value);
  const [open, setOpen] = useState(false);
 
  return (
    <div >

      <Topbar></Topbar>
      {selectedElemenet ? <PropertiesBar></PropertiesBar> : null}
      <Canvas ></Canvas>

      {open ? <ExportDialog open={open} changeOpen={setOpen} /> : null}
      {toolWheel ? <CircularToolBar changeOpen={setOpen} /> : null}


    </div>
  )
}

export default App