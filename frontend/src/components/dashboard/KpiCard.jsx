import { motion } from "framer-motion";

const colorMap = {
  indigo:  { icon: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",  glow: "group-hover:shadow-indigo-500/5 dark:group-hover:shadow-indigo-400/5" },
  violet:  { icon: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",  glow: "group-hover:shadow-violet-500/5 dark:group-hover:shadow-violet-400/5" },
  emerald: { icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300", glow: "group-hover:shadow-emerald-500/5 dark:group-hover:shadow-emerald-400/5" },
  amber:   { icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",    glow: "group-hover:shadow-amber-500/5 dark:group-hover:shadow-amber-400/5" },
  rose:    { icon: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",      glow: "group-hover:shadow-rose-500/5 dark:group-hover:shadow-rose-400/5" },
  sky:     { icon: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",        glow: "group-hover:shadow-sky-500/5 dark:group-hover:shadow-sky-400/5" },
};

export default function KpiCard({ value, label, icon, trend, color = "indigo" }) {
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`group rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-5 transition-shadow duration-300 shadow-sm ${c.glow} hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
            trend.up
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-500 dark:text-red-400"
          }`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={trend.up ? "" : "rotate-180"}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white/90 leading-none tracking-tight">
        {value}
      </p>
      <p className="mt-1.5 text-xs font-medium text-slate-400 dark:text-white/35">
        {label}
      </p>
    </motion.div>
  );
}
