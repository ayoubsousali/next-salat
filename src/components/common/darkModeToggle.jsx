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
      themeColorMeta?.setAttribute("content", "#101b19");
    } else {
      root.classList.remove("dark");
      themeColorMeta?.setAttribute("content", "#f5f7f5");
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
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-black/5 hover:text-ink dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/60"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
