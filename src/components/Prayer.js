/* eslint-disable react/prop-types */
export default function Prayer({ name, time }) {
  return (
    <div className="flex border-2 dark:border-light border-dark rounded justify-items-center justify-evenly	p-2 m-2 max-w-[500px] dark:text-light text-dark">
      <span>{name}</span>
      <span>{time}</span>
    </div>
  );
}
