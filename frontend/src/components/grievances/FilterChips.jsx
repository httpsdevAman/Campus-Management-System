import { motion } from "framer-motion";

const FilterChips = ({ options, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    {options.map((opt) => {
      const active = value === opt.value;
      return (
        <motion.button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          whileTap={{ scale: 0.96 }}
          className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
            active
              ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.15)] dark:shadow-[inset_0_0_0_1px_rgba(129,140,248,0.15)]"
              : "text-slate-500 dark:text-white/45 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
          }`}
        >
          {opt.label}
          {opt.count != null && (
            <span
              className={`ml-1.5 text-[10px] font-bold ${
                active
                  ? "text-indigo-500/70 dark:text-indigo-300/60"
                  : "text-slate-400 dark:text-white/30"
              }`}
            >
              {opt.count}
            </span>
          )}
        </motion.button>
      );
    })}
  </div>
);

export default FilterChips;
