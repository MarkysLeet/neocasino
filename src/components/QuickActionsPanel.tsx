import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';
import { useBettingStore } from '../stores/bettingStore';
import Tooltip from './Tooltip';
import { useToastStore } from '../stores/toastStore';

const QuickActionsPanel = () => {
  const { t } = useTranslation();
  const {
    double,
    applyPreset,
    lastAmount,
    setAutoCashout,
    autoLocked,
    autoCashoutEnabled,
    setAutoCashoutEnabled
  } = useBettingStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleAuto = () => {
    if (autoLocked) {
      addToast({ message: t('toast.autoCashoutLocked'), tone: 'warning' });
      return;
    }
    setAutoCashout(2);
    setAutoCashoutEnabled(true);
    addToast({ message: t('graph.autoCashout', { value: '2.00' }), tone: 'info' });
  };

  return (
    <GlassCard>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{t('quick.title')}</h2>
          <InformationCircleIcon className="h-5 w-5 text-white/40" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Tooltip text={t('quick.tooltip.auto')}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              className="focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-neon/50 hover:text-white"
              onClick={handleAuto}
            >
              {t('quick.auto')}
            </motion.button>
          </Tooltip>
          <Tooltip text={t('quick.tooltip.toggleAuto')}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              className="focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-neon/50 hover:text-white"
              onClick={() => {
                if (autoLocked) {
                  addToast({ message: t('toast.autoCashoutLocked'), tone: 'warning' });
                  return;
                }
                const next = !autoCashoutEnabled;
                setAutoCashoutEnabled(next);
                addToast({
                  message: next ? t('bet.autoCashoutEnabled') : t('bet.autoCashoutDisabled'),
                  tone: next ? 'success' : 'info'
                });
              }}
            >
              {autoCashoutEnabled ? t('quick.disableAuto') : t('quick.enableAuto')}
            </motion.button>
          </Tooltip>
          <Tooltip text={t('quick.tooltip.repeat')}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              className="focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-neon/50 hover:text-white"
              onClick={() => applyPreset(lastAmount)}
            >
              {t('quick.repeat')}
            </motion.button>
          </Tooltip>
          <Tooltip text={t('quick.tooltip.double')}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              className="focus-ring rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-neon/50 hover:text-white"
              onClick={() => double()}
            >
              {t('quick.double')}
            </motion.button>
          </Tooltip>
        </div>
      </div>
    </GlassCard>
  );
};

export default QuickActionsPanel;
