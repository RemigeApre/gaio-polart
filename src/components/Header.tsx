"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

function LogoPlaceholder() {
  return (
    <div className="w-9 h-9 rounded-full border border-or/40 flex items-center justify-center bg-or/10">
      <span className="text-or text-base font-bold">G</span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-blanc/25 hover:border-blanc/60 hover:bg-blanc/10 transition-all text-blanc/70 hover:text-blanc"
      aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
      title={theme === "light" ? "Mode sombre" : "Mode clair"}
    >
      {theme === "light" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}

function LoginButton() {
  return (
    <button
      disabled
      className="w-9 h-9 flex items-center justify-center rounded-full border border-blanc/25 text-blanc/40 cursor-not-allowed"
      title="Bientôt disponible"
      aria-label="Connexion"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </button>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/marches", label: "Marchés" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`text-sm uppercase tracking-[0.12em] transition-colors ${
        active
          ? "text-or font-semibold"
          : "text-blanc/60 hover:text-blanc font-medium"
      }`}
    >
      {label}
    </a>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-noir sticky top-0 z-50 relative">
      <div className="max-w-6xl mx-auto w-full px-5 py-3.5 flex items-center justify-between">
        {/* Logo + Nom */}
        <a href="/" className="flex items-center gap-3 shrink-0">
          <LogoPlaceholder />
          <div>
            <h1 className="text-base text-blanc font-light tracking-[0.25em] uppercase leading-tight">
              Gaio Polart
            </h1>
            <p className="text-blanc/40 text-[10px] tracking-[0.2em] uppercase">
              Volailles &amp; Gibier
            </p>
          </div>
        </a>

        {/* Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ThemeToggle />
          <LoginButton />
        </div>
      </div>

      {/* Navigation — centrée sur la page, indépendante */}
      <nav className="absolute inset-0 flex items-center justify-center gap-6 pointer-events-none">
        {NAV_LINKS.map(({ href, label }) => (
          <span key={href} className="pointer-events-auto">
            <NavLink
              href={href}
              label={label}
              active={pathname === href}
            />
          </span>
        ))}
      </nav>
    </header>
  );
}
