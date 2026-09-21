import { useEffect } from "react";
import wretch from "wretch";
import {
  cleanTiming,
  getNowUtc,
  readCachedCalendar,
  readCachedPrayers,
  todayKey,
  writeCachedCalendar,
  writeCachedPrayers,
} from "../Utils";

export default function FetchTodayTimes({
  cityId,
  setPrayers,
  setCalendarData,
  cities,
  setLoading,
}) {
  const API = import.meta.env.VITE_API_SALAT2 || "https://api.aladhan.com/v1/timings/";
  const method = 3;
  const t = {
    Imsak: 0,
    Fajr: -6,
    Sunrise: -3,
    Dhuhr: 5,
    Asr: 0,
    Maghrib: 3,
    Sunset: 0,
    Isha: 0,
    Midnight: 0,
  };

  const getLatLng = (citiesArr, id) =>
    citiesArr?.find((city) => parseInt(city.id, 10) === parseInt(id, 10));

  useEffect(() => {
    fetchPrayerTimes(cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, cities]);

  const parseCalendarResponse = (data) => {
    const map = {};
    if (!Array.isArray(data)) return map;

    for (const item of data) {
      if (!item?.date?.gregorian?.date || !item?.timings) continue;
      const [d, m, y] = item.date.gregorian.date.split("-");
      const dateKey = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      map[dateKey] = {
        timings: {
          Fajr: cleanTiming(item.timings.Fajr),
          Sunrise: cleanTiming(item.timings.Sunrise),
          Dhuhr: cleanTiming(item.timings.Dhuhr),
          Asr: cleanTiming(item.timings.Asr),
          Maghrib: cleanTiming(item.timings.Maghrib),
          Isha: cleanTiming(item.timings.Isha),
        },
        hijri: item.date.hijri,
        gregorian: item.date.gregorian,
      };
    }
    return map;
  };

  const fetchPrayerTimes = async (id) => {
    if (!cities?.length || !id) return;

    const city = getLatLng(cities, id);
    if (!city || city.lat === undefined || city.lng === undefined) return;

    const now = getNowUtc();
    const currentYear = now.year();
    const currentMonth = now.month() + 1; // 1-12
    const nextDate = now.add(1, "month");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month() + 1;

    // 1. Try reading from cache first for instant response
    const cachedCurrent = readCachedCalendar(id, currentYear, currentMonth);
    const cachedNext = readCachedCalendar(id, nextYear, nextMonth);
    const initialMap = {
      ...(cachedCurrent || {}),
      ...(cachedNext || {}),
    };

    const currentTodayKey = todayKey(now);
    if (Object.keys(initialMap).length > 0) {
      setCalendarData?.((prev) => ({ ...prev, ...initialMap }));
      if (initialMap[currentTodayKey]?.timings) {
        setPrayers(initialMap[currentTodayKey].timings);
      }
    } else {
      const savedPrayers = readCachedPrayers();
      if (savedPrayers && Object.keys(savedPrayers).length > 0) {
        setPrayers(savedPrayers);
      }
    }

    try {
      setLoading?.(true);
      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;

      // Fetch current month and next month
      const fetchMonth = async (yr, mo) => {
        const url = new URL(`https://api.aladhan.com/v1/calendar/${yr}/${mo}`);
        url.searchParams.set("latitude", city.lat);
        url.searchParams.set("longitude", city.lng);
        url.searchParams.set("method", method);
        url.searchParams.set("tune", tuneParams);
        url.searchParams.set("timezonestring", "UTC");

        const res = await wretch(url.toString()).get().json();
        const map = parseCalendarResponse(res.data);
        writeCachedCalendar(id, yr, mo, map);
        return map;
      };

      const [currentMap, nextMap] = await Promise.all([
        fetchMonth(currentYear, currentMonth).catch(() => ({})),
        fetchMonth(nextYear, nextMonth).catch(() => ({})),
      ]);

      const merged = { ...currentMap, ...nextMap };

      if (Object.keys(merged).length > 0) {
        setCalendarData?.((prev) => ({ ...prev, ...merged }));
        if (merged[currentTodayKey]?.timings) {
          setPrayers(merged[currentTodayKey].timings);
          writeCachedPrayers(merged[currentTodayKey].timings);
        }
      } else {
        await fetchSingleDayFallback(city, currentTodayKey, tuneParams);
      }
    } catch {
      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;
      await fetchSingleDayFallback(city, currentTodayKey, tuneParams);
    } finally {
      setLoading?.(false);
    }
  };

  const fetchSingleDayFallback = async (city, dateKey, tuneParams) => {
    try {
      const dateFormatted = getNowUtc().format("DD-MM-YYYY");
      const url = new URL(`${API}${dateFormatted}`);
      url.searchParams.set("latitude", city.lat);
      url.searchParams.set("longitude", city.lng);
      url.searchParams.set("method", method);
      url.searchParams.set("tune", tuneParams);
      url.searchParams.set("timezonestring", "UTC");

      const response = await wretch(url.toString()).get().json();
      const { timings, date } = response.data || {};
      if (timings) {
        const newPrayers = {
          Fajr: cleanTiming(timings.Fajr),
          Sunrise: cleanTiming(timings.Sunrise),
          Dhuhr: cleanTiming(timings.Dhuhr),
          Asr: cleanTiming(timings.Asr),
          Maghrib: cleanTiming(timings.Maghrib),
          Isha: cleanTiming(timings.Isha),
        };
        setPrayers(newPrayers);
        writeCachedPrayers(newPrayers);

        setCalendarData?.((prev) => ({
          ...prev,
          [dateKey]: {
            timings: newPrayers,
            hijri: date?.hijri,
            gregorian: date?.gregorian,
          },
        }));
      }
    } catch {
      const savedPrayers = readCachedPrayers();
      if (savedPrayers && Object.keys(savedPrayers).length > 0) {
        setPrayers(savedPrayers);
      }
    }
  };

  return null;
}
