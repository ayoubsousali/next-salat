import { useEffect, useState } from 'react';

export default function SelectCities() {
  const [cities, setCities] = useState([]);

  const getCities = () => {
    fetch('morocco-cities.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        setCities(myJson);
      });
  };

  useEffect(() => {
    getCities();
  }, []);

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
      <select className="text-2xl font-bold rounded border-2 border-purple-700 text-gray-600 h-14 w-60 pl-5 pr-10 bg-white hover:border-gray-400">
        {cities &&
          cities.length > 0 &&
          cities.map((item) => <option key={item.id}>{item.name}</option>)}
      </select>
    </div>
  );
}
