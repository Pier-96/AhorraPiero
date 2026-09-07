import { useEffect, useState } from "react";

const STORAGE_KEY = "ahorrapiero-theme";

function initialTheme() {
  return localStorage.getItem(STORAGE_KEY) || "system";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.dataset.theme = theme;
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      className="pressable flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--muted)] hover:bg-black/5 dark:hover:bg-white/10"
      onClick={() => setTheme(nextTheme)}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Activar modo claro" : "Activar modo oscuro"}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5A6 6 0 0 1 12 4.5Zm0-2.5h.01M12 22h.01M3.5 12h.01M20.5 12h.01M5.99 5.99 6 6M18 18l.01.01M18.01 5.99 18 6M6 18l-.01.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true"><path fill="currentColor" d="M20.6 15.7A8 8 0 0 1 8.3 3.4 8 8 0 1 0 20.6 15.7Z" /></svg>
      )}
    </button>
  );
}
