import { create } from 'zustand';

export interface CookedEntry {
  slug: string;
  people: number;
  cookedAt: string;
}

interface HistoryState {
  entries: CookedEntry[];
  markCooked: (slug: string, people: number) => void;
  undo: (slug: string) => void;
}

// TODO(week 4): persist to the phone with AsyncStorage so history survives restarts.
export const useHistory = create<HistoryState>((set) => ({
  entries: [],
  markCooked: (slug, people) =>
    set((s) => ({ entries: [{ slug, people, cookedAt: new Date().toISOString() }, ...s.entries] })),
  undo: (slug) =>
    set((s) => {
      const i = s.entries.findIndex((e) => e.slug === slug);
      return i < 0 ? s : { entries: s.entries.filter((_, n) => n !== i) };
    }),
}));
