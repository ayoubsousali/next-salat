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
      <svg
        className="text-white bg-purple-700 absolute top-0 right-0 m-2 pointer-events-none p-2 rounded"
        xmlns="http://www.w3.org/2000/svg"
        width="40px"
        height="40px"
        viewBox="0 0 38 22"
        version="1.1"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g
            transform="translate(-539.000000, -199.000000)"
            fill="#ffffff"
            fillRule="nonzero"
          >
            <g transform="translate(538.000000, 183.521208)">
              <polygon
                transform="translate(20.000000, 18.384776) rotate(135.000000) translate(-20.000000, -18.384776) "
                points="33 5.38477631 33 31.3847763 29 31.3847763 28.999 9.38379168 7 9.38477631 7 5.38477631"
              />
            </g>
          </g>
        </g>
      </svg>
      <select
        value={selectedOption}
        onChange={(e) => handleChange(e.target.value, setSelectedOption)}
        className="text-2xl font-bold rounded border-2 border-purple-700
        text-gray-600 h-14 w-60 pl-5 pr-10 bg-white hover:border-gray-400"
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
