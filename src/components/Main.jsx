import dayjs from 'dayjs';
import { useState } from 'react';
import Spinner from './common/spinner';
import Prayer from './Prayer';
import SelectCities from './SelectCities';

export default function Main() {
  const [prayers, setPrayers] = useState({});

  const prayersArr = Object.entries(prayers);

  const nextPrayers = prayersArr.filter((prayer) => {
    const time = dayjs();
    const dateToday = dayjs().format('YYYY-MM-DD');

    return dayjs(`${dateToday} ${prayer[1]}`).isAfter(time);
  });
  const nextPrayer = nextPrayers.length > 0 ? nextPrayers[0] : prayersArr[0];

  const date = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const dateFormatted = new Intl.DateTimeFormat('ar-MA', options).format(date);

  return (
    <main>
      <h1 className="text-center text-2xl p-3">أوقات الصلاة بالمغرب</h1>
      <h2 className="text-center text-xl p-2">ليوم {dateFormatted}</h2>
      <SelectCities setPrayers={setPrayers} />
      {prayersArr && prayersArr.length > 0 ? (
        prayersArr.map((prayer) => (
          <Prayer
            key={prayer[0]}
            name={prayer[0]}
            time={prayer[1]}
            isNext={prayer[0] === nextPrayer[0]}
          />
        ))
      ) : (
        <Spinner />
      )}
    </main>
  );
}
