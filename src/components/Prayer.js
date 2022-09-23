/* eslint-disable react/prop-types */
export default function Prayer({ name, time }) {
  return (
    <div className="flex border-2 rounded justify-items-center justify-evenly	p-2 m-2 max-w-[500px]">
      <span>{name}</span>
      <span>{time}</span>
    </div>
  );
}
