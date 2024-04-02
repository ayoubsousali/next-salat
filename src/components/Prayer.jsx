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

  const normalStyle =
    "dark:border-light border-dark border-b-2 dark:text-light text-dark p-2 m-2";
  const isNextStyle = "dark:text-red-500 text-red-500 px-2 mx-2";

  return (
    <div>
      <div
        className={`${
          isNext ? isNextStyle : normalStyle
        } flex justify-items-center justify-between max-w-[600px]`}
      >
        <span className="text-lg">{arabicName(name)}</span>
        <span className="text-lg">{time}</span>
      </div>

      {remainingTime > 0 && isNext && (
        <div
          className={`${
            isNext
              ? "dark:text-red-500 text-red-500 dark:border-red-500 border-red-500 border-b-4"
              : "dark:text-light text-dark p-2 m-2"
          } text-center text-sm px-2 mx-2 py-1`}
        >
          {Math.floor(remainingTime / 3600) > 0 && (
            <span>{Math.floor(remainingTime / 3600)} ساعات</span>
          )}
          {Math.floor(remainingTime / 3600) > 0 &&
            Math.floor((remainingTime % 3600) / 60) > 0 && <span> و </span>}
          {Math.floor((remainingTime % 3600) / 60) > 0 && (
            <span>{Math.floor((remainingTime % 3600) / 60)} دقائق للآذان</span>
          )}
        </div>
      )}
    </div>
  );
}
