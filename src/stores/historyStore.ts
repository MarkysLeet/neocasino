import { create } from 'zustand';

export interface HistoryEntry {
  id: string;
  crashPoint: number;
  cashedOutAt?: number;
  timestamp: number;
}

interface HistoryState {
  rounds: HistoryEntry[];
  pushRound: (entry: HistoryEntry) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  rounds: [],
  pushRound: (entry) =>
    set((state) => ({
      rounds: [entry, ...state.rounds].slice(0, 20)
    }))
}));
