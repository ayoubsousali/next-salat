import { useState, useEffect } from "react";

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
      className="p-4"
      onClick={handleThemeSwitch}
      title="Dark mode toggle"
    >
      {theme === "dark" ? (
        <img src="sun.svg" alt="Light Mode" />
      ) : (
        <img src="moon.svg" alt="Dark Mode" />
      )}
    </button>
  );
}
