/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export default function SelectCities({ setPrayers }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState('9002');

  const API2 = process.env.REACT_APP_API_SALAT2;

  const getCities = () => {
    fetch('cities.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sorted = data
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
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();

    const city = getLatLng(cities, parseInt(cityId));

    const dateToday = dayjs(`${year}-${month}-${day}`).format('DD-MM-YYYY');

    if (
      city !== undefined &&
      city.lat !== undefined &&
      city.lng !== undefined
    ) {
      fetch(
        `${API2}${dateToday}?latitude=${city?.lat}&longitude=${city?.lng}&method=12`
      )
        .then((response) => response.json())
        .then((data) => {
          const { timings } = data.data;
          const prayers = {
            Fajr: timings.Fajr,
            Sunrise: timings.Sunrise,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
          };
          setPrayers(prayers);
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
