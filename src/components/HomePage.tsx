"use client";

import { MarketData } from "@/lib/types";
import { HeroMarket } from "./HeroMarket";

interface HomePageProps {
  current: MarketData[];
  next: MarketData[];
  upcoming: MarketData[];
  allMarkets: MarketData[];
}

export function HomePage({ current, next, upcoming }: HomePageProps) {
  return (
    <HeroMarket
      current={current}
      next={next}
      upcoming={upcoming}
    />
  );
}
