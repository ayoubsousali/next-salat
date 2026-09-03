import { motion } from "framer-motion";
import arabicName, { cn } from "../Utils";
import { PrayerIcon } from "./PrayerIcon";

export default function Prayer({ name, time, isNext, isPassed, remainingLabel, index }) {
  const arabic = arabicName(name);

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.04 }}
      aria-current={isNext ? "true" : undefined}
      className={cn(
        "relative flex min-h-[3.25rem] items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors min-[400px]:min-h-[3.5rem] min-[400px]:px-4 min-[400px]:py-3",
        isNext
          ? "bg-teal-800 text-white shadow-md dark:bg-teal-700"
          : isPassed
            ? "text-muted opacity-50"
            : "text-ink hover:bg-black/[0.03] dark:hover:bg-white/[0.04]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
            isNext ? "bg-white/15" : "bg-teal-800/10 dark:bg-white/10",
          )}
        >
          <PrayerIcon
            name={name}
            onDark={isNext}
            className={cn("h-5 w-5", isNext && "text-amber-100")}
          />
        </div>
        <div className="min-w-0">
          <p className={cn("truncate text-base min-[400px]:text-lg", isNext && "font-semibold")}>
            {arabic}
          </p>
          {isNext && remainingLabel ? (
            <p className="text-[11px] text-amber-100 min-[400px]:text-xs">متبقي {remainingLabel}</p>
          ) : null}
        </div>
      </div>

      <time
        dateTime={time}
        className={cn(
          "font-time shrink-0 text-lg min-[400px]:text-xl",
          isNext ? "font-semibold text-amber-100" : isPassed ? "text-current" : "text-ink",
        )}
      >
        {time}
      </time>
    </motion.li>
  );
}
