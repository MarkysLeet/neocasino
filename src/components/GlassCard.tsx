import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

interface GlassCardProps {
  className?: string;
}

const GlassCard = ({ children, className }: PropsWithChildren<GlassCardProps>) => (
  <motion.section
    className={classNames('glass-panel rounded-2xl border border-white/10 text-white', className)}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.section>
);

export default GlassCard;
