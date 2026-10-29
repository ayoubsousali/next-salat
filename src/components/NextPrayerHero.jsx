import arabicName, { pad2, splitCountdown } from "../Utils";

export default function NextPrayerHero({ name, time, remaining, progress, loading, onRetry }) {
  if (!name || !time) {
    if (loading) return <div className="hero-wash h-36 animate-pulse rounded-2xl" aria-hidden="true" />;
    return (
      <section className="hero-wash flex min-h-[9rem] items-center justify-between gap-3 rounded-2xl px-5 text-white" role="status">
        <p className="text-sm">المواقيت غير متاحة</p>
        <button type="button" onClick={onRetry} className="min-h-11 shrink-0 rounded-xl border border-white/40 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          إعادة المحاولة
        </button>
      </section>
    );
  }

  const { h, m, s } = splitCountdown(remaining);

  return (
    <section className="hero-wash rounded-2xl px-5 py-5 text-white sm:px-6 sm:py-6">
      <p className="text-xs text-white/75">الصلاة القادمة</p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h2 className="text-3xl leading-tight sm:text-4xl">{arabicName(name)}</h2>
        <time dateTime={time} className="font-time shrink-0 text-2xl font-semibold sm:text-3xl">
          {time}
        </time>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/85">
        <span>متبقي</span>
        <span
          className="font-time font-semibold text-white"
          role="timer"
          aria-label={`${h} ساعة و ${m} دقيقة و ${s} ثانية`}
        >
          {pad2(h)}:{pad2(m)}:{pad2(s)}
        </span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/25" aria-hidden="true">
        <div
          className="h-full rounded-full bg-white/85 transition-[width] duration-500"
          style={{ width: `${Math.max(2, Math.round(progress * 100))}%` }}
        />
      </div>
    </section>
  );
}
