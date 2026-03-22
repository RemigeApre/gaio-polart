"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

function LogoPlaceholder() {
  return (
    <div className="w-9 h-9 rounded-full border border-or/30 flex items-center justify-center bg-or/[0.07] group-hover:border-or/50">
      <span className="text-or text-base font-bold font-[family-name:var(--font-calligraphic)] italic">G</span>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-blanc/15 hover:border-or/40 hover:bg-or/[0.07] text-blanc/60 hover:text-or"
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

function ThemeToggleMobile() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blanc/15 text-blanc/60 hover:text-or hover:border-or/40 text-[12px] tracking-wide"
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
      {theme === "light" ? "Mode sombre" : "Mode clair"}
    </button>
  );
}

function LoginButton() {
  return (
    <a
      href="/connexion"
      className="w-9 h-9 flex items-center justify-center rounded-full border border-blanc/15 text-blanc/40 hover:text-or hover:border-or/40 hover:bg-or/[0.07]"
      title="Connexion"
      aria-label="Connexion"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </a>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/marches", label: "Marchés" },
  { href: "/liste-de-courses", label: "Ma liste" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`relative text-[13px] uppercase tracking-[0.14em] py-1 ${
        active
          ? "text-or font-semibold"
          : "text-blanc/55 hover:text-blanc/90 font-medium"
      }`}
    >
      {label}
      {active && (
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[1.5px] bg-or rounded-full" />
      )}
    </a>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-noir sticky top-0 z-50 border-b border-blanc/[0.06]">
      <div className="max-w-6xl mx-auto w-full px-5 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Logo + nom */}
          <a href="/" className="group flex items-center gap-3 shrink-0">
            <LogoPlaceholder />
            <div>
              <h1 className="text-[15px] text-blanc/90 font-light tracking-[0.22em] uppercase leading-tight">
                Gaio Polart
              </h1>
              <p className="text-blanc/30 text-[10px] tracking-[0.18em] uppercase">
                Volailles &amp; Gibier
              </p>
            </div>
          </a>

          {/* Nav desktop (centré dans la page) */}
          <nav className="hidden sm:flex items-center gap-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {NAV_LINKS.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} active={pathname === href} />
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <LoginButton />
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full border border-blanc/15 text-blanc/60 hover:text-or hover:border-or/40"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-4 pb-3 border-t border-blanc/[0.06] mt-3">
            <nav className="flex flex-col items-center gap-4 mb-4">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-[0.12em] ${
                    pathname === href
                      ? "text-or font-semibold"
                      : "text-blanc/55 hover:text-blanc/90"
                  }`}
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-blanc/[0.06]">
              <ThemeToggleMobile />
              <a
                href="/connexion"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blanc/15 text-blanc/60 hover:text-or hover:border-or/40 text-[12px] tracking-wide"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Connexion
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
