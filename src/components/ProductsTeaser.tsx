"use client";

const PRODUCTS = [
  { name: "Poulet fermier", size: "lg" },
  { name: "Dinde", size: "base" },
  { name: "Lapin", size: "xl" },
  { name: "Coq", size: "sm" },
  { name: "Poule", size: "base" },
  { name: "Pintade", size: "lg" },
  { name: "Oeufs frais", size: "sm" },
  { name: "Aiguillettes", size: "base" },
  { name: "Brochettes", size: "lg" },
  { name: "Émincé", size: "sm" },
  { name: "Lièvre", size: "xl" },
  { name: "Gibier", size: "2xl" },
  { name: "Foie gras", size: "lg" },
  { name: "Chapon", size: "base" },
];

const SIZE_CLASSES: Record<string, string> = {
  sm: "text-sm opacity-40",
  base: "text-base opacity-55",
  lg: "text-lg opacity-70",
  xl: "text-xl opacity-80",
  "2xl": "text-2xl opacity-90",
};

export function ProductsTeaser() {
  return (
    <section className="py-16">
      <div className="text-center mb-4">
        <span className="text-[11px] font-semibold text-or uppercase tracking-[0.18em]">
          Nos produits
        </span>
        <p className="text-base sm:text-lg mt-2 max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Volailles fermières, préparations maison, gibier de saison.
          <br />
          <span style={{ color: "var(--text-main)" }} className="font-medium">
            Venez découvrir notre étal.
          </span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-5 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-3.5 mt-8">
        {PRODUCTS.map(({ name, size }, i) => {
          const isGold = i % 3 === 0;
          return (
            <span
              key={name}
              className={`${SIZE_CLASSES[size]} font-[family-name:var(--font-calligraphic)] italic cursor-default hover:!opacity-100 hover:!text-or`}
              style={{ color: isGold ? "var(--color-or)" : "var(--text-main)" }}
            >
              {name}
            </span>
          );
        })}
      </div>
    </section>
  );
}
