import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type GamePhase = 'betting' | 'launching' | 'inflight' | 'crashed' | 'result';

export interface GameState {
  phase: GamePhase;
  roundSeed: string;
  roundHash: string;
  crashPoint: number;
  multiplier: number;
  startTimestamp: number | null;
  nextRoundCountdown: number;
  cashedOutAt: number | null;
  setPhase: (phase: GamePhase) => void;
  setMultiplier: (value: number) => void;
  setCrashPoint: (point: number) => void;
  setStartTimestamp: (timestamp: number | null) => void;
  setRoundSeed: (seed: string, hash: string) => void;
  setNextRoundCountdown: (seconds: number) => void;
  setCashedOutAt: (value: number | null) => void;
  reset: () => void;
}

const initialState: Omit<
  GameState,
  | 'setPhase'
  | 'setMultiplier'
  | 'setCrashPoint'
  | 'setStartTimestamp'
  | 'setRoundSeed'
  | 'setNextRoundCountdown'
  | 'setCashedOutAt'
  | 'reset'
> = {
  phase: 'betting',
  roundSeed: '',
  roundHash: '',
  crashPoint: 1,
  multiplier: 1,
  startTimestamp: null,
  nextRoundCountdown: 5,
  cashedOutAt: null
};

export const useGameStore = create<GameState>()(
  devtools((set) => ({
    ...initialState,
    setPhase: (phase) => set({ phase }),
    setMultiplier: (value) => set({ multiplier: value }),
    setCrashPoint: (crashPoint) => set({ crashPoint }),
    setStartTimestamp: (startTimestamp) => set({ startTimestamp }),
    setRoundSeed: (roundSeed, roundHash) => set({ roundSeed, roundHash }),
    setNextRoundCountdown: (seconds) => set({ nextRoundCountdown: seconds }),
    setCashedOutAt: (cashedOutAt) => set({ cashedOutAt }),
    reset: () => set({ ...initialState })
  }))
);
