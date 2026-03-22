"use client";

import { useState } from "react";

export function ShareButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "Gaio Polart — Volailles & Gibier sur les marchés d'Île-de-France";

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch {
        // cancelled
      }
    }
    setShowMenu(!showMenu);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => { setCopied(false); setShowMenu(false); }, 1500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {showMenu && (
        <div
          className="absolute bottom-14 right-0 glass rounded-xl border px-3 py-2.5 flex flex-col gap-2 min-w-[160px] shadow-xl"
          style={{ borderColor: "var(--border-main)" }}
        >
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[12px] font-medium px-2 py-1.5 rounded-lg hover:bg-or/10 transition-colors"
            style={{ color: "var(--text-main)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[12px] font-medium px-2 py-1.5 rounded-lg hover:bg-or/10 transition-colors"
            style={{ color: "var(--text-main)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
          <button
            onClick={copyLink}
            className="flex items-center gap-2.5 text-[12px] font-medium px-2 py-1.5 rounded-lg hover:bg-or/10 transition-colors w-full text-left"
            style={{ color: copied ? "var(--color-or)" : "var(--text-main)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {copied ? "Copié" : "Copier le lien"}
          </button>
        </div>
      )}

      <button
        onClick={share}
        className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 bg-or text-noir-light"
        aria-label="Partager"
        title="Partager"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>
    </div>
  );
}
