import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getNowUtc() {
  return dayjs.utc();
}

function toUtcDayjs(value) {
  if (!value) return dayjs.utc();
  if (dayjs.isDayjs(value)) return value.isUTC() ? value : value.utc();
  return dayjs.utc(value);
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

export function prayerDateTime(time, now = getNowUtc()) {
  const current = toUtcDayjs(now);
  const [hoursString, minutesString] = String(time || "00:00").split(":");
  const hours = parseInt(hoursString, 10) || 0;
  const minutes = parseInt(minutesString, 10) || 0;
  return current.hour(hours).minute(minutes).second(0).millisecond(0);
}

export function remainingSeconds(time, now = getNowUtc()) {
  const current = toUtcDayjs(now);
  let target = prayerDateTime(time, current);
  if (!target.isAfter(current)) {
    target = target.add(1, "day");
  }
  return Math.max(0, target.diff(current, "second"));
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

export function getNextPrayer(prayers, now = getNowUtc()) {
  const current = toUtcDayjs(now);
  const entries = Object.entries(prayers || {});
  if (entries.length === 0) return null;
  const upcoming = entries.find(([, time]) => prayerDateTime(time, current).isAfter(current));
  return upcoming || entries[0];
}

export function isPrayerPassed(time, now = getNowUtc()) {
  const current = toUtcDayjs(now);
  return !prayerDateTime(time, current).isAfter(current);
}

export function intervalProgress(prayers, nextName, now = getNowUtc()) {
  const current = toUtcDayjs(now);
  const entries = Object.entries(prayers || {});
  if (entries.length < 2 || !nextName) return 0;

  const idx = entries.findIndex(([name]) => name === nextName);
  if (idx < 0) return 0;

  const prev = entries[idx === 0 ? entries.length - 1 : idx - 1];
  const next = entries[idx];

  let end = prayerDateTime(next[1], current);
  if (!end.isAfter(current)) end = end.add(1, "day");

  let start = prayerDateTime(prev[1], current);
  if (!start.isBefore(end) || !start.isBefore(current)) {
    start = start.subtract(1, "day");
  }

  const total = end.diff(start, "second");
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, current.diff(start, "second") / total));
}

export function formatGregorian(date = new Date()) {
  const d = dayjs.isDayjs(date) ? date.toDate() : date;
  return new Intl.DateTimeFormat("ar-MA", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

export function formatHijri(date = new Date()) {
  try {
    const d = dayjs.isDayjs(date) ? date.toDate() : date;
    return new Intl.DateTimeFormat("ar-TN-u-ca-islamic", {
      timeZone: "UTC",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
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

export function todayKey(now = getNowUtc()) {
  const current = toUtcDayjs(now);
  return current.format("YYYY-MM-DD");
}

export function readCachedPrayers(cityId) {
  try {
    const selectedCity = cityId ?? JSON.parse(localStorage.getItem("savedCity")) ?? "9002";
    if (localStorage.getItem("prayersCity") !== String(selectedCity)) return {};
    if (localStorage.getItem("prayersDate") !== todayKey()) return {};
    if (localStorage.getItem("prayersTz") !== "UTC") return {};
    const saved = localStorage.getItem("prayers");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function writeCachedPrayers(prayers, cityId) {
  try {
    localStorage.setItem("prayers", JSON.stringify(prayers));
    localStorage.setItem("prayersDate", todayKey());
    localStorage.setItem("prayersTz", "UTC");
    localStorage.setItem("prayersCity", String(cityId));
  } catch {
    /* ignore storage errors */
  }
}

export function getDateKey(date = getNowUtc()) {
  return toUtcDayjs(date).format("YYYY-MM-DD");
}

export function getCalendarMonths(now = getNowUtc(), daysAfter = 30) {
  const current = toUtcDayjs(now);
  return [current, current.add(1, "month"), current.add(daysAfter, "day")].filter(
    (date, index, all) =>
      all.findIndex((other) => other.year() === date.year() && other.month() === date.month()) === index,
  );
}

export function formatDayLabel(targetDate, nowDate = getNowUtc()) {
  const target = toUtcDayjs(targetDate).startOf("day");
  const now = toUtcDayjs(nowDate).startOf("day");
  const diffDays = Math.round(target.diff(now, "day", true));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "غداً";
  if (diffDays === -1) return "أمس";

  return new Intl.DateTimeFormat("ar-MA", {
    timeZone: "UTC",
    weekday: "long",
  }).format(target.toDate());
}

export function formatDayNumber(date) {
  const d = toUtcDayjs(date);
  return d.format("D");
}

export function formatMonthArabic(date) {
  const d = toUtcDayjs(date);
  return new Intl.DateTimeFormat("ar-MA", {
    timeZone: "UTC",
    month: "long",
  }).format(d.toDate());
}

export function readCachedCalendar(cityId, year, month) {
  try {
    const key = `calendar_${cityId}_${year}_${month}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function writeCachedCalendar(cityId, year, month, data) {
  try {
    const key = `calendar_${cityId}_${year}_${month}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore storage errors */
  }
}

