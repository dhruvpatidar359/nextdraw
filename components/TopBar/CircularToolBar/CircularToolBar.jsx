import { changeTool, changeToolWheel } from '@/components/Redux/features/toolSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from '../CircularToolBar/CircularToolBar.module.css';
import { exportImage } from '@/export/export';
import ExportDialog from '@/export/ExportDialog';

const CircularToolBar = ({changeOpen}) => {


  const tool = useSelector(state => state.tool.value);
  const [currentTool, setCurrentTool] = useState(tool);
  const dispatch = useDispatch();




  let selectorModal;
  let currentWeapon;



  useEffect(() => {



    selectorModal = document.getElementById("weapon-selector-wrapper");
    currentWeapon = document.getElementById("current-weapon");




    selectorModal.classList.add("active");
    currentWeapon.style.filter = "blur(5px)";

  }, [])


  useEffect(() => {

    const handler = () => {

      dispatch(changeToolWheel(false));
    }

    window.addEventListener("mouseup", handler)

    return () => {
      window.removeEventListener("mouseup", handler);
    }
  }, []);

  function onMouseHover(event) {

    const element = event.currentTarget;
    setCurrentTool(element.getAttribute("data-tool-name"));
  }

  function mouseOut(event) {
    const element = event.currentTarget;
    const tool = element.getAttribute("data-tool-name");

    if (tool === 'Export') {
      console.log(changeOpen);
      changeOpen(true);

    } else {
      dispatch(changeTool(tool));
    }

    setCurrentTool(tool);

  }





  return (
    <div >



      <div id="app-info">

      </div>
      <div id="current-weapon">


      </div>
      <div id="weapon-selector-wrapper" >

        <svg height="430px" width="430px" className={styles.svg}>
          <text textAnchor="middle" x="125" y="290" fontSize="24" fill="white" fontFamily='Virgil'>{currentTool}</text>

          <g onMouseUp={mouseOut} onMouseMoveCapture={onMouseHover} data-tool-name="rectangle" className={styles.g}>
            <path d="M 610 310 A 300 300 0 0 1 522.1320343559643 522.1320343559643 L 451.4213562373095 451.4213562373095 A 200 200 0 0 0 510 310 z" fill={tool === "rectangle" ? "#CDFADB" : "#F6FDC3"} />


            <image xlinkHref="/square.svg" x="325" y="545" height="60px" width="60px" />
          </g>


          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            data-tool-name="Export"
            className={styles.g}
          >
            <path d="M 522.1320343559643 522.1320343559643 A 300 300 0 0 1 310 610  L 310 510 A 200 200 0 0 0 451.4213562373095 451.4213562373095  z" fill="#F6FDC3" />
            <image xlinkHref="/export.svg" x="140" y="620" height="60px" width="60px" />
          </g>

          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}

            data-tool-name="ellipse"
          >
            <path d="M 310 610 A 300 300 0 0 1 97.86796564403576 522.1320343559643  L 168.57864376269052 451.4213562373095 A 200 200 0 0 0 310 510  z" fill={tool === "ellipse" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/circle.svg" x="-33" y="545" height="60px" width="60px" />

          </g>

          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}

            data-tool-name="selection"
          >
            <path d="M 97.86796564403576 522.1320343559643 A 300 300 0 0 1 10 310.00000000000006  L 110 310 A 200 200 0 0 0 168.57864376269052 451.4213562373095  z" fill={tool === "selection" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/move.svg" x="-105" y="375" height="60px" width="60px" />

          </g>

          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}
            data-tool-name="text"
          >
            <path d="M 10 310.00000000000006 A 300 300 0 0 1 97.8679656440357 97.86796564403576  L 168.57864376269046 168.57864376269052 A 200 200 0 0 0 110 310  z" fill={tool === "text" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/text.svg" x="-35" y="200" height="60px" width="60px" />

          </g>

          <g

            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}
            data-tool-name="pencil"
          >
            <path d="M 97.8679656440357 97.86796564403576 A 300 300 0 0 1 309.99999999999994 10  L 309.99999999999994 110 A 200 200 0 0 0 168.57864376269046 168.57864376269052  z" fill={tool === "pencil" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/pencil.svg" x="140" y="125" height="55px" width="55px" />

          </g>

          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}
            data-tool-name="diamond"
          >
            <path d="M 309.99999999999994 10 A 300 300 0 0 1 522.1320343559642 97.8679656440357  L 451.4213562373095 168.57864376269046 A 200 200 0 0 0 309.99999999999994 110  z" fill={tool === "diamond" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/diamond.svg" x="320" y="200" height="60px" width="60px" />

          </g>

          <g
            onMouseUp={mouseOut}
            onMouseMoveCapture={onMouseHover}
            className={styles.g}
            data-tool-name="line"
          >
            <path d="M 522.1320343559642 97.8679656440357 A 300 300 0 0 1 610 309.99999999999994  L 510 309.99999999999994 A 200 200 0 0 0 451.4213562373095 168.57864376269046  z" fill={tool === "line" ? "#CDFADB" : "#F6FDC3"} />
            <image xlinkHref="/line.svg" x="390" y="375" height="60px" width="60px" />

          </g>
        </svg>
      </div></div>
  )
}

export default CircularToolBar