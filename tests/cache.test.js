import test from "node:test";
import assert from "node:assert/strict";
import { getCalendarMonths, readCachedPrayers, writeCachedPrayers } from "../src/Utils.js";

test("today's prayer cache only belongs to its saved city", (t) => {
  const previousStorage = globalThis.localStorage;
  const entries = new Map();
  globalThis.localStorage = {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, String(value)),
  };
  t.after(() => {
    globalThis.localStorage = previousStorage;
  });

  const prayers = { Fajr: "05:00", Dhuhr: "12:00" };
  entries.set("savedCity", JSON.stringify("9002"));
  writeCachedPrayers(prayers, "9002");

  assert.deepEqual(readCachedPrayers(), prayers);
  assert.deepEqual(readCachedPrayers("9003"), {});
  entries.set("savedCity", JSON.stringify("9003"));
  assert.deepEqual(readCachedPrayers(), {});
  entries.set("savedCity", JSON.stringify("9002"));
  entries.set("prayersDate", "2000-01-01");
  assert.deepEqual(readCachedPrayers(), {});
});

test("the 30-day timetable includes every month it reaches", () => {
  const months = getCalendarMonths("2026-01-31").map((date) => date.format("YYYY-MM"));
  assert.deepEqual(months, ["2026-01", "2026-02", "2026-03"]);

  const normalRange = getCalendarMonths("2026-10-29").map((date) => date.format("YYYY-MM"));
  assert.deepEqual(normalRange, ["2026-10", "2026-11"]);
});
