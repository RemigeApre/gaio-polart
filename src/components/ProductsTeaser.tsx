"use client";

const PRODUCTS = [
  "Poulet fermier",
  "Dinde",
  "Lapin",
  "Coq",
  "Poule",
  "Pintade",
  "Oeufs frais",
  "Aiguillettes",
  "Brochettes",
  "Émincé",
  "Lièvre",
  "Gibier",
  "Foie gras",
  "Chapon",
];

export function ProductsTeaser() {
  return (
    <section className="py-14">
      <div className="text-center mb-8">
        <span className="text-[11px] font-semibold text-or uppercase tracking-[0.15em]">
          Nos produits
        </span>
        <p className="text-sm mt-1.5 italic" style={{ color: "var(--text-muted)" }}>
          Présentation détaillée, bientôt.
        </p>
      </div>

      {/* Nuage de mots */}
      <div className="max-w-2xl mx-auto px-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
        {PRODUCTS.map((product, i) => {
          const sizes = [
            "text-sm", "text-base", "text-lg", "text-xl", "text-2xl",
          ];
          const opacities = [0.35, 0.5, 0.65, 0.8, 1];
          const tier = i % 5;
          const isHighlight = i % 4 === 0;

          return (
            <span
              key={product}
              className={`${sizes[tier]} font-[family-name:var(--font-calligraphic)] italic transition-colors duration-300 hover:text-or cursor-default`}
              style={{
                color: isHighlight
                  ? "var(--color-or)"
                  : "var(--text-main)",
                opacity: isHighlight ? 0.9 : opacities[tier],
              }}
            >
              {product}
            </span>
          );
        })}
      </div>
    </section>
  );
}
