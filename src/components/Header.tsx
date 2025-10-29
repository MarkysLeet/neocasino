import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="fixed left-0 right-0 top-0 z-20 bg-gradient-to-b from-background/95 to-background/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-2xl font-semibold text-white/90 lg:text-3xl">{title}</h1>
          <p className="text-sm text-white/60">{subtitle}</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-white/60">
            {t('footer.disclaimer')}
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default Header;
