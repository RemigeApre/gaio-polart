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
    <section className="max-w-5xl mx-auto px-5 py-12">
      <div className="relative max-w-xl mx-auto text-center">
        {/* Halo ambiant */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-or/[0.05] blur-[120px]" />
        </div>

        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative glass rounded-2xl border border-or/[0.12] px-8 sm:px-10 py-10 overflow-hidden cursor-default"
          style={{ boxShadow: "0 0 60px -20px rgba(201, 168, 76, 0.06)" }}
        >
          {/* Halo souris */}
          <div
            className="absolute w-[320px] h-[320px] rounded-full pointer-events-none"
            style={{
              left: halo.x - 160,
              top: halo.y - 160,
              background: "radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, rgba(201, 168, 76, 0.03) 40%, transparent 70%)",
              opacity: halo.visible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          {/* Coins */}
          <svg className="absolute top-4 left-4 w-5 h-5 text-or/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M0 12V2a2 2 0 012-2h10" />
          </svg>
          <svg className="absolute top-4 right-4 w-5 h-5 text-or/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20 12V2a2 2 0 00-2-2H8" />
          </svg>
          <svg className="absolute bottom-4 left-4 w-5 h-5 text-or/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M0 8v10a2 2 0 002 2h10" />
          </svg>
          <svg className="absolute bottom-4 right-4 w-5 h-5 text-or/40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M20 8v10a2 2 0 01-2 2H8" />
          </svg>

          <div className="relative">
            {/* Icône panier/réservation */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-or mx-auto mb-4 opacity-80">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.2" />
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.2" />
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.2" />
            </svg>

            <h3 className="text-xl font-bold tracking-wide" style={{ color: "var(--text-main)" }}>
              Réservez vos repas
            </h3>

            <p className="text-[14px] leading-[1.85] mt-3 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>Pièces entières</strong>,{" "}
              <strong style={{ color: "var(--text-main)", fontWeight: 600 }}>gibier de saison</strong>,{" "}
              préparations pour vos événements :
              pensez à commander à l&apos;avance pour être sûr de trouver ce qu&apos;il vous faut
              et nous aider à <strong className="text-or font-semibold">limiter le gaspillage</strong>.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); const p = ['0','6','X','X','X','X','X','X','X','X']; window.location.href = 'tel:' + p.join(''); }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[12px] font-semibold rounded-full bg-or/[0.08] border border-or/20 text-or hover:bg-or/[0.15] hover:border-or/35 tracking-wide min-w-[130px]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Téléphone
              </a>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); const u = 'contact'; const d = 'gaio-polart.fr'; window.location.href = 'mai' + 'lto:' + u + '@' + d; }}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[12px] font-medium rounded-full border text-or/70 hover:text-or hover:border-or/35 tracking-wide min-w-[130px]"
                style={{ borderColor: "var(--border-main)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
