import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MarchesPage } from "@/components/MarchesPage";
import { getAllMarkets } from "@/lib/markets";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marchés — Gaio Polart",
  description: "Retrouvez tous les marchés de Gaio Polart en Île-de-France : Gagny, Chelles, Meaux, Villeparisis.",
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
