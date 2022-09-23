import { useState } from 'react';
import Prayer from './Prayer';
import SelectCities from './SelectCities';

export default function Main() {
  const [prayers, setPrayers] = useState({});

  return (
    <main>
      <h1 className="text-center text-3xl p-4">أوقات الصلاة بالمغرب</h1>
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
