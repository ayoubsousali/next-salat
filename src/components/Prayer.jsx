/* eslint-disable react/prop-types */

import dayjs from 'dayjs';
import arabicName from '../Utils';

export default function Prayer({ name, time, isNext }) {

  const now = dayjs();

  const [hoursString, minutesString] = time.split(':');
  const hours = parseInt(hoursString);
  const minutes = parseInt(minutesString);

  const prayerTime = now.set('hour', hours).set('minute', minutes);

  const remainingTime = prayerTime.diff(now, 'second');
  const remainingHours = Math.floor(remainingTime / 3600);
  const remainingMinutes = Math.floor((remainingTime % 3600) / 60);

  const normalStyle = 'dark:border-light border-dark border-b-2 dark:text-light text-dark p-2 m-2';
  const isNextStyle = ' dark:text-red-500 text-red-500 px-2 mx-2';

  return (
    <div>
      <div
        className={`${isNext
          ? isNextStyle
          : normalStyle
          } flex justify-items-center justify-between max-w-[600px]`}
      >
        <span>{arabicName(name)}</span>
        <span className="font-semibold">{time}</span>
      </div>

      {
        remainingTime > 0 && isNext ?
          <div className={`${isNext
            ? 'dark:text-red-500 text-red-500 dark:border-red-500 border-red-500 border-b-4'
            : 'dark:text-light text-dark p-2 m-2'
            } text-center text-sm px-2 mx-2 py-1`}>
            {remainingHours > 0 ? <span>{remainingHours} ساعات</span> : null}
            {remainingHours > 0 && remainingHours > 0 ? " و " : null}
            {remainingMinutes > 0 ? <span>{remainingMinutes} دقائق للآذان</span> : null}
          </div> : ''
      }
    </div>
  );
}
