import arabicName from '../Utils';

/* eslint-disable react/prop-types */
export default function Prayer({ name, time, isNext }) {
  return (
    <div
      className={`${
        isNext
          ? 'dark:border-red-500 border-border-red-500 border-b-4 dark:text-red-500 text-red-500'
          : 'dark:border-light border-dark border-b-2 dark:text-light text-dark'
      } flex justify-items-center justify-between	p-2 m-2 max-w-[600px]`}
    >
      <span>{arabicName(name)}</span>
      <span className="font-bold">{time}</span>
    </div>
  );
}
