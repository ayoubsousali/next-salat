/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import wretch from 'wretch';

export default function SelectCities({ setPrayers }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState('9002');

  const API2 = import.meta.env.VITE_API_SALAT2;
  const method = 3; // MWL: Muslim World League
  const tune = {
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

  const getCities = () => {
    wretch('cities.json')
      .get()
      .json((json) => {
        const sorted = json
          .map((city) => ({
            id: city?.id,
            name: city?.name,
            lat: city?.lat,
            lng: city?.lng,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      });
  };

  const getLatLng = (citiesArr, cityId) =>
    citiesArr.find((city) => parseInt(city.id) === cityId);

  const fetchTodayTimes = (cityId) => {
    setPrayers([]);
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    const city = getLatLng(cities, parseInt(cityId));

    const dateToday = dayjs(`${year}-${month}-${day}`).format('DD-MM-YYYY');

    const tuneParams = `${tune.Imsak},${tune.Fajr},${tune.Sunrise},${tune.Dhuhr},${tune.Asr},${tune.Maghrib},${tune.Sunset},${tune.Isha},${tune.Midnight}`;
    const url = new URL(`${API2}${dateToday}`);
    url.searchParams.set('latitude', city?.lat);
    url.searchParams.set('longitude', city?.lng);
    url.searchParams.set('method', method);
    url.searchParams.set('tune', tuneParams);

    if (
      city !== undefined &&
      city.lat !== undefined &&
      city.lng !== undefined
    ) {
      wretch(url.toString())
        .get()
        .json((json) => {
          const { timings } = json.data;
          if (timings) {
            const prayers = {
              Fajr: timings.Fajr,
              Sunrise: timings.Sunrise,
              Dhuhr: timings.Dhuhr,
              Asr: timings.Asr,
              Maghrib: timings.Maghrib,
              Isha: timings.Isha,
            };
            setPrayers(prayers);
          }
        });
    }
  };

  const handleChange = (value, selectOptionSetter) => {
    selectOptionSetter(value);
    fetchTodayTimes(value);
    localStorage.setItem('savedCity', JSON.stringify(value));
  };

  useEffect(() => {
    fetchTodayTimes(selectedOption);
  }, [cities]);

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    const savedCity = JSON.parse(localStorage.getItem('savedCity'));
    if (savedCity) {
      setSelectedOption(savedCity);
    }
  }, []);

  return (
    <div className="flex justify-center">
      <select
        value={selectedOption}
        onChange={(e) => handleChange(e.target.value, setSelectedOption)}
        className="text-xl border-b-2 w-full h-14 dark:border-light border-dark dark:bg-dark2 bg-light2 dark:text-light text-dark p-2 m-2 dark:focus:border-light2 focus:border-dark2 dark:hover:border-light2 hover:border-dark2"
      >
        {cities &&
          cities.length > 0 &&
          cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
      </select>
    </div>
  );
}
