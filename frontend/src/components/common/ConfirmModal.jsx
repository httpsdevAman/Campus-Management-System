import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable confirm dialog.
 * Props: { open, title, message, confirmLabel, danger, loading, onConfirm, onCancel }
 */
export default function ConfirmModal({ open, title, message, confirmLabel = "Confirm", danger = false, loading = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
          >
            <div className="w-full max-w-sm rounded-2xl border border-slate-200/50 dark:border-white/[0.08] bg-white/90 dark:bg-[#12121f]/95 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 p-6">
              <h3 className="text-base font-bold text-slate-800 dark:text-white/90 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-white/45 mb-6 leading-relaxed">{message}</p>
              <div className="flex items-center justify-end gap-2.5">
                <button
                  onClick={onCancel}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-white/50 border border-slate-200/50 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-50 ${
                    danger
                      ? "bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500"
                      : "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500/90 dark:hover:bg-indigo-500"
                  }`}
                >
                  {loading ? "Processing…" : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
