import React, { useState, useEffect } from "react";
import "./style.css"; // Copy and adapt CSS here
import capybara from "./assets/image/capybara.png";
import sor9_01 from "./assets/sor9head_01.PNG";
import sor9_02 from "./assets/sor9head_02.PNG";
import sor9_03 from "./assets/sor9head_03.PNG";
import sor9_04 from "./assets/sor9head_04.PNG";
import sor9_05 from "./assets/sor9head_05.PNG";
import on9_01 from "./assets/on9head_01.PNG";
import on9_02 from "./assets/on9head_02.PNG";
import on9_03 from "./assets/on9head_03.PNG";
import slime from "./assets/slime.png";
import capy from "./assets/capy.png";
import heart from "./assets/heart.png";
import clown from "./assets/clown.png";
import bowling from "./assets/bowling.png";
import HeartEmitter from './HeartEmitter';


import PinballGame from './Pinball';

const TITLE_ARRAY = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Monthiversary", "Anniversary"
];
const TOGETHER_DATE = [2022, 12, 1]; // Year, Month, Day

// Using placeholders for images
const sor9Heads = [
  sor9_03,
  sor9_01,
  sor9_02,
  sor9_04,
  sor9_05,
];

const on9Heads = [
  on9_02,
  on9_01,
  on9_03,
];

// --- Helper Functions ---
function countingDays() {
  const startDate = new Date(TOGETHER_DATE[0], TOGETHER_DATE[1] - 1, TOGETHER_DATE[2]);
  const currentDate = new Date();
  // Set to midnight to count full days
  startDate.setHours(0, 0, 0, 0);
  // currentDate.setHours(0, 0, 0, 0);
  const differenceInTime = currentDate.getTime() - startDate.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// --- Components ---
const BigdayFirework = () => <div>
  {/* <div className="firework"></div>
    <div className="firework"></div> */}
  <HeartEmitter />
</div>;

const HeartIcon = () => (
  <svg className="heart-icon" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.001 4.52853C10.3211 2.73792 7.69996 2.73792 6.02015 4.52853C4.34034 6.31915 4.34034 9.13549 6.02015 10.9261L12.001 17.2714L17.9818 10.9261C19.6616 9.13549 19.6616 6.31915 17.9818 4.52853C16.302 2.73792 13.6808 2.73792 12.001 4.52853Z" />
  </svg>
);

function App() {
  const [datetime, setDatetime] = useState(countingDays());
  const [title, setTitle] = useState("");
  const [bigDay, setBigDay] = useState(false);
  const [ribbonSor9Head, setSor9Head] = useState(sor9Heads[0]);
  const [ribbonOn9Head, setOn9Head] = useState(on9Heads[0]);
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDatetime(countingDays());
      const today = new Date();
      const isAnniversary = today.getMonth() + 1 === TOGETHER_DATE[1] && today.getDate() === TOGETHER_DATE[2];
      const isMonthiversary = today.getDate() === TOGETHER_DATE[2] && !isAnniversary;
      let show_days_index = today.getDay();
      if (isAnniversary) show_days_index = 8;
      else if (isMonthiversary) show_days_index = 7;
      setTitle(TITLE_ARRAY[show_days_index]);
      setBigDay(isAnniversary || isMonthiversary || (datetime % 100 === 0));
      // Format time as HH:MM:SS
      const timeOpts = { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      const timeStr = new Intl.DateTimeFormat('en-US', timeOpts).format(today);
      setTimeString(timeStr);

      // Format date as dd MMM yyyy
      const day = String(today.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[today.getMonth()];
      const year = today.getFullYear();
      setDateString(`${day} ${month} ${year}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleImageClick = (setRibbonImage, headArray, imgId) => {
    setRibbonImage(headArray[getRandomInt(headArray.length)]);

    // Restart bounce animation for the correct image
    const ribbon = document.getElementById(imgId);
    if (ribbon) {
      ribbon.style.animation = 'none';
      ribbon.offsetHeight; // Trigger reflow
      ribbon.style.animation = 'ribbon-bounce 0.6s ease';
    }
  };

  function getMiddleIcon() {
    if (ribbonSor9Head === sor9_02 && ribbonOn9Head === on9_02) {
      return clown;
    }
    else if (ribbonSor9Head === sor9_01 && ribbonOn9Head === on9_03) {
      return bowling;
    }
    else if (ribbonSor9Head === sor9_04 && ribbonOn9Head === on9_03) {
      return capy;
    }
    else if (ribbonSor9Head === sor9_05 && ribbonOn9Head === on9_01) {
      return slime;
    }
    return heart;
  }

  return (
    <div className="bg">
      {/* Head Pair Row at Top */}
      <div className="content-wrapper">
        <div className="head-row">
          <img
            id="on9-ribbon"
            src={ribbonOn9Head}
            alt="on9head"
            className="ribbon"
            onClick={() => handleImageClick(setOn9Head, on9Heads, "on9-ribbon")}
          />
          <img src={getMiddleIcon()} className="middle-icon" alt="icon" />
          <img
            id="sor9-ribbon"
            src={ribbonSor9Head}
            className="ribbon"
            alt="badge"
            onClick={() => handleImageClick(setSor9Head, sor9Heads, "sor9-ribbon")}
          />
        </div>
        {/* Title at the top */}
        <div className="title-top">
          {title}
        </div>

        {/* Day Counter */}
        <div className="day-counter">
          <span className="day-text">Day {datetime}</span>
        </div>

        {/* Date and Time Line */}
        <div className="datetime-line">
          {dateString} {timeString}
        </div>
      </div>

      {/* Capybara Image - Centered */}
      <img src={capybara} className="capybara" alt="capybara" />
      {
        bigDay && (
          <>
            <BigdayFirework />
          </>
        )
      }
    </div>
  );
}

export default App;