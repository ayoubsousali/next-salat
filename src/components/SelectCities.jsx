/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import wretch from "wretch";
import { ChevronDown } from "lucide-react";
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
    <div className="relative w-full">
      {/* Logic Component maintained here */}
      <FetchTodayTimes
        cityId={selectedOption}
        setPrayers={setPrayers}
        cities={cities}
      />

      <div className="relative">
        <select
          aria-label="City"
          value={selectedOption}
          onChange={(e) => handleChange(e.target.value, setSelectedOption)}
          className="appearance-none w-full text-lg w-full py-3 px-4 pr-4 pl-10 
                     bg-white/50 dark:bg-black/30 backdrop-blur-md
                     border border-slate-200 dark:border-slate-700
                     rounded-xl
                     text-slate-800 dark:text-slate-100
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                     transition-all duration-200 cursor-pointer
                     font-medium"
        >
          {cities &&
            cities.map((city) => (
              <option key={city.id} value={city.id} className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white">
                {city.name}
              </option>
            ))}
        </select>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
