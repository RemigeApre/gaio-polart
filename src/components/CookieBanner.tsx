"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "gp_cookies_accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-noir border-t border-blanc/10">
      <div className="max-w-3xl mx-auto px-5 py-4 flex flex-col sm:flex-row items-center gap-3">
        <p className="flex-1 text-blanc/80 text-[13px] text-center sm:text-left">
          Ce site utilise le stockage local pour vos préférences et votre liste de courses. Aucune donnée personnelle collectée.{" "}
          <a href="/confidentialite" className="text-or hover:text-or-light transition-colors font-medium">En savoir plus</a>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 rounded-lg bg-or text-noir-light text-[13px] font-bold hover:bg-or-light transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
