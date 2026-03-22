"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useShoppingList } from "@/lib/useShoppingList";

function encodeList(texts: string[]): string {
  return btoa(encodeURIComponent(JSON.stringify(texts)));
}

function decodeList(encoded: string): string[] {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return [];
  }
}

export function ShoppingListPage() {
  const {
    items, history, presets, checkedCount, canAddPreset, mounted,
    addItem, toggleItem, removeItem, clearChecked, clearAll, restoreBatch, clearHistory,
    savePreset, loadPreset, deletePreset, renamePreset,
  } = useShoppingList();
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = useState("");

  // Import depuis URL partagée
  const searchParams = useSearchParams();
  const [sharedItems, setSharedItems] = useState<string[]>([]);
  const [importDone, setImportDone] = useState(false);

  useEffect(() => {
    const listParam = searchParams.get("list");
    if (listParam) {
      const decoded = decodeList(listParam);
      if (decoded.length > 0) setSharedItems(decoded);
    }
  }, [searchParams]);

  const importSharedItems = () => {
    for (const text of sharedItems) {
      addItem(text);
    }
    setImportDone(true);
    setSharedItems([]);
    // Nettoyer l'URL
    window.history.replaceState({}, "", "/liste-de-courses");
  };

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

  // Générer le lien de partage
  const uncheckedItems = items.filter((i) => !i.checked);
  const shareUrl = typeof window !== "undefined" && uncheckedItems.length > 0
    ? `${window.location.origin}/liste-de-courses?list=${encodeList(uncheckedItems.map((i) => i.text))}`
    : "";

  const shareText = uncheckedItems.length > 0
    ? `Ma liste de courses :\n${uncheckedItems.map((i) => `- ${i.text}`).join("\n")}\n\nOuvrir la liste :`
    : "";

  const handleShareCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ma liste de courses", text: shareText, url: shareUrl });
      } catch {}
    } else {
      setShareOpen(!shareOpen);
    }
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
      {/* Bannière d'import (liste partagée) */}
      {sharedItems.length > 0 && !importDone && (
        <div className="card px-5 py-5 mb-6 text-center" style={{ borderColor: "var(--color-or)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-or">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--text-main)" }}>
            Un proche vous partage sa liste
          </h3>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
            {sharedItems.length} article{sharedItems.length > 1 ? "s" : ""} à ajouter :
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {sharedItems.map((text, i) => (
              <span key={i} className="text-[12px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: "var(--bg-body)", color: "var(--text-main)", border: "1px solid var(--border-main)" }}>
                {text}
              </span>
            ))}
          </div>
          <button
            onClick={importSharedItems}
            className="px-6 py-2.5 rounded-xl bg-or text-noir-light text-[13px] font-bold transition-colors hover:bg-or-light"
          >
            Ajouter à ma liste
          </button>
        </div>
      )}

      {importDone && (
        <div className="card px-5 py-4 mb-6 text-center" style={{ borderColor: "rgba(34, 197, 94, 0.3)" }}>
          <p className="text-[13px] font-medium text-green-500">
            Articles ajoutés à votre liste.
          </p>
        </div>
      )}

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

      {/* Listes récurrentes */}
      {(presets.length > 0 || (canAddPreset && items.filter((i) => !i.checked).length > 0)) && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Mes listes récurrentes {presets.length > 0 && `(${presets.length}/3)`}
            </span>
            {canAddPreset && items.filter((i) => !i.checked).length > 0 && (
              <button
                onClick={() => setShowSavePreset(!showSavePreset)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors hover:bg-or/10 text-or"
              >
                + Sauvegarder la liste actuelle
              </button>
            )}
          </div>

          {/* Formulaire de sauvegarde */}
          {showSavePreset && (
            <div className="card px-4 py-3 mb-2.5 flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    savePreset(presetName);
                    setPresetName("");
                    setShowSavePreset(false);
                  }
                }}
                placeholder="Nom de la liste (ex : Repas du dimanche)"
                className="flex-1 text-[14px] px-3 py-2 rounded-lg outline-none border transition-colors focus:border-or/50"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }}
                autoFocus
              />
              <button
                onClick={() => { savePreset(presetName); setPresetName(""); setShowSavePreset(false); }}
                disabled={items.filter((i) => !i.checked).length === 0}
                className="px-4 py-2 rounded-lg bg-or text-noir-light text-[12px] font-bold disabled:opacity-30 transition-colors hover:bg-or-light"
              >
                Sauvegarder
              </button>
            </div>
          )}

          {/* Liste des presets */}
          {presets.length > 0 && (
            <div className="space-y-2">
              {presets.map((preset) => (
                <div key={preset.id} className="card px-4 py-3 flex items-center gap-3">
                  {editingPresetId === preset.id ? (
                    <input
                      type="text"
                      value={editingPresetName}
                      onChange={(e) => setEditingPresetName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { renamePreset(preset.id, editingPresetName); setEditingPresetId(null); }
                        if (e.key === "Escape") setEditingPresetId(null);
                      }}
                      onBlur={() => { renamePreset(preset.id, editingPresetName); setEditingPresetId(null); }}
                      className="flex-1 text-[14px] px-2 py-1 rounded-lg outline-none border transition-colors focus:border-or/50"
                      style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => { setEditingPresetId(preset.id); setEditingPresetName(preset.name); }}
                        className="text-[14px] font-semibold text-left hover:text-or transition-colors"
                        style={{ color: "var(--text-main)" }}
                        title="Cliquer pour renommer"
                      >
                        {preset.name}
                      </button>
                      <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                        {preset.items.length} article{preset.items.length > 1 ? "s" : ""} · {preset.items.slice(0, 3).join(", ")}{preset.items.length > 3 ? "..." : ""}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => loadPreset(preset.id)}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-or/10 text-or hover:bg-or/20 transition-colors"
                    >
                      Charger
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/[0.06] hover:bg-red-500/15 text-red-400/50 hover:text-red-400 transition-colors"
                      aria-label="Supprimer la liste"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            {/* Bouton partager */}
            {uncheckedItems.length > 0 && (
              <button
                onClick={handleNativeShare}
                className="text-[11px] font-medium px-3 py-1 rounded-lg border transition-colors hover:bg-or/10 hover:text-or"
                style={{ borderColor: "var(--border-main)", color: "var(--text-muted)" }}
                title="Partager ma liste"
              >
                <span className="hidden sm:inline">Partager</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            )}
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

        {/* Menu de partage (desktop) */}
        {shareOpen && uncheckedItems.length > 0 && (
          <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center justify-center gap-2" style={{ borderBottom: "1px solid var(--border-main)", backgroundColor: "var(--bg-body)" }}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:bg-green-500/10"
              style={{ borderColor: "var(--border-main)", color: "var(--text-main)" }}
            >
              WhatsApp
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:bg-blue-500/10"
              style={{ borderColor: "var(--border-main)", color: "var(--text-main)" }}
            >
              SMS
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("Ma liste de courses")}&body=${encodeURIComponent(shareText + "\n" + shareUrl)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:bg-or/10"
              style={{ borderColor: "var(--border-main)", color: "var(--text-main)" }}
            >
              Email
            </a>
            <button
              onClick={handleShareCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-colors hover:bg-or/10"
              style={{ borderColor: "var(--border-main)", color: shareCopied ? "var(--color-or)" : "var(--text-main)" }}
            >
              {shareCopied ? "Copié" : "Copier le lien"}
            </button>
          </div>
        )}

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
                  className="w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-colors bg-red-500/[0.06] hover:bg-red-500/15 active:bg-red-500/25 text-red-400/50 hover:text-red-400"
                  aria-label="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
                      {batch.items.map((item) => item.text).join(", ")}
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
