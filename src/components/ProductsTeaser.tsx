"use client";

const PRODUCTS = [
  "Poulet fermier",
  "Dinde",
  "Lapin",
  "Coq",
  "Poule",
  "Pintade",
  "Chapon",
  "Oeufs fermiers",
  "Lièvre",
  "Gibier de saison",
  "Foie gras",
  "Brochettes",
  "Aiguillettes",
  "Émincé",
];

export function ProductsTeaser() {
  return (
    <section className="py-14 max-w-2xl mx-auto px-5">
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em]"
          style={{ color: "var(--text-main)" }}
        >
          Nos Produits
        </h2>
        <div className="w-10 h-[1.5px] bg-or mx-auto mt-3" />
      </div>

      {/* Défilement organique de mots */}
      <div className="relative overflow-hidden py-6" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
        <div className="flex gap-6 animate-[scroll_25s_linear_infinite] w-max">
          {[...PRODUCTS, ...PRODUCTS].map((name, i) => (
            <span
              key={i}
              className="text-lg sm:text-xl font-[family-name:var(--font-calligraphic)] italic whitespace-nowrap shrink-0"
              style={{ color: i % 3 === 0 ? "var(--color-or)" : "var(--text-main)", opacity: 0.7 + (i % 3) * 0.1 }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-[14px] sm:text-[15px] leading-relaxed max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          <strong style={{ color: "var(--text-main)" }}>Volailles fermières Label Rouge</strong>, gibier français de saison, préparations maison.
        </p>
        <p className="text-[13px] mt-2 font-medium" style={{ color: "var(--text-main)" }}>
          Venez découvrir notre étal, demandez-nous.
        </p>
        <p className="text-[11px] mt-3 italic tracking-wide" style={{ color: "var(--text-muted)" }}>
          100% viande française · Élevage fermier et plein air · Label Rouge
        </p>
      </div>
    </section>
  );
}
