import { NavLink, Outlet, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  {
    to: "/",
    label: "Resumen",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden>
        <path
          fill="currentColor"
          d="M4 20V10l8-6 8 6v10h-6v-6H10v6H4Z"
        />
      </svg>
    ),
  },
  {
    to: "/subir",
    label: "Subir PDF",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden>
        <path
          d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/revision",
    label: "Revisión",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
        />
      </svg>
    ),
  },
  {
    to: "/graficas",
    label: "Gráficas",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden>
        <path
          fill="currentColor"
          d="M4 19h16v2H4v-2Zm2-3h3V8H6v8Zm5 0h3V4h-3v12Zm5 0h3v-6h-3v6Z"
        />
      </svg>
    ),
  },
  {
    to: "/inversion",
    label: "Inversión",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" aria-hidden>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16 10 10l4 4 6-8"
        />
      </svg>
    ),
  },
];

const titles = {
  "/": "Resumen",
  "/subir": "Subir PDF",
  "/revision": "Revisión",
  "/graficas": "Gráficas",
  "/inversion": "Inversión",
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "AhorraPiero";

  return (
    <div className="min-h-full flex flex-col">
      <header
        className="chrome chrome-top sticky top-0 z-20 pt-[env(safe-area-inset-top)]"
      >
        <div className="px-4 py-1.5 flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold tracking-tight text-[color:var(--muted)]">
            AhorraPiero
          </p>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <h1 className="display mb-4">{title}</h1>
        <Outlet />
      </main>
      <nav
        className="chrome chrome-bottom fixed bottom-0 inset-x-0 z-20 pb-[env(safe-area-inset-bottom)]"
        aria-label="Secciones"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `pressable flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                  isActive ? "text-brand-600" : "text-[color:var(--muted)]"
                }`
              }
            >
              {l.icon}
              <span className="whitespace-nowrap">{l.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
