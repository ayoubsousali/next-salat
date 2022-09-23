import { useState } from 'react';
import Prayer from './Prayer';
import SelectCities from './SelectCities';

export default function Main() {
  const [prayers, setPrayers] = useState({});

  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat('fr-MA').format(date);

  return (
    <main>
      <h1 className="text-center text-3xl p-4">أوقات الصلاة بالمغرب</h1>
      <h2 className="text-center text-xl p-2">ليوم {dateFormatted}</h2>
      <SelectCities setPrayers={setPrayers} />
      <Prayer name="الفجر" time={prayers.Fajr} />
      <Prayer name="الشروق" time={prayers.Chorouq} />
      <Prayer name="الظهر" time={prayers.Dhuhr} />
      <Prayer name="العصر" time={prayers.Asr} />
      <Prayer name="المغرب" time={prayers.Maghrib} />
      <Prayer name="العشاء" time={prayers.Ishae} />
    </main>
  );
}
