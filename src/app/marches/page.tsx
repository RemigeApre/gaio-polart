import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarchesPage } from "@/components/MarchesPage";
import { getAllMarkets } from "@/lib/markets";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nos marchés — Volailles & gibier à Gagny, Chelles, Meaux, Villeparisis",
  description: "Retrouvez Gaio Polart, volailler, sur les marchés de Gagny (samedi), Chelles (mardi, jeudi, dimanche), Meaux (samedi) et Villeparisis (vendredi, dimanche). Poulet fermier Label Rouge, gibier, oeufs fermiers. 7h30 - 13h00, CB et espèces.",
  keywords: [
    "marché Gagny volailler",
    "marché Chelles volaille",
    "marché Meaux poulet fermier",
    "marché Villeparisis volaille",
    "horaires marché Gagny",
    "horaires marché Chelles",
    "horaires marché Meaux",
    "horaires marché Villeparisis",
    "volailler Seine-et-Marne marché",
    "volailler Seine-Saint-Denis marché",
    "où acheter poulet fermier Île-de-France",
    "gibier marché Seine-et-Marne",
  ],
  alternates: {
    canonical: "/marches",
  },
};

export default async function Marches() {
  const allMarkets = await getAllMarkets();

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
          style={{ color: "var(--text-main)", opacity: 0.02 }}
          aria-hidden="true"
        >
          GP
        </div>
        <div className="relative z-10">
          <MarchesPage markets={allMarkets} />
        </div>
      </main>
      <Footer />
    </>
  );
}
