import { motion } from "framer-motion";
import KpiCard from "./KpiCard";

/* ── Stagger variants ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

/* ── Role badge colors ── */
const badgeColors = {
  student:   "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  faculty:   "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  authority: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  admin:     "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Shared dashboard skeleton for all roles.
 *
 * Props:
 *   greeting   – "Welcome back, Arnav"
 *   role       – "student" | "faculty" | …
 *   kpis       – array of { value, label, icon, trend?, color }
 *   left       – JSX for the left (2/3) column
 *   right      – JSX for the right (1/3) column
 *   bottom     – optional JSX below the grid
 */
export default function DashboardLayout({ greeting, role, kpis, left, right, bottom }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ── Header ── */}
      <motion.div variants={item}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white/90 leading-tight">
              {greeting}
            </h1>
            <div className="flex items-center gap-2.5 mt-1.5">
              <p className="text-[13px] font-medium text-slate-400 dark:text-white/30">
                {formatDate()}
              </p>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColors[role] || badgeColors.student}`}>
                {role}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 h-px bg-gradient-to-r from-slate-200/80 via-slate-200/40 to-transparent dark:from-white/[0.06] dark:via-white/[0.03] dark:to-transparent" />
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} variants={item}>
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* ── Main content: left (2/3) + right (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <motion.div variants={item} className="space-y-5 min-w-0">
          {left}
        </motion.div>
        <motion.div variants={item} className="min-w-0">
          {right}
        </motion.div>
      </div>

      {/* ── Bottom ── */}
      {bottom && (
        <motion.div variants={item}>
          {bottom}
        </motion.div>
      )}
    </motion.div>
  );
}

/* Re-export for convenience */
export { container, item };
