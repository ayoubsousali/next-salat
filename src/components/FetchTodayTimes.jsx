import { useEffect } from "react";
import wretch from "wretch";
import {
  cleanTiming,
  getCalendarMonths,
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
  refreshKey,
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
    let active = true;
    fetchPrayerTimes(cityId, () => active);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, cities, refreshKey]);

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

  const fetchPrayerTimes = async (id, isActive) => {
    if (!cities?.length || !id) return;

    const city = getLatLng(cities, id);
    if (!city || city.lat === undefined || city.lng === undefined) return;

    const now = getNowUtc();
    const months = getCalendarMonths(now);
    const initialMap = Object.assign(
      {},
      ...months.map((date) => readCachedCalendar(id, date.year(), date.month() + 1) || {}),
    );

    const currentTodayKey = todayKey(now);
    if (Object.keys(initialMap).length > 0) {
      if (!isActive()) return;
      setCalendarData?.((prev) => ({ ...prev, ...initialMap }));
      if (initialMap[currentTodayKey]?.timings) {
        setPrayers(initialMap[currentTodayKey].timings);
      }
    } else {
      const savedPrayers = readCachedPrayers(id);
      if (isActive() && Object.keys(savedPrayers).length > 0) {
        setPrayers(savedPrayers);
      }
    }

    try {
      setLoading?.(true);
      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;

      // Cover the entire selectable range, including a third month near month-end.
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

      const maps = await Promise.all(
        months.map((date) => fetchMonth(date.year(), date.month() + 1).catch(() => ({}))),
      );
      if (!isActive()) return;
      const merged = Object.assign({}, ...maps);

      if (Object.keys(merged).length > 0) {
        setCalendarData?.((prev) => ({ ...prev, ...merged }));
        if (merged[currentTodayKey]?.timings) {
          setPrayers(merged[currentTodayKey].timings);
          writeCachedPrayers(merged[currentTodayKey].timings, id);
        }
      }
      if (!merged[currentTodayKey]?.timings && !initialMap[currentTodayKey]?.timings) {
        await fetchSingleDayFallback(city, id, currentTodayKey, tuneParams, isActive);
      }
    } catch {
      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;
      if (isActive()) await fetchSingleDayFallback(city, id, currentTodayKey, tuneParams, isActive);
    } finally {
      if (isActive()) setLoading?.(false);
    }
  };

  const fetchSingleDayFallback = async (city, id, dateKey, tuneParams, isActive) => {
    try {
      const dateFormatted = dateKey.split("-").reverse().join("-");
      const url = new URL(`${API}${dateFormatted}`);
      url.searchParams.set("latitude", city.lat);
      url.searchParams.set("longitude", city.lng);
      url.searchParams.set("method", method);
      url.searchParams.set("tune", tuneParams);
      url.searchParams.set("timezonestring", "UTC");

      const response = await wretch(url.toString()).get().json();
      if (!isActive()) return;
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
        writeCachedPrayers(newPrayers, id);

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
      if (!isActive()) return;
      const savedPrayers = readCachedPrayers(id);
      if (Object.keys(savedPrayers).length > 0) setPrayers(savedPrayers);
    }
  };

  return null;
}
