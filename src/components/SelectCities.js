/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';

export default function SelectCities({ setPrayers }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState(1);

  const API = process.env.REACT_APP_API_SALAT;
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
            id: city.id,
            name: city.name,
            lat: city?.lat,
            lng: city?.lng,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      });
  };

  const fetchMoroccoTimes = useCallback(
    (cityId, month, day) => {
      fetch(`${API}${cityId}/${month}/${day}`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPrayers(data[0]);
        });
    },
    [API, setPrayers]
  );

  const getLatLng = (citiesArr, cityId) =>
    // eslint-disable-next-line eqeqeq
    citiesArr.find((city) => parseInt(city.id) === cityId);

  const fetchOthersTimes = useCallback(
    (cityId, month, day, year) => {
      const city = getLatLng(cities, parseInt(cityId));
      console.log('cityId');
      console.log(cityId);
      console.log('city');
      console.log(city);

      const dateToday = dayjs(`${year}-${month}-${day}`).format('DD-MM-YYYY');
      if (city.lat !== undefined && city.lng !== undefined) {
        fetch(
          `${API2}${dateToday}?latitude=${city?.lat}&longitude=${city?.lng}&method=12`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        ).then((response) => {
          console.log(response.json());
        });
        // .then((data) => {
        //   setPrayers(data[0]);
        // });
      }
    },
    [cities, API2]
  );

  const getPrayersTimes = useCallback(
    (cityId) => {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const year = today.getFullYear();

      if (parseInt(cityId) < 9000) {
        fetchMoroccoTimes(parseInt(cityId), month, day);
      } else {
        fetchOthersTimes(parseInt(cityId), month, day, year);
      }
    },
    [fetchMoroccoTimes, fetchOthersTimes]
  );

  const handleChange = (value, selectOptionSetter) => {
    selectOptionSetter(value);
    getPrayersTimes(value);
    localStorage.setItem('savedCity', JSON.stringify(value));
  };

  useEffect(() => {
    getCities();
    getPrayersTimes(selectedOption);
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
