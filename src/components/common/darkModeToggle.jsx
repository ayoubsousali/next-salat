import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

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
    if (theme === "dark") {
      document.documentElement.classList.add("dark");

      let themeColorMeta = document.querySelector("meta[name=theme-color]");
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#1c1c1e");
      }
    } else {
      document.documentElement.classList.remove("dark");

      let themeColorMeta = document.querySelector("meta[name=theme-color]");
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#f2f2f7");
      }
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    localStorage.theme = t;
  };

  return (
    <button
      type="button"
      className="p-3 rounded-full bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-sm border border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300"
      onClick={handleThemeSwitch}
      title="Dark mode toggle"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-500" />
      )}
    </button>
  );
}
