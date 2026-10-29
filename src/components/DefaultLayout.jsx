/* eslint-disable react/prop-types */
import Footer from "./Footer";

export default function DefaultLayout({ children }) {
  return (
    <div className="relative min-h-[100svh] bg-canvas text-ink transition-colors duration-500">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-2xl flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-8">
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
