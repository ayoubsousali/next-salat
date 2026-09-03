import { motion } from "framer-motion";
import arabicName, { pad2, splitCountdown } from "../Utils";
import { PrayerIcon } from "./PrayerIcon";

function CountUnit({ value, label }) {
  return (
    <div className="flex min-w-[3.25rem] flex-col items-center min-[380px]:min-w-[3.75rem]">
      <span className="font-time text-2xl font-semibold leading-none tracking-wide min-[380px]:text-3xl sm:text-4xl">
        {pad2(value)}
      </span>
      <span className="mt-1.5 text-[10px] text-white/70 min-[380px]:text-xs">{label}</span>
    </div>
  );
}

export default function NextPrayerHero({ name, time, remaining, progress }) {
  if (!name || !time) {
    return (
      <div className="hero-wash h-48 animate-pulse rounded-3xl shadow-hero min-[400px]:h-56 lg:h-[22rem]" />
    );
  }

  const { h, m, s } = splitCountdown(remaining);
  const arabic = arabicName(name);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      aria-live="polite"
      className="hero-wash relative overflow-hidden rounded-3xl p-3.5 text-white shadow-hero min-[400px]:p-5 sm:p-7 lg:min-h-[22rem] lg:p-8"
    >
      <div className="pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -left-4 top-14 h-20 w-20 rounded-full border border-amber-200/20" />

      <div className="relative flex h-full flex-col justify-between gap-3 min-[400px]:gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-amber-200/90 min-[400px]:text-xs">
              الصلاة التالية
            </p>
            <h2 className="mt-1 text-3xl leading-tight min-[400px]:text-4xl lg:text-5xl">
              {arabic}
            </h2>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm min-[400px]:h-12 min-[400px]:w-12">
            <PrayerIcon name={name} onDark className="h-6 w-6 text-amber-200" />
          </div>
        </div>

        <p className="font-time text-4xl font-semibold leading-none min-[400px]:text-5xl lg:text-6xl">
          {time}
        </p>

        <div>
          <p className="mb-2 text-[11px] text-white/70 min-[400px]:text-xs">متبقي للأذان</p>
          <div className="flex items-end gap-1 min-[380px]:gap-2">
            <CountUnit value={h} label="ساعة" />
            <span className="mb-5 text-xl text-white/40">:</span>
            <CountUnit value={m} label="دقيقة" />
            <span className="mb-5 hidden text-xl text-white/40 min-[360px]:inline">:</span>
            <div className="hidden min-[360px]:block">
              <CountUnit value={s} label="ثانية" />
            </div>
          </div>
        </div>

        <div>
          <div className="relative h-2 rounded-full bg-white/25">
            <motion.div
              className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-amber-200 to-teal-300"
              initial={false}
              animate={{ width: `${Math.max(2, Math.round(progress * 100))}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <p className="mt-2 hidden text-[11px] text-white/55 min-[400px]:block">
            تقدم الوقت حتى الصلاة التالية
          </p>
        </div>
      </div>
    </motion.section>
  );
}
