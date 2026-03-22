"use client";

export function About() {
  return (
    <section className="relative max-w-5xl mx-auto px-5 py-6 pb-14">
      {/* Bulles flottantes desktop */}
      <div className="hidden xl:block">
        <div
          className="absolute -left-16 top-10 glass rounded-2xl border px-5 py-3.5 text-center z-20"
          style={{ borderColor: "var(--border-main)", animation: "float 6s ease-in-out infinite", "--float-rotate": "-3deg" } as React.CSSProperties}
        >
          <p className="text-xl font-bold text-or">2006</p>
          <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>Création</p>
        </div>

        <div
          className="absolute -left-20 bottom-36 glass rounded-2xl border px-5 py-3.5 text-center z-20"
          style={{ borderColor: "var(--border-main)", animation: "float 8s ease-in-out 1.5s infinite", "--float-rotate": "2deg" } as React.CSSProperties}
        >
          <p className="text-xl font-bold text-or">100%</p>
          <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>Française</p>
        </div>

        <div
          className="absolute -right-20 top-16 glass rounded-2xl border px-5 py-3.5 text-center z-20"
          style={{ borderColor: "var(--border-main)", animation: "float 7s ease-in-out 0.8s infinite", "--float-rotate": "3deg" } as React.CSSProperties}
        >
          <p className="text-base font-bold text-or leading-tight">Label Rouge</p>
        </div>

        <div
          className="absolute -right-14 bottom-24 glass rounded-2xl border px-5 py-3.5 text-center z-20"
          style={{ borderColor: "var(--border-main)", animation: "float 5.5s ease-in-out 2s infinite", "--float-rotate": "-2deg" } as React.CSSProperties}
        >
          <p className="text-xl font-bold text-or">3</p>
          <p className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>Générations</p>
        </div>
      </div>

      {/* Carte */}
      <div className="card max-w-3xl mx-auto px-6 sm:px-12 py-10 sm:py-14 overflow-hidden">
        <div className="text-center mb-10">
          <div className="w-8 h-[1.5px] bg-or/50 mx-auto mb-6" />
          <h2
            className="text-3xl sm:text-[2.5rem] font-bold uppercase tracking-[0.15em] leading-tight"
            style={{ color: "var(--text-main)" }}
          >
            Notre histoire
          </h2>
          <p className="text-base sm:text-lg font-light mt-3" style={{ color: "var(--text-muted)" }}>
            Une affaire de famille, <span className="text-or font-medium">depuis 2006</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 text-[13.5px] leading-[1.85] text-justify" style={{ color: "var(--text-muted)" }}>
          <p>
            Gaio Polart est né d&apos;une conviction simple : proposer des{" "}
            <strong style={{ color: "var(--text-main)" }}>volailles et gibiers français de qualité</strong>,
            en allant à la rencontre des clients sur les marchés d&apos;Île-de-France.
            L&apos;entreprise est le fruit d&apos;un choix
            d&apos;<strong className="text-or">indépendance</strong> et
            d&apos;une passion pour le{" "}
            <strong className="text-or">commerce de proximité</strong>.
          </p>

          <p>
            Le respect de l&apos;animal n&apos;est pas un argument marketing, c&apos;est une{" "}
            <strong style={{ color: "var(--text-main)" }}>exigence</strong>.
            Nos produits sont issus d&apos;
            <strong style={{ color: "var(--text-main)" }}>élevages fermiers, plein air et en liberté</strong>.{" "}
            <strong className="text-or">100&nbsp;% de notre viande est française.</strong>
          </p>

          <p>
            Pendant le Covid, quand les marchés ont fermé, nous avons{" "}
            <strong style={{ color: "var(--text-main)" }}>livré nos clients à domicile</strong>.
            Aujourd&apos;hui encore, nous rendons visite aux{" "}
            <strong style={{ color: "var(--text-main)" }}>personnes qui ne peuvent pas se déplacer</strong>.
            Le service, c&apos;est aussi ça.
          </p>

          <p>
            Trois générations impliquées depuis le premier jour,
            du financement initial au stand chaque matin.
            Le goût du{" "}
            <strong className="text-or">travail bien fait</strong>,
            transmis et partagé.
          </p>
        </div>

        {/* Stats mobile */}
        <div className="xl:hidden mt-8 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ borderTop: "1px solid var(--border-main)" }}>
          {[
            { value: "2006", label: "Création" },
            { value: "100%", label: "Française" },
            { value: "Label Rouge", label: "" },
            { value: "3 gen.", label: "Famille" },
          ].map(({ value, label }) => (
            <div key={value} className="text-center">
              <p className="text-lg font-bold text-or">{value}</p>
              {label && <p className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
