import { motion } from "framer-motion";

// Flow: Submitted → Under Review → In Progress → Resolved | Closed
const STEPS = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "RESOLVED", label: "Resolved / Closed" }, // label replaced by Resolved or Closed below
];

const STATUS_INDEX = {
  SUBMITTED: 0,
  UNDER_REVIEW: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 3,
};

function getColors(i, status) {
  // Step 3: Resolved (green) or Closed (slate/rose)
  if (i === 3) {
    if (status === "RESOLVED")
      return {
        grad: "from-emerald-500 to-emerald-600",
        glow: "shadow-emerald-500/30 dark:shadow-emerald-500/20",
        ring: "bg-emerald-500/15 dark:bg-emerald-400/10",
        pulse: "bg-emerald-500 dark:bg-emerald-400",
        label: "text-emerald-600 dark:text-emerald-300",
      };
    if (status === "CLOSED")
      return {
        grad: "from-slate-500 to-slate-600",
        glow: "shadow-slate-500/25 dark:shadow-slate-400/20",
        ring: "bg-slate-500/15 dark:bg-slate-400/10",
        pulse: "bg-slate-500 dark:bg-slate-400",
        label: "text-slate-600 dark:text-slate-300",
      };
    // default for step 3 (e.g. still In Progress)
    return {
      grad: "from-slate-400 to-slate-500",
      glow: "shadow-slate-500/20",
      ring: "bg-slate-400/10",
      pulse: "bg-slate-400",
      label: "text-slate-500 dark:text-slate-400",
    };
  }

  // Step 0 — Submitted (amber)
  if (i === 0)
    return {
      grad: "from-amber-400 to-amber-500",
      glow: "shadow-amber-500/30 dark:shadow-amber-500/20",
      ring: "bg-amber-500/15 dark:bg-amber-400/10",
      pulse: "bg-amber-500 dark:bg-amber-400",
      label: "text-amber-600 dark:text-amber-300",
    };

  // Step 1 — Under Review (blue / indigo)
  if (i === 1)
    return {
      grad: "from-blue-500 to-indigo-500",
      glow: "shadow-blue-500/30 dark:shadow-indigo-500/25",
      ring: "bg-blue-500/12 dark:bg-indigo-400/10",
      pulse: "bg-blue-500 dark:bg-indigo-400",
      label: "text-blue-600 dark:text-indigo-300",
    };

  // Step 2 — In Progress (violet)
  if (i === 2)
    return {
      grad: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/30 dark:shadow-violet-500/25",
      ring: "bg-violet-500/12 dark:bg-violet-400/10",
      pulse: "bg-violet-500 dark:bg-violet-400",
      label: "text-violet-600 dark:text-violet-300",
    };

  return {
    grad: "from-indigo-500 to-indigo-600",
    glow: "shadow-indigo-500/30",
    ring: "bg-indigo-500/12",
    pulse: "bg-indigo-500",
    label: "text-indigo-600 dark:text-indigo-300",
  };
}

const StatusProgress = ({ status }) => {
  const idx = STATUS_INDEX[status] ?? 0;
  const progress = (idx / (STEPS.length - 1)) * 100;

  const steps = STEPS.map((s, i) => {
    if (i !== 3) return s;
    return {
      key: status === "CLOSED" ? "CLOSED" : "RESOLVED",
      label: status === "CLOSED" ? "Closed" : "Resolved",
    };
  });

  const trackGrad =
    status === "CLOSED"
      ? "from-amber-400 via-blue-500 via-violet-500 to-slate-500"
      : status === "RESOLVED"
      ? "from-amber-400 via-blue-500 via-violet-500 to-emerald-500"
      : status === "IN_PROGRESS"
      ? "from-amber-400 via-blue-500 to-violet-500"
      : status === "UNDER_REVIEW"
      ? "from-amber-400 to-blue-500"
      : "from-amber-400 to-amber-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm px-4 sm:px-6 py-5 transition-colors duration-300"
    >
      <div className="relative">
        <div className="absolute top-[17px] left-[calc(100%/8)] right-[calc(100%/8)] h-[2px] overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-slate-200/80 dark:bg-white/[0.06]" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${trackGrad}`}
          />
        </div>

        <div className="relative grid grid-cols-4 gap-0">
          {steps.map((step, i) => {
            const done = i < idx;
            const cur = i === idx;
            const c = getColors(i, status);

            return (
              <div key={`${step.key}-${i}`} className="flex flex-col items-center">
                <div className="relative flex items-center justify-center w-9 h-9">
                  {cur && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className={`absolute inset-0 rounded-full ${c.ring}`}
                    />
                  )}
                  {cur && (
                    <motion.div
                      animate={{ scale: [1, 2.4], opacity: [0.35, 0] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className={`absolute w-3 h-3 rounded-full ${c.pulse}`}
                    />
                  )}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 16,
                      delay: i * 0.08 + 0.1,
                    }}
                    className={`relative z-10 rounded-full transition-all duration-500 ${
                      done
                        ? `w-3 h-3 bg-gradient-to-br ${c.grad}`
                        : cur
                        ? `w-3.5 h-3.5 bg-gradient-to-br ${c.grad} shadow-lg ${c.glow}`
                        : "w-3 h-3 border-2 border-slate-300 dark:border-white/[0.12] bg-white dark:bg-white/[0.03]"
                    }`}
                  />
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 + 0.35 }}
                  className={`text-[10px] font-semibold tracking-wide text-center transition-colors duration-300 ${
                    cur
                      ? c.label
                      : done
                      ? "text-slate-500 dark:text-white/50"
                      : "text-slate-400 dark:text-white/25"
                  }`}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StatusProgress;
