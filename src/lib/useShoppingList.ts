"use client";

import { useState, useEffect, useCallback } from "react";

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
  addedAt: number;
}

export interface DeletedBatch {
  items: ShoppingItem[];
  deletedAt: number;
}

const STORAGE_KEY = "gp_shopping_list";
const HISTORY_KEY = "gp_shopping_history";
const PRESETS_KEY = "gp_shopping_presets";
const HISTORY_MAX = 10;
const PRESETS_MAX = 3;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export interface ShoppingPreset {
  id: string;
  name: string;
  items: string[];
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [history, setHistory] = useState<DeletedBatch[]>([]);
  const [presets, setPresets] = useState<ShoppingPreset[]>([]);
  const [mounted, setMounted] = useState(false);

  // Charger
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist));
      const pres = localStorage.getItem(PRESETS_KEY);
      if (pres) setPresets(JSON.parse(pres));
    } catch {}
    setMounted(true);
  }, []);

  // Sauvegarder items
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, mounted]);

  // Sauvegarder historique
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, mounted]);

  // Sauvegarder presets
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  }, [presets, mounted]);

  const addItem = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setItems((prev) => [...prev, { id: generateId(), text: trimmed, checked: false, addedAt: Date.now() }]);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        setHistory((h) => [{ items: [item], deletedAt: Date.now() }, ...h].slice(0, HISTORY_MAX));
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearChecked = useCallback(() => {
    setItems((prev) => {
      const checked = prev.filter((i) => i.checked);
      if (checked.length > 0) {
        setHistory((h) => [{ items: checked, deletedAt: Date.now() }, ...h].slice(0, HISTORY_MAX));
      }
      return prev.filter((i) => !i.checked);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems((prev) => {
      if (prev.length > 0) {
        setHistory((h) => [{ items: prev, deletedAt: Date.now() }, ...h].slice(0, HISTORY_MAX));
      }
      return [];
    });
  }, []);

  const restoreBatch = useCallback((index: number) => {
    const batch = history[index];
    if (!batch) return;
    setItems((prev) => [...prev, ...batch.items.map((i) => ({ ...i, checked: false }))]);
    setHistory((h) => h.filter((_, i) => i !== index));
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Presets
  const savePreset = useCallback((name: string) => {
    const unchecked = items.filter((i) => !i.checked).map((i) => i.text);
    if (unchecked.length === 0) return;
    setPresets((prev) => {
      const newPreset: ShoppingPreset = { id: generateId(), name: name.trim() || "Ma liste", items: unchecked };
      return [...prev.slice(0, PRESETS_MAX - 1), newPreset];
    });
  }, [items]);

  const loadPreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    for (const text of preset.items) {
      const exists = items.some((i) => i.text.toLowerCase() === text.toLowerCase() && !i.checked);
      if (!exists) {
        setItems((prev) => [...prev, { id: generateId(), text, checked: false, addedAt: Date.now() }]);
      }
    }
  }, [presets, items]);

  const deletePreset = useCallback((id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const renamePreset = useCallback((id: string, name: string) => {
    setPresets((prev) => prev.map((p) => p.id === id ? { ...p, name: name.trim() || p.name } : p));
  }, []);

  const checkedCount = items.filter((i) => i.checked).length;
  const canAddPreset = presets.length < PRESETS_MAX;

  return {
    items,
    history,
    presets,
    checkedCount,
    canAddPreset,
    mounted,
    addItem,
    toggleItem,
    removeItem,
    clearChecked,
    clearAll,
    restoreBatch,
    clearHistory,
    savePreset,
    loadPreset,
    deletePreset,
    renamePreset,
  };
}
