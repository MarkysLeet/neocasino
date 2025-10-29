import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import GlassCard from '../../components/GlassCard';
import { useHistoryStore } from '../../stores/historyStore';
import classNames from 'classnames';
import Tooltip from '../../components/Tooltip';

const getColor = (value: number) => {
  if (value < 1.5) return 'bg-red-500/30 text-red-200';
  if (value < 3) return 'bg-yellow-500/30 text-yellow-100';
  return 'bg-emerald-500/30 text-emerald-100';
};

const generatePreviewPoints = (crashPoint: number, width = 80) => {
  return Array.from({ length: width }, (_, index) => {
    const t = index / width;
    const value = Math.min(crashPoint, Math.exp(1.2 * t * Math.log(Math.max(1.01, crashPoint))));
    return value;
  });
};

const RoundHistory = () => {
  const { rounds } = useHistoryStore();
  const { t } = useTranslation();
  const [activeRound, setActiveRound] = useState<string | null>(null);

  const display = useMemo(() => rounds.slice(0, 12), [rounds]);
  const selected = display.find((round) => round.id === activeRound);
  const previewPoints = selected ? generatePreviewPoints(selected.crashPoint) : [];

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-6">
        <h2 className="text-lg font-semibold text-white">{t('history.title')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {display.map((round, index) => (
            <Tooltip key={round.id} text={t('history.tooltip', { value: round.crashPoint.toFixed(2) })}>
              <button
                type="button"
                onClick={() => setActiveRound((prev) => (prev === round.id ? null : round.id))}
                className={classNames(
                  'w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-neon/60',
                  getColor(round.crashPoint),
                  activeRound === round.id ? 'ring-2 ring-neon/60' : ''
                )}
              >
                <div className="text-xs text-white/50">{t('history.label', { index: index + 1 })}</div>
                <div className="text-lg">{round.crashPoint.toFixed(2)}×</div>
              </button>
            </Tooltip>
          ))}
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel mt-2 rounded-2xl border border-white/10 p-4"
            >
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
                <span>{t('history.label', { index: display.findIndex((round) => round.id === selected.id) + 1 })}</span>
                <span>{t('history.tooltip', { value: selected.crashPoint.toFixed(2) })}</span>
              </div>
              <svg viewBox="0 0 100 40" className="h-24 w-full">
                <defs>
                  <linearGradient id="previewGradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#A970FF" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#previewGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  points={previewPoints
                    .map((value, idx) => {
                      const x = (idx / Math.max(1, previewPoints.length - 1)) * 100;
                      const y = 40 - (Math.log(value) / Math.log(selected.crashPoint + 1)) * 40;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                <circle
                  cx={98}
                  cy={40 - (Math.log(selected.crashPoint) / Math.log(selected.crashPoint + 1)) * 40}
                  r="3"
                  fill="#FF5F87"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

export default RoundHistory;
