import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/components/HomePage";
import { OrderBanner } from "@/components/OrderBanner";
import { ProductsTeaser } from "@/components/ProductsTeaser";
import { About } from "@/components/About";
import { ShareButton } from "@/components/ShareButton";
import { ShoppingList } from "@/components/ShoppingList";
import { getAllMarkets, groupMarketsByUrgency } from "@/lib/markets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allMarkets = await getAllMarkets();
  const now = new Date();
  const { current, next, upcoming } = groupMarketsByUrgency(allMarkets, now);

  return (
    <>
      <Header />
      <main className="flex-1 relative overflow-hidden">
        {/* Monogramme GP en fond de page */}
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
          style={{ color: "var(--text-main)", opacity: 0.025 }}
          aria-hidden="true"
        >
          GP
        </div>

        <div className="relative z-10">
          <HomePage
            current={current}
            next={next}
            upcoming={upcoming}
            allMarkets={allMarkets}
          />
          <OrderBanner />
          <ProductsTeaser />
          <About />
        </div>
      </main>
      <Footer />
      <ShoppingList />
      <ShareButton />
    </>
  );
}
