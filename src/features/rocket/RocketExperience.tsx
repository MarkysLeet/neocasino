import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BackgroundStars from '../../components/BackgroundStars';
import GlassCard from '../../components/GlassCard';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import LiveGraph from '../../components/LiveGraph';
import QuickActionsPanel from '../../components/QuickActionsPanel';
import RocketCanvas from '../../components/RocketCanvas';
import ToastContainer from '../../components/ToastContainer';
import BettingPanel from '../../features/betting/BettingPanel';
import RoundHistory from '../../features/history/RoundHistory';
import useGameManager from '../../hooks/useGameManager';
import Footer from '../../components/Footer';
import { GamePhase } from '../../stores/gameStore';

const phaseTitles: Record<GamePhase, string> = {
  betting: 'phase.betting',
  launching: 'phase.launching',
  inflight: 'phase.inflight',
  crashed: 'phase.crashed',
  result: 'phase.result'
};

const RocketExperience = () => {
  const { phase, multiplier, nextRoundCountdown, init, cashOut } = useGameManager();
  const { t } = useTranslation();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050914] p-6 text-white shadow-card lg:p-10">
      <BackgroundStars mode="section" className="opacity-60" />
      <div className="relative z-10 flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-neon lg:text-4xl">{t('app.title')}</h2>
            <p className="text-sm text-white/60">{t(phaseTitles[phase])}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/70">
              {t('footer.disclaimer')}
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-6">
            <GlassCard>
              <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="text-5xl font-semibold text-neon"
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {multiplier.toFixed(2)}×
                  </motion.div>
                  <div className="text-sm uppercase tracking-widest text-lavender">
                    {phase !== 'betting'
                      ? t('game.nextRoundIn', { seconds: Math.max(0, nextRoundCountdown) })
                      : t('game.waitingForLaunch')}
                  </div>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#101626]">
                  <RocketCanvas />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                </div>
                <LiveGraph />
              </div>
            </GlassCard>
            <RoundHistory />
          </div>
          <div className="flex flex-col gap-6">
            <BettingPanel onCashOut={cashOut} />
            <QuickActionsPanel />
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default RocketExperience;
