import { changeToolWheel } from '@/components/Redux/features/toolSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import styles from '../CircularToolBar/CircularToolBar.module.css';

const CircularToolBar = () => {



  const dispatch = useDispatch();

  let selectorButton;
  let selectorModal;
  let currentWeapon;



  useEffect(() => {


    selectorButton = document.getElementById("weapon-selector-button");
    selectorModal = document.getElementById("weapon-selector-wrapper");
    currentWeapon = document.getElementById("current-weapon");




    selectorModal.classList.add("active");
    currentWeapon.style.filter = "blur(5px)";


    selectorButton.addEventListener("click", function () {
      if (selectorModal.style.display === "block") {
        selectorModal.classList.remove("active");
        currentWeapon.style.filter = "none";

      } else {
        selectorModal.classList.add("active");
        currentWeapon.style.filter = "blur(5px)";

      }
    });

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



  function mouseOut(event) {
    const element = event.currentTarget;
    const weapon = element.getAttribute("data-weapon");
    const image = element.getAttribute("data-image");
    const damage = element.getAttribute("data-damage");
    const fireRate = element.getAttribute("data-fire-rate");
    const accuracy = element.getAttribute("data-accuracy");
    const range = element.getAttribute("data-range");




  }





  return (
    <div >

      <div id="app-info">

      </div>
      <div id="current-weapon">


        <button id="weapon-selector-button">Change</button>
      </div>
      <div id="weapon-selector-wrapper">

        <svg height="620px" width="620px" >
          <text textAnchor="middle" id="hovered-weapon-name" x="175" y="400" fontSize="18" stroke="none">Select Tool</text>
          <g
            onMouseUp={mouseOut}

            data-tool-name="Rectangle"


          >
            <path d="M 610 310 A 300 300 0 0 1 522.1320343559643 522.1320343559643  L 451.4213562373095 451.4213562373095 A 200 200 0 0 0 510 310  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="/square.png" x="330" y="550" width="50"
              height="50" image />

          </g>

          <g
            onMouseUp={mouseOut}
            data-tool-name="Rectangle"
          >
            <path d="M 522.1320343559643 522.1320343559643 A 300 300 0 0 1 310 610  L 310 510 A 200 200 0 0 0 451.4213562373095 451.4213562373095  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/e/e0/Fist-GTAVPC-HUD.png/revision/latest?cb=20150425182638" x="140" y="620" height="60px" width="60px" />
          </g>

          <g
            onMouseUp={mouseOut}


            data-tool-name="Rectangle"
          >
            <path d="M 310 610 A 300 300 0 0 1 97.86796564403576 522.1320343559643  L 168.57864376269052 451.4213562373095 A 200 200 0 0 0 310 510  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/b/b4/SawedoffShotgun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121516" x="-50" y="510" height="120px" width="120px" />
            <text x="0" y="620" fontSize="18" fill="white">1 / 2</text>
          </g>

          <g
            onMouseUp={mouseOut}



            data-tool-name="Rectangle"
          >
            <path d="M 97.86796564403576 522.1320343559643 A 300 300 0 0 1 10 310.00000000000006  L 110 310 A 200 200 0 0 0 168.57864376269052 451.4213562373095  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/2/27/Minigun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419122509" x="-150" y="330" height="150px" width="150px" />
            <text x="-100" y="460" fontSize="18" fill="white">77 / 100</text>
          </g>

          <g
            onMouseUp={mouseOut}
            data-tool-name="Rectangle"
          >
            <path d="M 10 310.00000000000006 A 300 300 0 0 1 97.8679656440357 97.86796564403576  L 168.57864376269046 168.57864376269052 A 200 200 0 0 0 110 310  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/7/73/JerryCan-GTAVPC-HUD.png/revision/latest?cb=20150425183426" x="-45" y="180" height="70px" width="70px" />
            <text x="-20" y="280" fontSize="18" fill="white">6</text>
          </g>

          <g
            onMouseUp={mouseOut}
            data-tool-name="Rectangle"
          >
            <path d="M 97.8679656440357 97.86796564403576 A 300 300 0 0 1 309.99999999999994 10  L 309.99999999999994 110 A 200 200 0 0 0 168.57864376269046 168.57864376269052  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/8/8f/Pistol-GTAVPC-HUD.png/revision/latest?cb=20150419121059" x="130" y="90" height="100px" width="90px" />
            <text x="150" y="190" fontSize="18" fill="white">6 / 12</text>
          </g>

          <g
            onMouseUp={mouseOut}
            data-tool-name="Rectangle"
          >
            <path d="M 309.99999999999994 10 A 300 300 0 0 1 522.1320343559642 97.8679656440357  L 451.4213562373095 168.57864376269046 A 200 200 0 0 0 309.99999999999994 110  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/5/5e/SMG-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121752" x="290" y="160" height="130px" width="130px" />
            <text x="330" y="280" fontSize="18" fill="white">12 / 30</text>
          </g>

          <g
            onMouseUp={mouseOut}
            data-tool-name="Rectangle"
          >
            <path d="M 522.1320343559642 97.8679656440357 A 300 300 0 0 1 610 309.99999999999994  L 510 309.99999999999994 A 200 200 0 0 0 451.4213562373095 168.57864376269046  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/7/7a/CarbineRifle-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121949" x="360" y="340" height="130px" width="130px" />
            <text x="390" y="460" fontSize="18" fill="white">30 / 30</text>
          </g>
        </svg>
      </div></div>
  )
}

export default CircularToolBar