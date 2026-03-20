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
      <main className="flex-1">
        <MarchesPage markets={allMarkets} />
      </main>
      <Footer />
    </>
  );
}
