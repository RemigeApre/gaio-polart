export function Footer() {
  return (
    <footer className="bg-noir">
      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
          {/* Gauche */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <div className="w-8 h-8 rounded-full border border-or/30 flex items-center justify-center bg-or/[0.07] shrink-0">
              <span className="text-or text-sm font-bold font-[family-name:var(--font-calligraphic)] italic">G</span>
            </div>
            <div className="text-left">
              <p className="text-blanc text-[13px] font-semibold tracking-[0.15em] uppercase">
                Gaio Polart
              </p>
              <p className="text-blanc/60 text-[11px] font-medium">
                Volailles &amp; Gibier · Depuis 2006
              </p>
            </div>
          </div>

          {/* Centre */}
          <div className="flex items-center justify-center gap-3 text-blanc/80 text-[12px] font-medium">
            <span className="inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              CB
            </span>
            <span className="text-blanc/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
              </svg>
              Espèces
            </span>
            <span className="text-blanc/30">·</span>
            <span>7h30 - 13h00</span>
          </div>

          {/* Droite */}
          <p className="text-blanc/70 text-[12px] font-medium text-center sm:text-right">
            Gagny · Chelles · Meaux · Villeparisis
          </p>
        </div>

        <div className="border-t border-blanc/10 mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center text-blanc/50 text-[11px] font-medium">
            <span>&copy; {new Date().getFullYear()} Gaio Polart</span>
            <span className="text-blanc/15">·</span>
            <a href="/mentions-legales" className="hover:text-or transition-colors">Mentions légales</a>
            <span className="text-blanc/15">·</span>
            <a href="/confidentialite" className="hover:text-or transition-colors">Confidentialité</a>
          </div>
          <p className="text-blanc/40 text-[11px]">
            Site réalisé par{" "}
            <a href="https://legeai-informatique.fr" target="_blank" rel="noopener noreferrer" className="text-blanc/60 hover:text-or font-medium transition-colors">
              Le Geai
            </a>
          </p>
        </div>
      </div>
      <div className="tricolore" />
    </footer>
  );
}
