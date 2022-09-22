import { useState } from 'react';
import SelectCities from './SelectCities';

export default function Main() {
  const [prayers, setPrayers] = useState({});

  return (
    <main>
      <h1>Prayers Times</h1>
      <SelectCities setPrayers={setPrayers} />
      <ul>
        <li>{prayers.Fajr} :الفجر</li>
        <li>{prayers.Chorouq} :الشروق</li>
        <li>{prayers.Dhuhr} :الظهر</li>
        <li>{prayers.Asr} :العصر</li>
        <li>{prayers.Maghrib} :المغرب</li>
        <li>{prayers.Ishae} :العشاء</li>
      </ul>
    </main>
  );
}
