/* eslint-disable react/prop-types */
import Footer from './Footer';

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 font-serif text-slate-900 dark:text-slate-50 transition-colors duration-500">

      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="flex-grow flex flex-col items-center w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
