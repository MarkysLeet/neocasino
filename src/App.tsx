import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BackgroundStars from './components/BackgroundStars';
import GlassCard from './components/GlassCard';
import Header from './components/Header';
import QuickActionsPanel from './components/QuickActionsPanel';
import RocketCanvas from './components/RocketCanvas';
import RoundHistory from './features/history/RoundHistory';
import BettingPanel from './features/betting/BettingPanel';
import useGameManager from './hooks/useGameManager';
import { GamePhase } from './stores/gameStore';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import LiveGraph from './components/LiveGraph';

const phaseTitles: Record<GamePhase, string> = {
  betting: 'phase.betting',
  launching: 'phase.launching',
  inflight: 'phase.inflight',
  crashed: 'phase.crashed',
  result: 'phase.result'
};

function App() {
  const { phase, multiplier, nextRoundCountdown, init, cashOut } = useGameManager();
  const { t } = useTranslation();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundStars />
      <Header title={t('app.title')} subtitle={t(phaseTitles[phase])} />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-24 lg:flex-row">
        <div className="flex w-full flex-col gap-6 lg:w-2/3">
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
        <div className="flex w-full flex-col gap-6 lg:w-1/3">
          <BettingPanel onCashOut={cashOut} />
          <QuickActionsPanel />
          <Footer />
        </div>
      </main>
      <ToastContainer />
      <AnimatePresence>{/* reserved for modals */}</AnimatePresence>
    </div>
  );
}

export default App;
