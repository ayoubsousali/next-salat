/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import wretch from "wretch";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import FetchTodayTimes from "./FetchTodayTimes";
import { cn, normalizeAr } from "../Utils";

export default function SelectCities({ setPrayers, setLoading, setCalendarData, refreshKey }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState(() => {
    try {
      return String(JSON.parse(localStorage.getItem("savedCity")) || "9002");
    } catch {
      return "9002";
    }
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cityLoadError, setCityLoadError] = useState(false);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();

  const getCities = () => {
    setCityLoadError(false);
    wretch("cities.json")
      .get()
      .json((json) => {
        if (!Array.isArray(json) || json.length === 0) throw new Error("Empty city list");
        const sorted = json
          .map((city) => ({
            id: city?.id,
            name: city?.name,
            lat: city?.lat,
            lng: city?.lng,
          }))
          .sort((a, b) => a.name.localeCompare(b.name, "ar"));
        setCities(sorted);
        if (!sorted.some((city) => String(city.id) === selectedOption)) {
          setPrayers({});
          setCalendarData({});
          setSelectedOption("9002");
          try {
            localStorage.setItem("savedCity", JSON.stringify("9002"));
          } catch {
            /* storage may be unavailable */
          }
        }
      })
      .catch(() => {
        setCityLoadError(true);
        setLoading(false);
      });
  };

  const handleChange = (value) => {
    if (value !== selectedOption) {
      setPrayers({});
      setCalendarData({});
      setLoading(true);
      setSelectedOption(value);
      try {
        localStorage.setItem("savedCity", JSON.stringify(value));
      } catch {
        /* storage may be unavailable */
      }
    }
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!cities.length) getCities();
  }, [refreshKey]);


  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      } else if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll("button:not([disabled]), input:not([disabled])");
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    const focusFrame = requestAnimationFrame(() => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        closeRef.current?.focus({ preventScroll: true });
      } else {
        searchRef.current?.focus({ preventScroll: true });
      }
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  const selectedCity = cities.find((city) => String(city.id) === String(selectedOption));
  const filteredCities = useMemo(() => {
    const needle = normalizeAr(query).trim();
    if (!needle) return cities;
    return cities.filter((city) => normalizeAr(city.name).includes(needle));
  }, [cities, query]);

  return (
    <div className="relative w-full">
      <FetchTodayTimes
        cityId={selectedOption}
        setPrayers={setPrayers}
        setCalendarData={setCalendarData}
        cities={cities}
        setLoading={setLoading}
        refreshKey={refreshKey}
      />

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selectedCity ? `المدينة: ${selectedCity.name}` : "اختر المدينة"}
        className="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-black/5 bg-white px-4 py-2 text-right transition-colors hover:border-teal-800/25 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
      >
        <span className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-muted" />
          <span className="truncate text-sm font-medium text-ink">
            {selectedCity?.name || (String(selectedOption) === "9002" ? "الرباط" : "اختر المدينة")}
          </span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4">
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
            />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex h-[min(82dvh,40rem)] w-full flex-col rounded-t-3xl bg-canvas shadow-2xl sm:h-auto sm:max-h-[min(80dvh,40rem)] sm:max-w-md sm:rounded-3xl"
            >
              <div className="relative px-4 pt-3 sm:pt-5">
                <div className="mx-auto h-1 w-10 rounded-full bg-black/15 sm:hidden dark:bg-white/20" />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute left-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 pb-3">
                <h2 id={titleId} className="text-lg text-ink">
                  اختر المدينة
                </h2>

                <label className="mt-3 flex min-h-12 items-center gap-2 rounded-2xl border border-black/5 bg-white/80 px-3 dark:border-white/10 dark:bg-white/10">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    ref={searchRef}
                    type="search"
                    aria-label="ابحث عن مدينة"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="ابحث عن مدينة"
                    className="h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
                  />
                </label>
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {cityLoadError ? (
                  <li className="px-3 py-6 text-center">
                    <p className="text-sm text-muted">تعذر تحميل المدن</p>
                    <button type="button" onClick={getCities} className="mt-2 min-h-11 rounded-lg px-4 text-sm text-teal-800 dark:text-teal-300">إعادة المحاولة</button>
                  </li>
                ) : filteredCities.length === 0 ? (
                  <li className="px-3 py-8 text-center text-sm text-muted">لا توجد نتائج</li>
                ) : (
                  filteredCities.map((city) => {
                    const active = String(city.id) === String(selectedOption);
                    return (
                      <li key={city.id}>
                        <button
                          type="button"
                          onClick={() => handleChange(String(city.id))}
                          className={cn(
                            "flex min-h-12 w-full items-center justify-between rounded-xl px-3 py-2 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60",
                            active
                              ? "bg-teal-800 text-white dark:bg-teal-700"
                              : "text-ink hover:bg-black/[0.04] dark:hover:bg-white/10",
                          )}
                        >
                          <span className="text-base">{city.name}</span>
                          {active ? <Check className="h-4 w-4" /> : null}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
