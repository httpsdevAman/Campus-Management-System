import { motion } from "framer-motion";

/**
 * Wrapper for a settings section panel.
 * Props: { title, description, children, onSave, onReset, saving }
 */
export default function SettingsPanel({ title, description, children, onSave, onReset, saving }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200/40 dark:border-white/[0.04]">
        <h2 className="text-base font-bold text-slate-800 dark:text-white/90">{title}</h2>
        {description && <p className="text-xs font-medium text-slate-400 dark:text-white/30 mt-1">{description}</p>}
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {children}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/40 dark:border-white/[0.04]">
        <button
          onClick={onReset}
          className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-white/40 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200/50 dark:border-white/[0.06] transition-all cursor-pointer"
        >
          Reset to defaults
        </button>
        <motion.button
          onClick={onSave}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500/90 dark:hover:bg-indigo-500 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </motion.button>
      </div>
    </motion.div>
  );
}
