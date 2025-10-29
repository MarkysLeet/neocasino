import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BetState {
  amount: number;
  lastAmount: number;
  balance: number;
  autoCashout: number;
  betLocked: boolean;
  autoLocked: boolean;
  hasActiveBet: boolean;
  setAmount: (value: number) => void;
  applyPreset: (value: number) => void;
  double: () => void;
  half: () => void;
  setBetLocked: (locked: boolean) => void;
  setAutoLocked: (locked: boolean) => void;
  setAutoCashout: (value: number) => void;
  acceptBet: () => void;
  payout: (multiplier: number) => void;
  lose: (amount: number) => void;
  clearBet: () => void;
  resetBalance: (value: number) => void;
}

const clampAmount = (value: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(10000, Math.max(0, Number(value.toFixed(2))));
};

export const useBettingStore = create<BetState>()(
  persist(
    (set) => ({
      amount: 1,
      lastAmount: 1,
      balance: 1000,
      autoCashout: 1.5,
      betLocked: false,
      autoLocked: false,
      hasActiveBet: false,
      setAmount: (value) => set({ amount: clampAmount(value) }),
      applyPreset: (value) => set({ amount: clampAmount(value) }),
      double: () => set((state) => ({ amount: clampAmount(state.amount * 2) })),
      half: () => set((state) => ({ amount: clampAmount(state.amount / 2) })),
      setBetLocked: (betLocked) => set({ betLocked }),
      setAutoLocked: (autoLocked) => set({ autoLocked }),
      setAutoCashout: (autoCashout) => set({ autoCashout }),
      acceptBet: () =>
        set((state) => ({
          balance: clampAmount(state.balance - state.amount),
          lastAmount: state.amount,
          hasActiveBet: true
        })),
      payout: (multiplier) =>
        set((state) => ({
          balance: clampAmount(state.balance + state.lastAmount * multiplier)
        })),
      lose: (amount) =>
        set((state) => ({
          balance: clampAmount(state.balance - amount)
        })),
      clearBet: () => set({ hasActiveBet: false, betLocked: false, autoLocked: false }),
      resetBalance: (value) => set({ balance: clampAmount(value) })
    }),
    {
      name: 'rocket-bet-store'
    }
  )
);
