import { normalizeIngredient } from '@wcic/matching';
import { create } from 'zustand';

interface PantryState {
  /** Names as the person typed them, one per canonical ingredient. */
  items: string[];
  add: (name: string) => void;
  remove: (name: string) => void;
}

export const usePantry = create<PantryState>((set) => ({
  items: [],
  add: (name) =>
    set((s) => {
      const trimmed = name.trim();
      const key = normalizeIngredient(trimmed);
      if (!key || s.items.some((i) => normalizeIngredient(i) === key)) return s;
      return { items: [...s.items, trimmed] };
    }),
  remove: (name) => set((s) => ({ items: s.items.filter((i) => i !== name) })),
}));
