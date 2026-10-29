import { useEffect, useRef, useState } from "react";
import DarkModeToggle from "./common/darkModeToggle";
import PullToRefresh from "./common/pullToRefresh";
import DayScroller from "./DayScroller";
import NextPrayerHero from "./NextPrayerHero";
import Prayer from "./Prayer";
import SelectCities from "./SelectCities";
import {
  formatDayLabel,
  formatGregorian,
  formatMonthArabic,
  getDateKey,
  getNextPrayer,
  getNowUtc,
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
          className="h-12 animate-pulse rounded-lg bg-black/5 dark:bg-white/10"
        />
      ))}
    </div>
  );
}

export default function Main() {
  const [prayers, setPrayers] = useState(readCachedPrayers);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [now, setNow] = useState(getNowUtc);

  // Selected date state for viewing upcoming/previous timetables
  const [selectedDate, setSelectedDate] = useState(getNowUtc);
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey(getNowUtc()));
  const todayKey = getDateKey(now);
  const previousTodayKey = useRef(todayKey);

  useEffect(() => {
    const id = setInterval(() => setNow(getNowUtc()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (todayKey === previousTodayKey.current) return;
    if (selectedDateKey === previousTodayKey.current) {
      setSelectedDate(now);
      setSelectedDateKey(todayKey);
    }
    previousTodayKey.current = todayKey;
    setPrayers({});
    setCalendarData({});
    setRefreshKey((key) => key + 1);
  }, [todayKey, now, selectedDateKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleSelectDate = (dateKey, dateObj) => {
    setSelectedDateKey(dateKey);
    setSelectedDate(dateObj);
  };

  const handleResetToday = () => {
    const today = getNowUtc();
    setSelectedDate(today);
    setSelectedDateKey(getDateKey(today));
  };

  const isToday = selectedDateKey === todayKey;
  const isPastDay = selectedDate.startOf("day").isBefore(now.startOf("day"));

  // Prayers for today (for hero countdown)
  const nextPrayer = getNextPrayer(prayers, now);
  const remaining = nextPrayer ? remainingSeconds(nextPrayer[1], now) : 0;
  const progress = nextPrayer ? intervalProgress(prayers, nextPrayer[0], now) : 0;

  // Active prayers to display in the timetable (for the selected date)
  const selectedTimings =
    (calendarData[selectedDateKey]?.timings) || (isToday ? prayers : {});
  const prayersArr = Object.entries(selectedTimings);

  const selectedDayLabel = formatDayLabel(selectedDate, now);

  return (
    <main className="flex w-full flex-1 flex-col">
      <PullToRefresh onRefresh={() => { if (!loading) handleRefresh(); }} />

      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">أوقات الصلاة</h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span>{formatGregorian(now)}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={now.format("HH:mm")} title="توقيت غرينتش (UTC)" className="font-time">
              UTC {now.format("HH:mm")}
            </time>
          </div>
        </div>
        <DarkModeToggle />
      </header>

      <div className="mb-3">
        <SelectCities
          setPrayers={setPrayers}
          setCalendarData={setCalendarData}
          setLoading={setLoading}
          refreshKey={refreshKey}
        />
      </div>

      <NextPrayerHero
        name={nextPrayer?.[0]}
        time={nextPrayer?.[1]}
        remaining={remaining}
        progress={progress}
        loading={loading}
        onRetry={handleRefresh}
      />

      <section className="mt-4 rounded-2xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-white/5 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          <h2 className="text-sm font-semibold text-ink sm:text-base">
            {selectedDayLabel}، {selectedDate.format("D")} {formatMonthArabic(selectedDate)}
          </h2>
          {!isToday && (
            <button
              type="button"
              onClick={handleResetToday}
              className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-medium text-teal-800 hover:bg-teal-800/5 dark:text-teal-300 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
            >
              اليوم
            </button>
          )}
        </div>

        <DayScroller selectedDateKey={selectedDateKey} onSelectDate={handleSelectDate} now={now} />

        <div className="mt-2 border-t border-black/5 pt-1 dark:border-white/10" aria-busy={loading}>
          {prayersArr.length > 0 ? (
            <ul key={selectedDateKey}>
              {prayersArr.map(([name, time]) => {
                const isNext = isToday && nextPrayer?.[0] === name;
                const isPassed = isToday
                  ? !isNext && isPrayerPassed(time, now)
                  : isPastDay;

                return (
                  <Prayer
                    key={name}
                    name={name}
                    time={time}
                    isNext={isNext}
                    isPassed={isPassed}
                  />
                );
              })}
            </ul>
          ) : loading ? (
            <PrayerSkeleton />
          ) : (
            <p className="py-6 text-center text-sm text-muted">المواقيت غير متاحة</p>
          )}
        </div>
      </section>
    </main>
  );
}

