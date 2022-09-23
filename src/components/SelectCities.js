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
        setCities(data);
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
  };

  useEffect(() => {
    getCities();
    getPrayersTimes(selectedOption);
  }, [selectedOption, getPrayersTimes]);

  return (
    <div className="relative inline-flex self-center">
      <select
        value={selectedOption}
        onChange={(e) => handleChange(e.target.value, setSelectedOption)}
        className="text-xl font-bold rounded border-2 h-14 bg-white text-black p-2"
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
