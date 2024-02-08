import { changeToolWheel } from '@/components/Redux/features/toolSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const CircularToolBar = () => {



  const dispatch = useDispatch();
  // Wheel OFF: https://i.postimg.cc/j5CWwcm2/Screen-Shot-2018-12-06-at-14-58-06.png
  // Wheel ON: https://i.postimg.cc/qqTt7KfZ/Screen-Shot-2018-12-06-at-15-00-43.png
  // Weapons Array of Objects - weapon = {name, image, current-ammo, max-ammo, type, attachments, damage, fire rate, accuracy, range}
  // When wheel is on, display it as modal, apply color overlay to background
  // When you hover on any weapons, change it with arrow keys
  // https://stackoverflow.com/questions/18387405/how-to-create-a-sliced-circle-using-css3-html5



  let selectorButton;
  let selectorModal;
  let currentWeapon;
  let appInfo;
  let hoveredWeaponRange;
  let hoveredWeaponAccuracy;
  let hoveredWeaponFireRate;
  let hoveredWeaponDamage;
  let hoveredWeaponName;


  useEffect(() => {


    selectorButton = document.getElementById("weapon-selector-button");
    selectorModal = document.getElementById("weapon-selector-wrapper");
    currentWeapon = document.getElementById("current-weapon");
    appInfo = document.getElementById("app-info");

    hoveredWeaponName = document.getElementById("hovered-weapon-name");
    hoveredWeaponDamage = document.getElementById("damage");
    hoveredWeaponFireRate = document.getElementById("fire-rate");
    hoveredWeaponAccuracy = document.getElementById("accuracy");
    hoveredWeaponRange = document.getElementById("range");

    selectorModal.classList.add("active");
    currentWeapon.style.filter = "blur(5px)";
    appInfo.style.filter = "blur(5px)";

    selectorButton.addEventListener("click", function () {
      if (selectorModal.style.display === "block") {
        selectorModal.classList.remove("active");
        currentWeapon.style.filter = "none";
        appInfo.style.filter = "none";
      } else {
        selectorModal.classList.add("active");
        currentWeapon.style.filter = "blur(5px)";
        appInfo.style.filter = "blur(5px)";
      }
    });

  }, [])


  useEffect(() => {
    window.addEventListener("mouseup", () => {
      console.log("ujp ha");
      dispatch(changeToolWheel(false));
    })

    return () => {
      window.removeEventListener("mouseup", () => {
        console.log("ujp ha");
      });
    }
  }, [])



  function mouseoverWeapon(element) {
    return;
    hoveredWeaponName.textContent = element.dataset.weapon;
    hoveredWeaponDamage.style.width = element.dataset.damage;
    hoveredWeaponFireRate.style.width = element.dataset.fireRate;
    hoveredWeaponAccuracy.style.width = element.dataset.accuracy;
    hoveredWeaponRange.style.width = element.dataset.range;
  }

  function onMouseOutWeapon() {
    return;
    hoveredWeaponName.textContent = "Select Weapon";
    hoveredWeaponDamage.style.width = "0%";
    hoveredWeaponFireRate.style.width = "0%";
    hoveredWeaponAccuracy.style.width = "0%";
    hoveredWeaponRange.style.width = "0%";
  }

  function changeCurrentWeaponWith(element) {
    return;
    var currentWeaponName = document.getElementById('current-weapon-name');
    var currentWeaponImage = document.getElementById('current-weapon-image');

    var activeWeapon = document.getElementsByClassName('active-weapon')[0];

    activeWeapon.classList.remove('active-weapon');

    currentWeaponName.innerHTML = element.dataset.weapon;
    currentWeaponImage.src = element.dataset.image;

    element.classList.add("active-weapon");

    selectorModal.classList.remove("active");
    currentWeapon.style.filter = "none";
    appInfo.style.filter = "none";
  }




  return (
    <div><div id="app-info">
      <img src="https://logonoid.com/images/grand-theft-auto-v-logo.png" height="300" />
    </div>
      <div id="current-weapon">
        <h3>Current Weapon:</h3>
        <div id="current-weapon-info">
          <h1 id="current-weapon-name">SMG</h1>
          <img id="current-weapon-image" src="https://vignette.wikia.nocookie.net/gtawiki/images/5/5e/SMG-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121752" />
        </div>
        <button id="weapon-selector-button">Change</button>
      </div>
      <div id="weapon-selector-wrapper">
        <div id="weapon-properties">
          <h4>Damage</h4>
          <div className="bar">
            <div id="damage" className="value-bar"></div>
          </div>
          <h4>Fire Rate</h4>
          <div className="bar">
            <div id="fire-rate" className="value-bar"></div>
          </div>
          <h4>Accuracy</h4>
          <div className="bar">
            <div id="accuracy" className="value-bar"></div>
          </div>
          <h4>Range</h4>
          <div className="bar">
            <div id="range" className="value-bar"></div>
          </div>
        </div>
        <svg height="620px" width="620px">
          <text textAnchor="middle" id="hovered-weapon-name" x="175" y="400" fontSize="18" stroke="none">Select Weapon</text>
          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Marksman Rifle"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/c/c8/MarksmanRifle-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419122123"
            data-damage="90%"
            data-fire-rate="80%"
            data-accuracy="40%"
            data-range="30%">
            <path d="M 610 310 A 300 300 0 0 1 522.1320343559643 522.1320343559643  L 451.4213562373095 451.4213562373095 A 200 200 0 0 0 510 310  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/c/c8/MarksmanRifle-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419122123" x="240" y="460" height="200px" width="200px" />
            <text x="300" y="620" fontSize="18" fill="white">6 / 6</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Fist"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/e/e0/Fist-GTAVPC-HUD.png/revision/latest?cb=20150425182638"
            data-damage="50%"
            data-fire-rate="60%"
            data-accuracy="70%"
            data-range="10%">
            <path d="M 522.1320343559643 522.1320343559643 A 300 300 0 0 1 310 610  L 310 510 A 200 200 0 0 0 451.4213562373095 451.4213562373095  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/e/e0/Fist-GTAVPC-HUD.png/revision/latest?cb=20150425182638" x="140" y="620" height="60px" width="60px" />
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Sawed-Off Shotgun"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/b/b4/SawedoffShotgun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121516"
            data-damage="90%"
            data-fire-rate="80%"
            data-accuracy="40%"
            data-range="30%">
            <path d="M 310 610 A 300 300 0 0 1 97.86796564403576 522.1320343559643  L 168.57864376269052 451.4213562373095 A 200 200 0 0 0 310 510  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/b/b4/SawedoffShotgun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121516" x="-50" y="510" height="120px" width="120px" />
            <text x="0" y="620" fontSize="18" fill="white">1 / 2</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Minigun"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/2/27/Minigun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419122509"
            data-damage="90%"
            data-fire-rate="80%"
            data-accuracy="40%"
            data-range="30%">
            <path d="M 97.86796564403576 522.1320343559643 A 300 300 0 0 1 10 310.00000000000006  L 110 310 A 200 200 0 0 0 168.57864376269052 451.4213562373095  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/2/27/Minigun-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419122509" x="-150" y="330" height="150px" width="150px" />
            <text x="-100" y="460" fontSize="18" fill="white">77 / 100</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Jerry Can"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/7/73/JerryCan-GTAVPC-HUD.png/revision/latest?cb=20150425183426"
            data-damage="20%"
            data-fire-rate="80%"
            data-accuracy="40%"
            data-range="45%">
            <path d="M 10 310.00000000000006 A 300 300 0 0 1 97.8679656440357 97.86796564403576  L 168.57864376269046 168.57864376269052 A 200 200 0 0 0 110 310  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/7/73/JerryCan-GTAVPC-HUD.png/revision/latest?cb=20150425183426" x="-45" y="180" height="70px" width="70px" />
            <text x="-20" y="280" fontSize="18" fill="white">6</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Pistol"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/8/8f/Pistol-GTAVPC-HUD.png/revision/latest?cb=20150419121059"
            data-damage="30%"
            data-fire-rate="60%"
            data-accuracy="80%"
            data-range="60%">
            <path d="M 97.8679656440357 97.86796564403576 A 300 300 0 0 1 309.99999999999994 10  L 309.99999999999994 110 A 200 200 0 0 0 168.57864376269046 168.57864376269052  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/8/8f/Pistol-GTAVPC-HUD.png/revision/latest?cb=20150419121059" x="130" y="90" height="100px" width="90px" />
            <text x="150" y="190" fontSize="18" fill="white">6 / 12</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="SMG"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/5/5e/SMG-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121752"
            data-damage="70%"
            data-fire-rate="10%"
            data-accuracy="50%"
            data-range="80%"
            className="active-weapon">
            <path d="M 309.99999999999994 10 A 300 300 0 0 1 522.1320343559642 97.8679656440357  L 451.4213562373095 168.57864376269046 A 200 200 0 0 0 309.99999999999994 110  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/5/5e/SMG-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121752" x="290" y="160" height="130px" width="130px" />
            <text x="330" y="280" fontSize="18" fill="white">12 / 30</text>
          </g>

          <g onClick={changeCurrentWeaponWith}
            onMouseOver={mouseoverWeapon}
            onMouseOut={onMouseOutWeapon}
            data-weapon="Carbine Rifle"
            data-image="https://vignette.wikia.nocookie.net/gtawiki/images/7/7a/CarbineRifle-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121949"
            data-damage="90%"
            data-fire-rate="20%"
            data-accuracy="60%"
            data-range="70%">
            <path d="M 522.1320343559642 97.8679656440357 A 300 300 0 0 1 610 309.99999999999994  L 510 309.99999999999994 A 200 200 0 0 0 451.4213562373095 168.57864376269046  z" fill="rgba(255,255,255,0.3)" />
            <image xlinkHref="https://vignette.wikia.nocookie.net/gtawiki/images/7/7a/CarbineRifle-GTAVPC-HUD.png/revision/latest/scale-to-width-down/185?cb=20150419121949" x="360" y="340" height="130px" width="130px" />
            <text x="390" y="460" fontSize="18" fill="white">30 / 30</text>
          </g>
        </svg>
      </div></div>
  )
}

export default CircularToolBar