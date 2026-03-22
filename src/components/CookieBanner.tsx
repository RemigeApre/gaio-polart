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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5">
      <div
        className="max-w-2xl mx-auto glass rounded-2xl border px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center gap-4 shadow-xl"
        style={{ borderColor: "var(--border-main)" }}
      >
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[13px] font-medium" style={{ color: "var(--text-main)" }}>
            Ce site utilise le stockage local de votre navigateur
          </p>
          <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
            Uniquement pour sauvegarder vos préférences (thème, liste de courses) et votre session de connexion. Aucune donnée personnelle n&apos;est collectée ni transmise à des tiers.{" "}
            <a href="/confidentialite" className="text-or hover:text-or-light transition-colors">En savoir plus</a>
          </p>
        </div>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2.5 rounded-xl bg-or text-noir-light text-[12px] font-bold hover:bg-or-light transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
