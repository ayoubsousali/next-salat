import dayjs from "dayjs";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays } from "lucide-react";
import Spinner from "./common/spinner";
import Prayer from "./Prayer";
import SelectCities from "./SelectCities";
import PullToRefresh from "./common/pullToRefresh";

export default function Main() {
  const [prayers, setPrayers] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const prayersArr = Object.entries(prayers);

  const nextPrayers = prayersArr.filter((prayer) => {
    const time = dayjs();
    const dateToday = dayjs().format("YYYY-MM-DD");
    return dayjs(`${dateToday} ${prayer[1]}`).isAfter(time);
  });
  const nextPrayer = nextPrayers.length > 0 ? nextPrayers[0] : prayersArr[0];

  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const dateFormatted = new Intl.DateTimeFormat("ar-MA", options).format(date);

  return (
    <main
      key={refreshKey}
      className="w-full flex flex-col items-center"
    >
      <PullToRefresh onRefresh={handleRefresh} />

      <div className="w-full max-w-md px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold font-serif text-slate-800 dark:text-white mb-2 drop-shadow-sm">
            أوقات الصلاة
          </h1>
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-black/20 backdrop-blur-md py-1.5 px-4 rounded-full mx-auto w-fit">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium pt-1">{dateFormatted}</span>
          </div>
        </motion.div>

        {/* Glass Card Container */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>المدينة</span>
              </label>
            </div>
            <SelectCities setPrayers={setPrayers} />
          </div>

          <div className="space-y-1">
            {prayersArr && prayersArr.length > 0 ? (
              prayersArr.map((prayer, index) => (
                <Prayer
                  key={prayer[0]}
                  name={prayer[0]}
                  time={prayer[1]}
                  isNext={prayer[0] === nextPrayer[0]}
                  index={index}
                />
              ))
            ) : (
              <div className="py-20 flex justify-center">
                <Spinner />
              </div>
            )}
          </div>
        </div>

        {/* Footer Credit */}
        <div className="text-center mt-8 text-xs text-slate-400 dark:text-slate-600">
          تقبل الله صلاتكم
        </div>
      </div>
    </main>
  );
}
