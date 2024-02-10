"use client"
import { useSelector } from 'react-redux';
import Canvas from './Canvas';
import Topbar from './TopBar/Topbar';
import CircularToolBar from './TopBar/CircularToolBar/CircularToolBar';


const App = () => {

  const toolWheel = useSelector(state => state.tool.toolWheel);
  return (
    <div>

      <Topbar></Topbar>
      <Canvas ></Canvas>

      {toolWheel ? <CircularToolBar /> : null}
    </div>
  )
}

export default App