import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

/**
 * Toast notification.
 * Props: { open, type:"success"|"error", message, onClose, duration=3000 }
 */
export default function Toast({ open, type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, onClose, duration]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-6 left-1/2 z-[100] flex items-center gap-2.5 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/90 dark:bg-[#161625]/95 backdrop-blur-2xl px-4 py-3 shadow-lg shadow-black/[0.06] dark:shadow-black/40"
        >
          {icons[type] || icons.success}
          <span className="text-sm font-medium text-slate-700 dark:text-white/80">{message}</span>
          <button onClick={onClose} className="ml-2 p-0.5 rounded text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 transition-colors cursor-pointer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
