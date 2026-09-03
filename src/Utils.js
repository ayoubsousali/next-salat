import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function arabicName(name) {
  switch (name) {
    case "Fajr":
      return "الفجر";
    case "Sunrise":
    case "Chorouq":
      return "الشروق";
    case "Dhuhr":
      return "الظهر";
    case "Asr":
      return "العصر";
    case "Maghrib":
      return "المغرب";
    case "Isha":
    case "Ishae":
      return "العشاء";
    default:
      return "";
  }
}

export function prayerDateTime(time, now = dayjs()) {
  const [hoursString, minutesString] = String(time || "00:00").split(":");
  const hours = parseInt(hoursString, 10) || 0;
  const minutes = parseInt(minutesString, 10) || 0;
  return now.hour(hours).minute(minutes).second(0).millisecond(0);
}

export function remainingSeconds(time, now = dayjs()) {
  let target = prayerDateTime(time, now);
  if (!target.isAfter(now)) {
    target = target.add(1, "day");
  }
  return Math.max(0, target.diff(now, "second"));
}

export function splitCountdown(seconds) {
  const total = Math.max(0, seconds);
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

export function formatCountdownAr(seconds) {
  const { h, m, s } = splitCountdown(seconds);
  if (h > 0) return `${h} س و ${m} د`;
  if (m > 0) return `${m} د و ${s} ث`;
  return `${s} ث`;
}

export function pad2(value) {
  return String(value).padStart(2, "0");
}

export function getNextPrayer(prayers, now = dayjs()) {
  const entries = Object.entries(prayers || {});
  if (entries.length === 0) return null;
  const upcoming = entries.find(([, time]) => prayerDateTime(time, now).isAfter(now));
  return upcoming || entries[0];
}

export function isPrayerPassed(time, now = dayjs()) {
  return !prayerDateTime(time, now).isAfter(now);
}

export function intervalProgress(prayers, nextName, now = dayjs()) {
  const entries = Object.entries(prayers || {});
  if (entries.length < 2 || !nextName) return 0;

  const idx = entries.findIndex(([name]) => name === nextName);
  if (idx < 0) return 0;

  const prev = entries[idx === 0 ? entries.length - 1 : idx - 1];
  const next = entries[idx];

  let end = prayerDateTime(next[1], now);
  if (!end.isAfter(now)) end = end.add(1, "day");

  let start = prayerDateTime(prev[1], now);
  if (!start.isBefore(end) || !start.isBefore(now)) {
    start = start.subtract(1, "day");
  }

  const total = end.diff(start, "second");
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, now.diff(start, "second") / total));
}

export function formatGregorian(date = new Date()) {
  return new Intl.DateTimeFormat("ar-MA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatHijri(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return null;
  }
}

export function normalizeAr(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ً-ْ]/g, "");
}

export function cleanTiming(value) {
  return String(value || "").split(" ")[0];
}

export function todayKey(now = dayjs()) {
  return now.format("YYYY-MM-DD");
}

export function readCachedPrayers() {
  try {
    if (localStorage.getItem("prayersDate") !== todayKey()) return {};
    const saved = localStorage.getItem("prayers");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function writeCachedPrayers(prayers) {
  localStorage.setItem("prayers", JSON.stringify(prayers));
  localStorage.setItem("prayersDate", todayKey());
}
