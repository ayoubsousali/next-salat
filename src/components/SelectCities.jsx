/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import wretch from "wretch";
import FetchTodayTimes from "./FetchTodayTimes";

export default function SelectCities({ setPrayers }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState("9002");

  const getCities = () => {
    wretch("cities.json")
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

  const handleChange = (value, selectOptionSetter) => {
    selectOptionSetter(value);
    localStorage.setItem("savedCity", JSON.stringify(value));
  };

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    const savedCity = JSON.parse(localStorage.getItem("savedCity"));
    if (savedCity) {
      setSelectedOption(savedCity);
    }
  }, []);

  return (
    <div className="flex justify-center pb-2">
      <select
        value={selectedOption}
        onChange={(e) => handleChange(e.target.value, setSelectedOption)}
        className="text-xl w-full h-14 dark:border-light border-dark dark:bg-dark2 bg-light2 dark:text-light text-dark p-2 dark:focus:border-light2 focus:border-dark2 dark:hover:border-light2 hover:border-dark2 rounded-xl"
      >
        <FetchTodayTimes
          cityId={selectedOption}
          setPrayers={setPrayers}
          cities={cities}
        />
        {cities &&
          cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
      </select>
    </div>
  );
}
