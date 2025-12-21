import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { Sunrise, Sun, Sunset, Moon, CloudSun, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import arabicName from "../Utils";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const getPrayerIcon = (name) => {
  switch (name) {
    case 'Fajr': return <Sparkles className="w-6 h-6 text-teal-400" />;
    case 'Sunrise': case 'Chorouq': return <Sunrise className="w-6 h-6 text-orange-400" />;
    case 'Dhuhr': return <Sun className="w-6 h-6 text-yellow-500" />;
    case 'Asr': return <CloudSun className="w-6 h-6 text-orange-300" />;
    case 'Maghrib': return <Sunset className="w-6 h-6 text-red-400" />;
    case 'Isha': case 'Ishae': return <Moon className="w-6 h-6 text-indigo-400" />;
    default: return <Sparkles className="w-6 h-6" />;
  }
};

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
  }, [isNext]);

  function calculateRemainingTime() {
    const [hoursString, minutesString] = time.split(":");
    const hours = parseInt(hoursString);
    const minutes = parseInt(minutesString);
    const prayerTime = now.set("hour", hours).set("minute", minutes);
    const diffInSeconds = prayerTime.diff(now, "second");
    return diffInSeconds >= 0 ? diffInSeconds : 0;
  }

  const formatRemainingTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (h > 0) return `${h} س و ${m} د`;
    return `${m} دقيقة`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex items-center justify-between p-4 mb-3 rounded-2xl transition-all duration-300 overflow-hidden",
        isNext
          ? "bg-white/20 dark:bg-black/30 backdrop-blur-lg shadow-lg border-r-4 border-emerald-500"
          : "bg-white/10 dark:bg-white/5 hover:bg-white/15 dark:hover:bg-white/10"
      )}
    >
      {/* Active State Background Glow */}
      {isNext && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"
        />
      )}

      <div className="flex items-center gap-4 z-10">
        <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm shadow-sm">
          {getPrayerIcon(name)}
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold font-serif dark:text-gray-100 text-gray-800">
            {arabicName(name)}
          </span>
          {isNext && remainingTime > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
            >
              متبقي  {formatRemainingTime(remainingTime)}
            </motion.span>
          )}
        </div>
      </div>

      <div className="z-10">
        <span className={cn(
          "text-2xl font-serif tracking-wider",
          isNext ? "text-emerald-600 dark:text-emerald-400 font-bold" : "dark:text-gray-300 text-gray-600"
        )}>
          {time}
        </span>
      </div>
    </motion.div>
  );
}
