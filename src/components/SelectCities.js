/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react';

export default function SelectCities({ setPrayers }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState(1);

  const API = process.env.REACT_APP_API_SALAT;

  const getCities = () => {
    fetch('morocco-cities.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sorted = data
          .map((city) => ({ id: city.id, name: city.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCities(sorted);
      });
  };

  const getPrayersTimes = useCallback(
    (cityId) => {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();

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

  const handleChange = (value, selectOptionSetter) => {
    selectOptionSetter(value);
    getPrayersTimes(value);
    localStorage.setItem('savedCity', JSON.stringify(value));
  };

  useEffect(() => {
    getCities();
    getPrayersTimes(selectedOption);
  }, [selectedOption, getPrayersTimes]);

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
