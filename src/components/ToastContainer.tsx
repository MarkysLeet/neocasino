import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '../stores/toastStore';
import { useEffect } from 'react';

const toneStyles: Record<string, string> = {
  success: 'from-emerald-500/80 to-emerald-400/60 text-emerald-50',
  warning: 'from-amber-500/80 to-amber-400/60 text-amber-50',
  info: 'from-blue-500/80 to-blue-400/60 text-blue-50'
};

const ToastContainer = () => {
  const { items, removeToast } = useToastStore();

  useEffect(() => {
    const timers = items.map((item) => setTimeout(() => removeToast(item.id), 3200));
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [items, removeToast]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {items.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto rounded-2xl bg-gradient-to-br px-4 py-3 shadow-card ${toneStyles[toast.tone]}`}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
