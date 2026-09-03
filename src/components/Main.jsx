import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import DarkModeToggle from "./common/darkModeToggle";
import PullToRefresh from "./common/pullToRefresh";
import NextPrayerHero from "./NextPrayerHero";
import Prayer from "./Prayer";
import SelectCities from "./SelectCities";
import {
  formatCountdownAr,
  formatGregorian,
  formatHijri,
  getNextPrayer,
  intervalProgress,
  isPrayerPassed,
  readCachedPrayers,
  remainingSeconds,
} from "../Utils";

function PrayerSkeleton() {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10"
        />
      ))}
    </div>
  );
}

export default function Main() {
  const [prayers, setPrayers] = useState(readCachedPrayers);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const prayersArr = Object.entries(prayers);
  const nextPrayer = getNextPrayer(prayers, now);
  const remaining = nextPrayer ? remainingSeconds(nextPrayer[1], now) : 0;
  const progress = nextPrayer ? intervalProgress(prayers, nextPrayer[0], now) : 0;
  const hijri = formatHijri();

  return (
    <main key={refreshKey} className="flex w-full flex-1 flex-col">
      <PullToRefresh onRefresh={handleRefresh} />

      <header className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <h1 className="text-xl leading-tight text-ink min-[400px]:text-2xl sm:text-3xl">
            أوقات الصلاة
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <p className="text-xs min-[400px]:text-sm">{formatGregorian()}</p>
            {hijri ? (
              <>
                <span className="hidden text-muted/50 min-[360px]:inline">·</span>
                <p className="w-full text-xs min-[360px]:w-auto min-[400px]:text-sm">{hijri}</p>
              </>
            ) : null}
          </div>
        </div>
        <DarkModeToggle />
      </header>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12 md:gap-6 lg:gap-8">
        <div className="md:col-span-5 md:col-start-8">
          <SelectCities setPrayers={setPrayers} setLoading={setLoading} />
        </div>

        <div className="md:col-span-7 md:col-start-1 md:row-span-2 md:row-start-1">
          <div className="md:sticky md:top-6">
            <NextPrayerHero
              name={nextPrayer?.[0]}
              time={nextPrayer?.[1]}
              remaining={remaining}
              progress={progress}
            />
          </div>
        </div>

        <section className="md:col-span-5 md:col-start-8">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-2 shadow-card backdrop-blur-md dark:border-white/10 dark:bg-white/5 min-[400px]:p-3">
            <div className="mb-1 flex items-center justify-between px-2 pt-1">
              <h2 className="text-sm text-muted">جدول اليوم</h2>
              {loading && prayersArr.length > 0 ? (
                <span className="text-[11px] text-muted">تحديث...</span>
              ) : null}
            </div>
            {prayersArr.length > 0 ? (
              <ul className={loading ? "opacity-70 transition-opacity" : ""}>
                {prayersArr.map((prayer, index) => {
                  const isNext = nextPrayer?.[0] === prayer[0];
                  return (
                    <Prayer
                      key={prayer[0]}
                      name={prayer[0]}
                      time={prayer[1]}
                      isNext={isNext}
                      isPassed={!isNext && isPrayerPassed(prayer[1], now)}
                      remainingLabel={isNext ? formatCountdownAr(remaining) : null}
                      index={index}
                    />
                  );
                })}
              </ul>
            ) : (
              <PrayerSkeleton />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
