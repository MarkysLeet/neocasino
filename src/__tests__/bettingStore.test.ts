import { describe, expect, it } from 'vitest';
import { act } from 'react-dom/test-utils';
import { useBettingStore } from '../stores/bettingStore';

describe('betting store', () => {
  it('locks balance when accepting a bet and pays out correctly', () => {
    const initialBalance = useBettingStore.getState().balance;
    act(() => {
      useBettingStore.getState().setAmount(10);
      useBettingStore.getState().acceptBet();
    });
    const afterAccept = useBettingStore.getState().balance;
    expect(afterAccept).toBeCloseTo(initialBalance - 10, 2);

    act(() => {
      useBettingStore.getState().payout(2);
      useBettingStore.getState().clearBet();
    });
    expect(useBettingStore.getState().balance).toBeGreaterThan(afterAccept);
  });

  it('clamps auto cashout changes', () => {
    act(() => {
      useBettingStore.getState().setAutoCashout(5.4567);
    });
    expect(useBettingStore.getState().autoCashout).toBeCloseTo(5.4567, 2);
  });
});
