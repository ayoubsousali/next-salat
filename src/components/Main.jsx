import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import DarkModeToggle from "./common/darkModeToggle";
import PullToRefresh from "./common/pullToRefresh";
import DayScroller from "./DayScroller";
import NextPrayerHero from "./NextPrayerHero";
import Prayer from "./Prayer";
import SelectCities from "./SelectCities";
import {
  formatCountdownAr,
  formatDayLabel,
  formatGregorian,
  formatHijri,
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
          className="h-14 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10"
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

  // Touch gesture refs for swipe navigation
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(getNowUtc()), 1000);
    return () => clearInterval(id);
  }, []);

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

  const handleStepDay = (delta) => {
    const nextDate = selectedDate.add(delta, "day");
    const nextKey = getDateKey(nextDate);
    setSelectedDate(nextDate);
    setSelectedDateKey(nextKey);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum horizontal swipe distance of 45px with predominantly horizontal direction
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        // Swipe left in RTL -> forward into next day
        handleStepDay(1);
      } else {
        // Swipe right in RTL -> backward into previous day
        handleStepDay(-1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const todayKey = getDateKey(now);
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
  const selectedHijri =
    calendarData[selectedDateKey]?.hijri
      ? `${calendarData[selectedDateKey].hijri.day} ${calendarData[selectedDateKey].hijri.month?.ar || ""} ${calendarData[selectedDateKey].hijri.year}`
      : formatHijri(selectedDate);

  const currentHijri = formatHijri(now);

  return (
    <main key={refreshKey} className="flex w-full flex-1 flex-col">
      <PullToRefresh onRefresh={handleRefresh} />

      <header className="mb-4 flex items-start justify-between gap-3 sm:mb-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl leading-tight text-ink min-[400px]:text-2xl sm:text-3xl">
              أوقات الصلاة
            </h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-600/20 bg-teal-800/10 px-2 py-0.5 text-[11px] font-medium text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-300"
              title="التطبيق مضبوط على توقيت غرينتش (UTC+0)"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse dark:bg-teal-400" />
              <span>غرينتش (UTC)</span>
              <span className="font-time font-semibold">{now.format("HH:mm")}</span>
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <p className="text-xs min-[400px]:text-sm">{formatGregorian(now)}</p>
            {currentHijri ? (
              <>
                <span className="hidden text-muted/50 min-[360px]:inline">·</span>
                <p className="w-full text-xs min-[360px]:w-auto min-[400px]:text-sm">
                  {currentHijri}
                </p>
              </>
            ) : null}
          </div>
        </div>
        <DarkModeToggle />
      </header>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12 md:gap-6 lg:gap-8">
        <div className="md:col-span-5 md:col-start-8">
          <SelectCities
            setPrayers={setPrayers}
            setCalendarData={setCalendarData}
            setLoading={setLoading}
          />
        </div>

        <div className="md:col-span-7 md:col-start-1 md:row-span-2 md:row-start-1">
          <div className="md:sticky md:top-6">
            <NextPrayerHero
              name={nextPrayer?.[0]}
              time={nextPrayer?.[1]}
              remaining={remaining}
              progress={progress}
              isToday={isToday}
              selectedDayLabel={`${selectedDayLabel} (${selectedDate.format("D")} ${formatMonthArabic(selectedDate)})`}
              onResetToday={handleResetToday}
            />
          </div>
        </div>

        <section className="md:col-span-5 md:col-start-8">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="rounded-3xl border border-black/5 bg-white/70 p-3 shadow-card backdrop-blur-md dark:border-white/10 dark:bg-white/5 min-[400px]:p-4"
          >
            {/* Horizontal Day Scroller */}
            <div className="mb-3">
              <DayScroller
                selectedDateKey={selectedDateKey}
                onSelectDate={handleSelectDate}
                now={now}
              />
            </div>

            {/* Divider between DayScroller and Timetable */}
            <div className="mb-3 border-t border-black/5 dark:border-white/10" />

            {/* Timetable Header */}
            <div className="mb-2 flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  {isToday ? "جدول اليوم" : `جدول ${selectedDayLabel}`}
                </h2>
                {selectedHijri && (
                  <p className="text-[11px] text-muted">{selectedHijri}</p>
                )}
              </div>
              {loading && prayersArr.length > 0 ? (
                <span className="text-[11px] text-muted">تحديث...</span>
              ) : null}
            </div>

            {/* Timetable Prayer List with Motion Transition */}
            {prayersArr.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.ul
                  key={selectedDateKey}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className={loading ? "opacity-70 transition-opacity" : ""}
                >
                  {prayersArr.map((prayer, index) => {
                    const isNext = isToday && nextPrayer?.[0] === prayer[0];
                    const isPassed = isToday
                      ? !isNext && isPrayerPassed(prayer[1], now)
                      : isPastDay;

                    return (
                      <Prayer
                        key={prayer[0]}
                        name={prayer[0]}
                        time={prayer[1]}
                        isNext={isNext}
                        isPassed={isPassed}
                        remainingLabel={isNext ? formatCountdownAr(remaining) : null}
                        index={index}
                      />
                    );
                  })}
                </motion.ul>
              </AnimatePresence>
            ) : (
              <PrayerSkeleton />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

