import { CloudSun, Moon, Sparkles, Sun, Sunrise, Sunset } from "lucide-react";
import { cn } from "../Utils";

const ICONS = {
  Fajr: Sparkles,
  Sunrise: Sunrise,
  Chorouq: Sunrise,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: Moon,
  Ishae: Moon,
};

const TONES = {
  Fajr: "text-sky-700 dark:text-sky-300",
  Sunrise: "text-orange-600 dark:text-orange-300",
  Chorouq: "text-orange-600 dark:text-orange-300",
  Dhuhr: "text-amber-600 dark:text-amber-300",
  Asr: "text-orange-500 dark:text-orange-200",
  Maghrib: "text-rose-600 dark:text-rose-300",
  Isha: "text-indigo-600 dark:text-indigo-200",
  Ishae: "text-indigo-600 dark:text-indigo-200",
};

export function PrayerIcon({ name, className = "h-5 w-5", onDark = false }) {
  const Icon = ICONS[name] || Sparkles;
  return (
    <Icon
      className={cn(onDark ? "text-current" : TONES[name] || "text-teal-700", className)}
    />
  );
}
