import { useEffect } from "react";
import dayjs from "dayjs";
import wretch from "wretch";

export default function FetchTodayTimes({ cityId, setPrayers, cities }) {
  const API = import.meta.env.VITE_API_SALAT2;
  const method = 3; // MWL: Muslim World League
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
  }, [cityId, cities]);

  const getLatLng = (citiesArr, cityId) =>
    citiesArr.find((city) => parseInt(city.id) === cityId);

  const fetchTodayTimes = async (cityId) => {
    try {
      setPrayers([]);

      const today = new Date();
      const m = today.getMonth() + 1;
      const d = today.getDate();
      const y = today.getFullYear();

      const city = getLatLng(cities, parseInt(cityId));

      const dateToday = dayjs(`${y}-${m}-${d}`).format("DD-MM-YYYY");

      const tuneParams = `${t.Imsak},${t.Fajr},${t.Sunrise},${t.Dhuhr},${t.Asr},${t.Maghrib},${t.Sunset},${t.Isha},${t.Midnight}`;

      const url = new URL(`${API}${dateToday}`);
      url.searchParams.set("latitude", city?.lat);
      url.searchParams.set("longitude", city?.lng);
      url.searchParams.set("method", method);
      url.searchParams.set("tune", tuneParams);

      if (
        city !== undefined &&
        city.lat !== undefined &&
        city.lng !== undefined
      ) {
        // fetch data from API
        const response = await wretch(url.toString()).get().json();
        const { timings } = response.data;
        if (timings) {
          const newPrayers = {
            Fajr: timings.Fajr,
            Sunrise: timings.Sunrise,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
          };
          setPrayers(newPrayers);

          localStorage.setItem("prayers", JSON.stringify(newPrayers));
        }
      }
    } catch (error) {
      /* console.error("Error fetching data:", error); */

      const savedPrayers = localStorage.getItem("prayers");
      if (savedPrayers) {
        setPrayers(JSON.parse(savedPrayers));
      }
    }
  };
}
