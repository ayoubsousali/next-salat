import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const activeItemRef = useRef(null);
  const scrollerRef = useRef(null);
  const focusSelectedRef = useRef(false);

  const days = useMemo(() => {
    const today = now.startOf("day");
    return Array.from({ length: daysBefore + daysAfter + 1 }, (_, index) => {
      const date = today.add(index - daysBefore, "day");
      return {
        date,
        key: getDateKey(date),
        label: formatDayLabel(date, now),
        number: formatDayNumber(date),
        month: formatMonthArabic(date),
      };
    });
  }, [now, daysBefore, daysAfter]);

  const currentIndex = days.findIndex((day) => day.key === selectedDateKey);

  useEffect(() => {
    const active = activeItemRef.current;
    const scroller = scrollerRef.current;
    if (!active || !scroller) return;

    if (focusSelectedRef.current) {
      active.focus({ preventScroll: true });
      focusSelectedRef.current = false;
    }
    const item = active.getBoundingClientRect();
    const viewport = scroller.getBoundingClientRect();
    scroller.scrollBy({
      left: item.left + item.width / 2 - (viewport.left + viewport.width / 2),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [selectedDateKey]);

  const stepDay = (delta) => {
    const nextDay = days[currentIndex + delta];
    if (nextDay) onSelectDate(nextDay.key, nextDay.date);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => stepDay(-1)}
        disabled={currentIndex <= 0}
        aria-label="اليوم السابق"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={scrollerRef}
        role="tablist"
        aria-label="اختر يوماً"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const delta = event.key === "ArrowLeft" ? 1 : -1;
            if (days[currentIndex + delta]) {
              focusSelectedRef.current = true;
              stepDay(delta);
            }
          }
        }}
        className="flex min-w-0 flex-1 gap-1 overflow-x-auto overscroll-x-contain py-1"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((day) => {
          const selected = day.key === selectedDateKey;
          return (
            <button
              key={day.key}
              ref={selected ? activeItemRef : null}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              aria-label={`${day.label} ${day.number} ${day.month}`}
              onClick={() => onSelectDate(day.key, day.date)}
              className={cn(
                "flex min-h-14 min-w-14 shrink-0 flex-col items-center justify-center rounded-xl px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60",
                selected
                  ? "bg-teal-800 text-white dark:bg-teal-700"
                  : "text-muted hover:bg-black/5 dark:hover:bg-white/10",
              )}
            >
              <span className="text-[11px]">{day.label}</span>
              <span className="font-time mt-0.5 font-semibold">{day.number}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => stepDay(1)}
        disabled={currentIndex < 0 || currentIndex >= days.length - 1}
        aria-label="اليوم التالي"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-black/5 disabled:opacity-30 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
}
