/* eslint-disable react/prop-types */

export default function DefaultLayout({ children }) {
  return (
    <div className="lg:flex lg:justify-center lg:items-center dark:bg-dark bg-light dark:text-light text-dark font-serif">
      <div className="w-screen overflow-hidden max-w-[2560px]">
        <div className="min-h-screen relative flex flex-col">
          <div className="flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
