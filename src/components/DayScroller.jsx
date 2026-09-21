import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import {
  cn,
  formatDayLabel,
  formatDayNumber,
  formatMonthArabic,
  getDateKey,
  getNowUtc,
} from "../Utils";

export default function DayScroller({
  selectedDateKey,
  onSelectDate,
  now = getNowUtc(),
  daysBefore = 1,
  daysAfter = 30,
}) {
  const containerRef = useRef(null);
  const activeItemRef = useRef(null);

  // Generate list of days
  const days = useMemo(() => {
    const list = [];
    const today = now.clone().startOf("day");

    for (let i = -daysBefore; i <= daysAfter; i++) {
      const d = today.add(i, "day");
      const key = getDateKey(d);
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const isYesterday = i === -1;

      list.push({
        date: d,
        key,
        diff: i,
        isToday,
        isTomorrow,
        isYesterday,
        label: formatDayLabel(d, now),
        dayNumber: formatDayNumber(d),
        month: formatMonthArabic(d),
      });
    }
    return list;
  }, [now, daysBefore, daysAfter]);

  const currentIndex = days.findIndex((d) => d.key === selectedDateKey);
  const selectedDay = days[currentIndex] || days.find((d) => d.isToday) || days[0];
  const isViewingToday = selectedDay?.isToday;

  // Auto-scroll the selected item into view smoothly
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDateKey]);

  const handlePrevDay = () => {
    // In RTL, "previous day" is earlier in time (diff - 1, which is index - 1)
    if (currentIndex > 0) {
      onSelectDate(days[currentIndex - 1].key, days[currentIndex - 1].date);
    }
  };

  const handleNextDay = () => {
    // "next day" is later in time (diff + 1, which is index + 1)
    if (currentIndex < days.length - 1) {
      onSelectDate(days[currentIndex + 1].key, days[currentIndex + 1].date);
    }
  };

  const handleResetToday = () => {
    const todayItem = days.find((d) => d.isToday);
    if (todayItem) {
      onSelectDate(todayItem.key, todayItem.date);
    }
  };

  return (
    <div className="relative w-full">
      {/* Header bar above scroller: Current Day Name + Quick Actions */}
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-muted min-[400px]:text-sm">
            {isViewingToday
              ? "اليوم"
              : selectedDay?.isTomorrow
                ? "غداً"
                : selectedDay?.label}
          </span>
          <span className="text-xs text-muted/60">·</span>
          <span className="truncate text-xs text-muted/80 font-medium">
            {selectedDay?.dayNumber} {selectedDay?.month}
          </span>
          {!isViewingToday && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-teal-800/10 px-2 py-0.5 text-[10px] font-medium text-teal-800 dark:bg-teal-400/10 dark:text-teal-300">
              {selectedDay?.diff > 0 ? `+${selectedDay?.diff} يوم` : `${selectedDay?.diff} يوم`}
            </span>
          )}
        </div>

        {/* Action Controls: Arrows and Back-to-Today button */}
        <div className="flex items-center gap-1 shrink-0">
          {!isViewingToday && (
            <button
              type="button"
              onClick={handleResetToday}
              className="inline-flex items-center gap-1 rounded-xl bg-teal-800/10 px-2 py-1 text-xs font-medium text-teal-800 transition-colors hover:bg-teal-800/20 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
              title="العودة إلى اليوم"
            >
              <RotateCcw className="h-3 w-3" />
              <span>اليوم</span>
            </button>
          )}

          {/* Chevron Right: in RTL points right = Previous Day */}
          <button
            type="button"
            onClick={handlePrevDay}
            disabled={currentIndex <= 0}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 bg-white/70 text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20 dark:text-muted dark:hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600/60"
            aria-label="اليوم السابق"
            title="اليوم السابق"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Chevron Left: in RTL points left = Next Day */}
          <button
            type="button"
            onClick={handleNextDay}
            disabled={currentIndex >= days.length - 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/5 bg-white/70 text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-30 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20 dark:text-muted dark:hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-600/60"
            aria-label="اليوم التالي"
            title="اليوم التالي"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Day Strip */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label="أيام الأسبوع"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            // Next day in RTL
            handleNextDay();
          } else if (e.key === "ArrowRight") {
            // Prev day in RTL
            handlePrevDay();
          }
        }}
        className="flex w-full items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-2 pt-0.5 no-scrollbar snap-x snap-mandatory scroll-smooth focus-visible:outline-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {days.map((day) => {
          const isSelected = day.key === selectedDateKey;

          return (
            <button
              key={day.key}
              ref={isSelected ? activeItemRef : null}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectDate(day.key, day.date)}
              className={cn(
                "group relative flex shrink-0 snap-center flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-200 focus-visible:outline-none min-[400px]:px-3.5",
                isSelected
                  ? "bg-teal-800 text-white shadow-md shadow-teal-900/25 ring-2 ring-teal-600/30 dark:bg-teal-700 dark:ring-teal-400/40"
                  : "border border-black/5 bg-white/70 text-ink/80 hover:bg-white hover:text-ink hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-ink/80 dark:hover:bg-white/15 dark:hover:text-ink",
              )}
            >
              {/* Day label (اليوم / غداً / الأربعاء...) */}
              <span
                className={cn(
                  "text-[11px] font-medium leading-none min-[400px]:text-xs",
                  isSelected
                    ? "text-amber-200"
                    : day.isToday
                      ? "text-teal-700 dark:text-teal-300 font-semibold"
                      : "text-muted group-hover:text-ink dark:text-muted dark:group-hover:text-ink",
                )}
              >
                {day.label}
              </span>

              {/* Day number (21, 22...) */}
              <span
                className={cn(
                  "mt-1 font-time text-base font-semibold leading-none min-[400px]:text-lg",
                  isSelected
                    ? "text-white"
                    : "text-ink dark:text-ink",
                )}
              >
                {day.dayNumber}
              </span>

              {/* Month or Today Indicator Dot */}
              <span
                className={cn(
                  "mt-0.5 text-[9px] leading-tight min-[400px]:text-[10px]",
                  isSelected
                    ? "text-white/70"
                    : "text-muted/70",
                )}
              >
                {day.month}
              </span>

              {/* Visual dot indicator for Today when not selected */}
              {day.isToday && !isSelected && (
                <span
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-teal-600 dark:bg-teal-400"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
