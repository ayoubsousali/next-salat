import { useEffect } from "react";
import dayjs from "dayjs";
import wretch from "wretch";
import { cleanTiming, writeCachedPrayers } from "../Utils";

export default function FetchTodayTimes({ cityId, setPrayers, cities, setLoading }) {
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

  useEffect(() => {
    fetchTodayTimes(cityId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId, cities]);

  const getLatLng = (citiesArr, id) =>
    citiesArr.find((city) => parseInt(city.id, 10) === id);

  const fetchTodayTimes = async (id) => {
    if (!cities?.length) return;

    try {
      setLoading?.(true);

      const today = new Date();
      const m = today.getMonth() + 1;
      const d = today.getDate();
      const y = today.getFullYear();
      const city = getLatLng(cities, parseInt(id, 10));
      const dateToday = dayjs(`${y}-${m}-${d}`).format("DD-MM-YYYY");
      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;

      const url = new URL(`${API}${dateToday}`);
      url.searchParams.set("latitude", city?.lat);
      url.searchParams.set("longitude", city?.lng);
      url.searchParams.set("method", method);
      url.searchParams.set("tune", tuneParams);

      if (city?.lat !== undefined && city?.lng !== undefined) {
        const response = await wretch(url.toString()).get().json();
        const { timings } = response.data;
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
        }
      }
    } catch (error) {
      try {
        const savedPrayers = localStorage.getItem("prayers");
        if (savedPrayers) setPrayers(JSON.parse(savedPrayers));
      } catch {
        /* keep current times */
      }
    } finally {
      setLoading?.(false);
    }
  };

  return null;
}
