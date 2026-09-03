/* eslint-disable react/prop-types */
import Footer from "./Footer";

export default function DefaultLayout({ children }) {
  return (
    <div className="relative min-h-[100svh] bg-canvas text-ink transition-colors duration-500">
      <div className="zellij-bg pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-overlay" />
      <div className="pointer-events-none fixed -right-24 -top-24 h-72 w-72 rounded-full bg-teal-700/15 blur-[90px] dark:bg-teal-400/10" />
      <div className="pointer-events-none fixed -bottom-28 -left-20 h-80 w-80 rounded-full bg-amber-400/15 blur-[100px] dark:bg-amber-200/5" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] min-[400px]:px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
