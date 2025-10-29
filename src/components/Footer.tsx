import GlassCard from './GlassCard';
import { useGameStore } from '../stores/gameStore';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { roundHash } = useGameStore();
  const { t } = useTranslation();

  return (
    <GlassCard>
      <div className="flex flex-col gap-3 p-5 text-xs text-white/60">
        <div className="flex items-center justify-between">
          <span className="uppercase tracking-[0.2em]">{t('footer.hashLabel')}</span>
          <code className="rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] text-neon">
            {roundHash || '—'}
          </code>
        </div>
        <p>{t('footer.disclaimer')}</p>
      </div>
    </GlassCard>
  );
};

export default Footer;
