import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface CookedEntry {
  slug: string;
  people: number;
  cookedAt: string;
}

interface HistoryState {
  entries: CookedEntry[];
  markCooked: (slug: string, people: number) => void;
  /** Removes the most recent entry for this recipe. */
  undo: (slug: string) => void;
}

/** "I cooked this" history, saved on the phone with no account. */
export const useHistory = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      markCooked: (slug, people) =>
        set((s) => ({ entries: [{ slug, people, cookedAt: new Date().toISOString() }, ...s.entries] })),
      undo: (slug) =>
        set((s) => {
          const i = s.entries.findIndex((e) => e.slug === slug);
          return i < 0 ? s : { entries: s.entries.filter((_, n) => n !== i) };
        }),
    }),
    { name: 'wcic-history', version: 1, storage: createJSONStorage(() => AsyncStorage) },
  ),
);
