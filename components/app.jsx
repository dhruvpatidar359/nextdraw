import React, { useState } from 'react'
import Canvas from './Canvas'
import Topbar from './TopBar/Topbar'

const app = () => {

  const [tool, settype] = useState("line");

  function updateType(tool) {
    settype(tool);
  }

  return (
    <div>

      <Topbar onButtonTypeChange={updateType}></Topbar>
      <Canvas type={tool}></Canvas></div>
  )
}

export default app