/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import wretch from "wretch";
import { Check, ChevronDown, MapPin, Search, X } from "lucide-react";
import FetchTodayTimes from "./FetchTodayTimes";
import { cn, normalizeAr } from "../Utils";

export default function SelectCities({ setPrayers, setLoading }) {
  const [cities, setCities] = useState([]);
  const [selectedOption, setSelectedOption] = useState("9002");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const titleId = useId();

  const getCities = () => {
    wretch("cities.json")
      .get()
      .json((json) => {
        const sorted = json
          .map((city) => ({
            id: city?.id,
            name: city?.name,
            lat: city?.lat,
            lng: city?.lng,
          }))
          .sort((a, b) => a.name.localeCompare(b.name, "ar"));
        setCities(sorted);
      });
  };

  const handleChange = (value) => {
    setSelectedOption(value);
    localStorage.setItem("savedCity", JSON.stringify(value));
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    try {
      const savedCity = JSON.parse(localStorage.getItem("savedCity"));
      if (savedCity) setSelectedOption(String(savedCity));
    } catch {
      /* keep default city */
    }
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
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
        cities={cities}
        setLoading={setLoading}
      />

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={selectedCity ? `المدينة: ${selectedCity.name}` : "اختر المدينة"}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white/75 px-3 py-2.5 text-right shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60 min-[400px]:px-4"
      >
        <span className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
          <span className="truncate text-base text-ink min-[400px]:text-lg">
            {selectedCity?.name || (String(selectedOption) === "9002" ? "الرباط" : "اختر المدينة")}
          </span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
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
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex h-[min(82svh,40rem)] w-full flex-col rounded-t-3xl bg-canvas shadow-2xl sm:h-auto sm:max-h-[min(80vh,40rem)] sm:max-w-md sm:rounded-3xl"
            >
              <div className="relative px-4 pt-3 sm:pt-5">
                <div className="mx-auto h-1 w-10 rounded-full bg-black/15 sm:hidden dark:bg-white/20" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute left-2 top-2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 pb-3">
                <h2 id={titleId} className="text-lg text-ink">
                  اختر المدينة
                </h2>
                <p className="mt-0.5 text-xs text-muted">{cities.length} مدينة</p>
                <label className="mt-3 flex min-h-12 items-center gap-2 rounded-2xl border border-black/5 bg-white/80 px-3 dark:border-white/10 dark:bg-white/10">
                  <Search className="h-4 w-4 text-muted" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="بحث عن مدينة..."
                    className="h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
                  />
                </label>
              </div>

              <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                {filteredCities.length === 0 ? (
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
