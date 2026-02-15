import { motion } from "framer-motion";

const ApiErrorState = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-6 text-center"
  >
    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4">
      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-700 dark:text-white/70 mb-1">
      Something went wrong
    </p>
    <p className="text-xs text-slate-500 dark:text-white/40 mb-4 max-w-xs">
      {message || "Failed to load data. Please try again."}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-1.5 text-xs font-medium rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
      >
        Try Again
      </button>
    )}
  </motion.div>
);

export default ApiErrorState;
