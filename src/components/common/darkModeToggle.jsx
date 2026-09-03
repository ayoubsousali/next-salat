import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;
    const themeColorMeta = document.querySelector("meta[name=theme-color]");

    if (theme === "dark") {
      root.classList.add("dark");
      themeColorMeta?.setAttribute("content", "#06110f");
    } else {
      root.classList.remove("dark");
      themeColorMeta?.setAttribute("content", "#f4efe4");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.theme = next;
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleThemeSwitch}
      title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
      aria-pressed={isDark}
      aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-black/5 bg-white/70 text-teal-800 shadow-sm backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
