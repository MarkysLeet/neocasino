import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { calculateMultiplier } from '../utils/multiplier';
import { createRNG, generateCrashPoint } from '../lib/rng';
import { useBettingStore } from '../stores/bettingStore';
import { useHistoryStore } from '../stores/historyStore';
import { useToastStore } from '../stores/toastStore';

const BETTING_DURATION = 5000;
const NEXT_ROUND_DELAY = 10000;

const useGameManager = () => {
  const {
    phase,
    multiplier,
    crashPoint,
    setPhase,
    setMultiplier,
    setCrashPoint,
    setStartTimestamp,
    setRoundSeed,
    setNextRoundCountdown,
    nextRoundCountdown,
    roundSeed,
    roundHash,
    cashedOutAt,
    setCashedOutAt
  } = useGameStore();
  const {
    setBetLocked,
    setAutoLocked,
    autoCashout,
    autoCashoutEnabled,
    payout,
    clearBet,
    hasActiveBet
  } = useBettingStore();
  const { pushRound } = useHistoryStore();
  const addToast = useToastStore((state) => state.addToast);

  const rAF = useRef<number>();
  const roundStart = useRef<number>(0);

  const initRound = useCallback(() => {
    const serverSeed = crypto.randomUUID();
    const clientSeed = crypto.randomUUID();
    const nonce = Math.floor(Math.random() * 1_000_000).toString();
    const combinedSeed = `${serverSeed}:${clientSeed}:${nonce}`;
    const rng = createRNG(combinedSeed);
    const crash = generateCrashPoint(rng);

    crypto.subtle
      .digest('SHA-256', new TextEncoder().encode(combinedSeed))
      .then((buffer) =>
        Array.from(new Uint8Array(buffer))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('')
      )
      .then((hash) => setRoundSeed(combinedSeed, hash))
      .catch(() => setRoundSeed(combinedSeed, combinedSeed));

    setCrashPoint(crash);
    setMultiplier(1);
    setPhase('betting');
    setStartTimestamp(null);
    setNextRoundCountdown(Math.ceil(BETTING_DURATION / 1000));
    setCashedOutAt(null);
    clearBet();
  }, [setPhase, setMultiplier, setCrashPoint, setStartTimestamp, setNextRoundCountdown, setCashedOutAt, clearBet, setRoundSeed]);

  const concludeRound = useCallback(
    (mult: number, crash: number) => {
      const entry = {
        id: crypto.randomUUID(),
        crashPoint: crash,
        cashedOutAt: cashedOutAt ?? undefined,
        timestamp: Date.now()
      };
      pushRound(entry);
      setNextRoundCountdown(Math.ceil(NEXT_ROUND_DELAY / 1000));
      roundStart.current = performance.now();
      setPhase('result');
      setMultiplier(mult);
      clearBet();
    },
    [pushRound, cashedOutAt, setNextRoundCountdown, setPhase, setMultiplier, clearBet]
  );

  const cashOut = useCallback(
    (mult: number) => {
      if (phase !== 'inflight' || cashedOutAt || !hasActiveBet) return false;
      payout(mult);
      setCashedOutAt(mult);
      addToast({ message: `Cashout ${mult.toFixed(2)}×`, tone: 'success' });
      concludeRound(mult, crashPoint);
      return true;
    },
    [phase, cashedOutAt, hasActiveBet, payout, addToast, concludeRound, crashPoint, setCashedOutAt]
  );

  useEffect(() => {
    let bettingStart = 0;

    const tick = (time: number) => {
      if (phase === 'betting') {
        if (!bettingStart) bettingStart = time;
        const elapsed = time - bettingStart;
        const remaining = Math.max(0, BETTING_DURATION - elapsed);
        setNextRoundCountdown(Math.ceil(remaining / 1000));
        if (elapsed >= BETTING_DURATION) {
          setPhase('launching');
          setBetLocked(true);
          setAutoLocked(true);
        }
      }

      if (phase === 'launching') {
        setPhase('inflight');
        roundStart.current = time;
        setStartTimestamp(time);
      }

      if (phase === 'inflight') {
        const elapsed = time - roundStart.current;
        const currentMultiplier = calculateMultiplier(elapsed);
        setMultiplier(currentMultiplier);
        if (autoCashoutEnabled && hasActiveBet && !cashedOutAt && currentMultiplier >= autoCashout) {
          payout(autoCashout);
          setCashedOutAt(autoCashout);
          addToast({ message: `Auto cashout ${autoCashout.toFixed(2)}×`, tone: 'info' });
          concludeRound(autoCashout, crashPoint);
        } else if (currentMultiplier >= crashPoint) {
          setPhase('crashed');
          setMultiplier(crashPoint);
          addToast({ message: `Crash at ${crashPoint.toFixed(2)}×`, tone: 'warning' });
          concludeRound(crashPoint, crashPoint);
        }
      }

      if (phase === 'result') {
        const elapsed = time - roundStart.current;
        const remaining = Math.max(0, NEXT_ROUND_DELAY - elapsed);
        setNextRoundCountdown(Math.ceil(remaining / 1000));
        if (remaining <= 100) {
          initRound();
          bettingStart = 0;
        }
      }

      if (phase === 'crashed') {
        concludeRound(crashPoint, crashPoint);
      }

      rAF.current = requestAnimationFrame(tick);
    };

    rAF.current = requestAnimationFrame(tick);
    return () => {
      if (rAF.current) cancelAnimationFrame(rAF.current);
    };
  }, [phase, setPhase, setMultiplier, setStartTimestamp, autoCashout, autoCashoutEnabled, crashPoint, concludeRound, initRound, setBetLocked, setAutoLocked, setNextRoundCountdown, payout, addToast, cashedOutAt, hasActiveBet, setCashedOutAt]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  return {
    phase,
    multiplier,
    crashPoint,
    roundSeed,
    roundHash,
    nextRoundCountdown,
    cashedOutAt,
    init: initRound,
    cashOut
  } as const;
};

export default useGameManager;
