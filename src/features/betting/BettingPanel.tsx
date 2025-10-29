import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../../components/GlassCard';
import Tooltip from '../../components/Tooltip';
import { useBettingStore } from '../../stores/bettingStore';
import { useGameStore } from '../../stores/gameStore';
import { useToastStore } from '../../stores/toastStore';

const presets = [1, 5, 10, 25];

const formatNumber = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

interface BettingPanelProps {
  onCashOut: (multiplier: number) => boolean;
}

const BettingPanel = ({ onCashOut }: BettingPanelProps) => {
  const { t, i18n } = useTranslation();
  const {
    amount,
    balance,
    autoCashout,
    betLocked,
    autoLocked,
    hasActiveBet,
    setAmount,
    applyPreset,
    acceptBet,
    setBetLocked,
    setAutoLocked,
    setAutoCashout
  } = useBettingStore();
  const { phase, multiplier, cashedOutAt } = useGameStore();
  const addToast = useToastStore((state) => state.addToast);
  const [localAutoCashout, setLocalAutoCashout] = useState(autoCashout);

  useEffect(() => {
    setLocalAutoCashout(autoCashout);
  }, [autoCashout]);

  const handlePlaceBet = () => {
    if (amount <= 0 || amount > balance) {
      addToast({ message: t('toast.betMissed'), tone: 'warning' });
      return;
    }
    acceptBet();
    setBetLocked(true);
    setAutoLocked(true);
    addToast({ message: t('toast.betAccepted'), tone: 'success' });
  };

  const handleCashOut = () => {
    if (onCashOut(multiplier)) {
      addToast({ message: t('toast.cashoutWin', { value: multiplier.toFixed(2) }), tone: 'success' });
    }
  };

  const handleAutoCashoutChange = (value: number) => {
    if (autoLocked) {
      addToast({ message: t('toast.autoCashoutLocked'), tone: 'warning' });
      return;
    }
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric >= 1.01) {
      setLocalAutoCashout(numeric);
      setAutoCashout(numeric);
    }
  };

  const currentLabel =
    phase === 'betting' || phase === 'launching'
      ? t('bet.placeBet')
      : t('bet.cashOut', { value: multiplier.toFixed(2) });
  const isCashOut = phase === 'inflight';
  const isDisabled = isCashOut ? Boolean(cashedOutAt) || !hasActiveBet : amount <= 0 || amount > balance || betLocked;

  return (
    <GlassCard>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{t('bet.balance', { value: formatNumber(balance, i18n.language) })}</span>
          {betLocked && hasActiveBet && <span className="text-lavender">{t('bet.pending')}</span>}
        </div>
        <div className="space-y-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-white/50">{t('bet.betAmount')}</span>
            <input
              type="number"
              value={amount}
              min={0}
              step={0.1}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="focus-ring rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-lg font-semibold text-white placeholder:text-white/30"
            />
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((value) => (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.98 }}
                className="focus-ring rounded-2xl border border-white/10 bg-white/5 py-2 text-sm font-medium text-white/70 transition hover:border-neon/50 hover:text-white"
                onClick={() => applyPreset(value)}
              >
                {t('bet.quickPreset', { value })}
              </motion.button>
            ))}
          </div>
        </div>
        <Tooltip text={t('bet.autoCashoutInfo')}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
              <span>{t('bet.autoCashout')}</span>
              {autoLocked && <span className="text-neon">{t('bet.pending')}</span>}
            </div>
            <input
              type="number"
              min={1.01}
              step={0.01}
              value={localAutoCashout}
              onChange={(event) => handleAutoCashoutChange(Number(event.target.value))}
              className="focus-ring rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-lg font-semibold text-white placeholder:text-white/30"
            />
          </div>
        </Tooltip>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          className="focus-ring rounded-2xl bg-gradient-to-r from-neon to-lavender px-4 py-4 text-lg font-semibold text-background shadow-glow transition"
          onClick={isCashOut ? handleCashOut : handlePlaceBet}
          disabled={isDisabled}
        >
          {isCashOut && cashedOutAt ? t('bet.cashOutPlain') : currentLabel}
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default BettingPanel;
