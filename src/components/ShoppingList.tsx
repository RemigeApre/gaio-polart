"use client";

import { useState } from "react";
import { useShoppingList } from "@/lib/useShoppingList";

export function ShoppingList() {
  const { items, checkedCount, mounted, addItem, toggleItem, removeItem, clearChecked } = useShoppingList();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  if (!mounted) return null;

  const handleAdd = () => {
    addItem(input);
    setInput("");
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-5 z-40 flex items-center gap-2 px-4 h-11 rounded-full shadow-lg transition-all hover:scale-105"
        style={{
          backgroundColor: open ? "var(--color-or)" : "var(--bg-card)",
          border: "1px solid var(--border-main)",
          color: open ? "var(--color-noir)" : "var(--text-muted)",
        }}
        aria-label="Liste de courses"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
        <span className="text-[12px] font-semibold tracking-wide">
          Ma liste
        </span>
        {items.length > 0 && (
          <span
            className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{
              backgroundColor: open ? "rgba(0,0,0,0.2)" : "var(--color-or)",
              color: open ? "var(--color-or)" : "var(--color-noir)",
            }}
          >
            {items.length}
          </span>
        )}
      </button>

      {/* Panneau */}
      {open && (
        <div className="fixed bottom-36 right-5 z-40 w-[300px] sm:w-[340px] max-h-[70vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-main)" }}>
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-main)" }}>
            <div>
              <h3 className="text-[14px] font-bold" style={{ color: "var(--text-main)" }}>
                Ma liste de courses
              </h3>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {items.length === 0
                  ? "Notez ce dont vous avez besoin"
                  : `${items.length} article${items.length > 1 ? "s" : ""}${checkedCount > 0 ? ` · ${checkedCount} pris` : ""}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href="/liste-de-courses"
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-or/10 transition-colors"
                style={{ color: "var(--text-muted)" }}
                title="Ouvrir en pleine page"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-or/10 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-2.5 flex gap-2" style={{ borderBottom: "1px solid var(--border-main)" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="Ajouter un article..."
              className="flex-1 text-[16px] px-3 py-2 rounded-lg outline-none border transition-colors focus:border-or/50"
              style={{
                backgroundColor: "var(--bg-body)",
                borderColor: "var(--border-main)",
                color: "var(--text-main)",
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="px-3 py-2 rounded-lg bg-or text-noir-light text-[12px] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-or-light"
            >
              +
            </button>
          </div>

          {/* Liste */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" style={{ maxHeight: "300px" }}>
            {items.length === 0 ? (
              <p className="text-center text-[12px] py-8 italic" style={{ color: "var(--text-muted)" }}>
                Votre liste est vide
              </p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg group hover:bg-or/[0.03] transition-colors">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.checked ? "bg-or border-or" : "hover:border-or"
                    }`}
                    style={!item.checked ? { borderColor: "var(--border-main)" } : {}}
                  >
                    {item.checked && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-[13px] ${item.checked ? "line-through opacity-40" : ""}`} style={{ color: "var(--text-main)" }}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/10 shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {checkedCount > 0 && (
            <div className="px-4 py-2.5" style={{ borderTop: "1px solid var(--border-main)" }}>
              <button onClick={clearChecked} className="text-[11px] font-medium uppercase tracking-wider text-red-400/70 hover:text-red-400 transition-colors">
                Retirer les articles cochés
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
