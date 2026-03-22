"use client";

import { useState } from "react";
import { useShoppingList } from "@/lib/useShoppingList";

export function ShoppingListPage() {
  const {
    items, history, checkedCount, mounted,
    addItem, toggleItem, removeItem, clearChecked, clearAll, restoreBatch, clearHistory,
  } = useShoppingList();
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!mounted) return null;

  const handleAdd = () => {
    addItem(input);
    setInput("");
  };

  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearAll();
    setConfirmClear(false);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "À l'instant";
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-lg mx-auto px-5 pt-8 pb-12">
      {/* Titre */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-main)" }}>
          Ma liste de courses
        </h1>
        <div className="w-10 h-[1.5px] bg-or mx-auto mt-3 mb-3" />
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          Préparez votre liste avant de venir au marché.
          <br />
          Elle est sauvegardée sur votre appareil.
        </p>
      </div>

      {/* Champ d'ajout */}
      <div className="card px-4 sm:px-5 py-4 mb-4">
        <label htmlFor="add-item" className="block text-[12px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Ajouter un article
        </label>
        <div className="flex gap-2">
          <input
            id="add-item"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Ex : 1 poulet fermier, 6 oeufs..."
            className="flex-1 text-[16px] px-4 py-3 rounded-xl outline-none border transition-colors focus:border-or/50"
            style={{
              backgroundColor: "var(--bg-body)",
              borderColor: "var(--border-main)",
              color: "var(--text-main)",
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-xl bg-or text-noir-light text-[13px] font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors hover:bg-or-light"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="card overflow-hidden mb-4">
        {/* Header liste */}
        <div className="px-4 sm:px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border-main)" }}>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-main)" }}>
            {items.length === 0
              ? "Aucun article"
              : `${items.length} article${items.length > 1 ? "s" : ""}${checkedCount > 0 ? ` · ${checkedCount} pris` : ""}`}
          </span>
          <div className="flex items-center gap-2">
            {checkedCount > 0 && (
              <button
                onClick={clearChecked}
                className="text-[11px] font-medium px-3 py-1 rounded-lg border transition-colors hover:bg-or/10"
                style={{ borderColor: "var(--border-main)", color: "var(--text-muted)" }}
              >
                Retirer cochés
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`text-[11px] font-medium px-3 py-1 rounded-lg border transition-colors ${
                  confirmClear
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
                }`}
                style={!confirmClear ? { borderColor: "var(--border-main)", color: "var(--text-muted)" } : {}}
              >
                {confirmClear ? "Confirmer" : "Tout supprimer"}
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="divide-y" style={{ borderColor: "var(--border-main)" }}>
          {items.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
              <p className="text-[14px] font-medium" style={{ color: "var(--text-muted)" }}>
                Votre liste est vide
              </p>
              <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>
                Ajoutez des articles avec le champ ci-dessus
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 sm:px-5 py-3.5 group"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    item.checked ? "bg-or border-or scale-95" : "hover:border-or"
                  }`}
                  style={!item.checked ? { borderColor: "var(--border-main)" } : {}}
                  aria-label={item.checked ? "Décocher" : "Cocher"}
                >
                  {item.checked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <span
                  className={`flex-1 text-[14px] sm:text-[15px] transition-all ${item.checked ? "line-through opacity-35" : ""}`}
                  style={{ color: "var(--text-main)" }}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 sm:opacity-100 sm:opacity-40 sm:hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/10 shrink-0"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Supprimer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historique */}
      {history.length > 0 && (
        <div className="card overflow-hidden">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full px-4 sm:px-5 py-3 flex items-center justify-between text-left"
          >
            <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Récemment supprimés ({history.length})
            </span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform"
              style={{ color: "var(--text-muted)", transform: showHistory ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showHistory && (
            <div style={{ borderTop: "1px solid var(--border-main)" }}>
              {history.map((batch, i) => (
                <div
                  key={`${batch.deletedAt}-${i}`}
                  className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3"
                  style={i < history.length - 1 ? { borderBottom: "1px solid var(--border-main)" } : {}}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] truncate" style={{ color: "var(--text-main)" }}>
                      {batch.items.map((i) => i.text).join(", ")}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {formatTime(batch.deletedAt)} · {batch.items.length} article{batch.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => restoreBatch(i)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-or/10 text-or hover:bg-or/20 transition-colors shrink-0"
                  >
                    Restaurer
                  </button>
                </div>
              ))}

              <div className="px-4 sm:px-5 py-2.5 text-center" style={{ borderTop: "1px solid var(--border-main)" }}>
                <button
                  onClick={clearHistory}
                  className="text-[10px] font-medium uppercase tracking-wider transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  Vider l&apos;historique
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
