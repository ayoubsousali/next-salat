import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import arabicName from "../Utils";

export default function Prayer({ name, time, isNext }) {
  const now = dayjs();
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    let intervalId = null;

    if (isNext) {
      intervalId = setInterval(() => {
        setRemainingTime((current) => current - 60);
      }, 60000);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, []);

  function calculateRemainingTime() {
    const [hoursString, minutesString] = time.split(":");
    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
    const prayerTime = now.set("hour", hours).set("minute", minutes);
    const diffInSeconds = prayerTime.diff(now, "second");
    return diffInSeconds >= 0 ? diffInSeconds : 0;
  }

  const normalStyle = "dark:text-light text-dark flex items-center";
  const isNextStyle = "dark:bg-dark2 bg-light2 rounded-xl flex items-center";

  return (
    <div className={`${isNext ? isNextStyle : normalStyle} h-14 p-2`}>
      <div className="flex justify-items-center items-center justify-between max-w-[600px] w-full">
        <span className="text-xl">{arabicName(name)}</span>

        {remainingTime > 0 && isNext && (
          <div className="text-center text-sm ">
            {Math.floor(remainingTime / 3600) > 0 && (
              <span>{Math.floor(remainingTime / 3600)} س</span>
            )}
            {Math.floor(remainingTime / 3600) > 0 &&
              Math.floor((remainingTime % 3600) / 60) > 0 && <span> و </span>}
            {Math.floor((remainingTime % 3600) / 60) > 0 && (
              <span>{Math.floor((remainingTime % 3600) / 60)} د للآذان</span>
            )}
          </div>
        )}
        <span className="text-xl">{time}</span>
      </div>
    </div>
  );
}
