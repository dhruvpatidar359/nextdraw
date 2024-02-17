"use client"
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Canvas from './Canvas';
import Topbar from './TopBar/Topbar';
import CircularToolBar from './TopBar/CircularToolBar/CircularToolBar';
import ExportDialog from '@/export/ExportDialog';
import { useEffect, useState } from 'react';
import PropertiesBar from './PropertiesBar/PropertiesBar';
import { setElement } from './Redux/features/elementSlice';


const App = () => {

  const toolWheel = useSelector(state => state.tool.toolWheel);
  const selectedElemenet = useSelector(state => state.selectedElement.value);
  const index = useSelector(state => state.elements.index);
  const elements = useSelector(state => state.elements.value[index], shallowEqual);
  const tool = useSelector(state => state.tool.value);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

 

  useEffect(() => {
    const syncInterval = setInterval(() => {
      localStorage.setItem('elements', JSON.stringify(elements));
    }, 5000);


    return () => clearInterval(syncInterval);
  }, [elements]);





  return (
    <div >

      <Topbar></Topbar>
      {selectedElemenet != null || tool != 'selection' ? <PropertiesBar></PropertiesBar> : null}
      <Canvas ></Canvas>

      {open ? <ExportDialog open={open} changeOpen={setOpen} /> : null}
      {toolWheel ? <CircularToolBar changeOpen={setOpen} /> : null}


    </div>
  )
}

export default App