/* eslint-disable react/prop-types */

export default function DefaultLayout({ children }) {
  return (
    <div className="lg:flex lg:justify-center lg:items-center bg-nt_black">
      <div className="w-screen overflow-hidden max-w-[2560px] bg-no-repeat bg-fixed bg-cover bg-center second-bg">
        <div className="z-[0] min-h-screen relative text-nt_white flex flex-col">
          <div className="flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
