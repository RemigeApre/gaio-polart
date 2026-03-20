"use client";

import { useRef, useState } from "react";

export function OrderBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [halo, setHalo] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHalo({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setHalo((h) => ({ ...h, visible: false }));
  };

  return (
    <section className="max-w-5xl mx-auto px-5 py-10">
      <div className="relative max-w-xl mx-auto text-center">
        {/* Halo doré ambiant */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-or/[0.06] blur-[100px]" />
        </div>

        {/* Carte glass */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative glass rounded-2xl border border-or/15 px-8 sm:px-10 py-10 overflow-hidden cursor-default"
        >
          {/* Halo souris */}
          <div
            className="absolute w-[280px] h-[280px] rounded-full pointer-events-none transition-opacity duration-500"
            style={{
              left: halo.x - 140,
              top: halo.y - 140,
              background: "radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%)",
              opacity: halo.visible ? 1 : 0,
            }}
          />

          {/* Coins décoratifs */}
          <svg className="absolute top-4 left-4 w-5 h-5 text-or/50" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 12V2a2 2 0 012-2h10" />
          </svg>
          <svg className="absolute top-4 right-4 w-5 h-5 text-or/50" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 12V2a2 2 0 00-2-2H8" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-5 h-5 text-or/50" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M0 8v10a2 2 0 002 2h10" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-5 h-5 text-or/50" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 8v10a2 2 0 01-2 2H8" />
          </svg>

          {/* Contenu */}
          <div className="relative">
            {/* Icône */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-or mx-auto mb-5">
              <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" stroke="currentColor" strokeWidth="1" />
              <path d="M9 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <h3 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
              Réservez vos produits
            </h3>

            <p className="text-[15px] leading-[1.8] mt-4 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>Pièces entières</strong>,{" "}
              <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>gibier de saison</strong>,{" "}
              préparations pour vos événements :
              pensez à commander à l&apos;avance pour être sûr de trouver ce qu&apos;il vous faut
              et nous aider à <strong className="text-or font-semibold">limiter le gaspillage</strong>.
            </p>

            <a
              href="tel:"
              className="inline-flex items-center gap-2 mt-7 px-7 py-3 text-xs font-semibold rounded-full bg-or/10 border border-or/25 text-or hover:bg-or/20 transition-all tracking-wide uppercase"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
