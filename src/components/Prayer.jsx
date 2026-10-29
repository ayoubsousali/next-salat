import arabicName, { cn } from "../Utils";

export default function Prayer({ name, time, isNext, isPassed }) {
  return (
    <li
      aria-current={isNext ? "true" : undefined}
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 border-b border-black/5 px-3 py-2.5 last:border-b-0 dark:border-white/10",
        isNext
          ? "rounded-xl border-transparent bg-teal-800/[0.08] font-semibold text-ink dark:bg-teal-300/10 dark:text-ink"
          : isPassed
            ? "text-muted"
            : "text-ink",
      )}
    >
      <span className="flex items-center gap-2.5">
        {isNext && <span className="h-1.5 w-1.5 rounded-full bg-teal-700 dark:bg-teal-300" aria-hidden="true" />}
        {arabicName(name)}
      </span>
      <time dateTime={time} className="font-time shrink-0 text-base">
        {time}
      </time>
    </li>
  );
}
