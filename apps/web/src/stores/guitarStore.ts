import { create } from 'zustand';
import type { Guitar } from '@/types';

interface GuitarStoreState {
  guitars: Guitar[];
  comparisonIds: string[];
  activeHoverId: string | null;
  filterCategory: 'acoustic' | 'electric' | 'bass' | 'classical' | null;
  activeDemoGuitarId: string | null;
  seedGuitars: (guitars: Guitar[]) => void;
  setActiveHover: (id: string | null) => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  setFilterCategory: (category: 'acoustic' | 'electric' | 'bass' | 'classical' | null) => void;
  setActiveDemoGuitar: (id: string | null) => void;
}

export const useGuitarStore = create<GuitarStoreState>((set, get) => ({
  guitars: [],
  comparisonIds: [],
  activeHoverId: null,
  filterCategory: null,
  activeDemoGuitarId: null,

  seedGuitars: (guitars: Guitar[]) => set({ guitars }),

  setActiveHover: (id: string | null) => set({ activeHoverId: id }),

  toggleComparison: (id: string) => {
    const { comparisonIds } = get();
    if (comparisonIds.includes(id)) {
      set({ comparisonIds: comparisonIds.filter((cid) => cid !== id) });
    } else if (comparisonIds.length < 3) {
      set({ comparisonIds: [...comparisonIds, id] });
    }
  },

  clearComparison: () => set({ comparisonIds: [] }),

  setFilterCategory: (category) => set({ filterCategory: category }),

  setActiveDemoGuitar: (id: string | null) => set({ activeDemoGuitarId: id }),
}));
