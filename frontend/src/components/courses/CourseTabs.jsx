import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const TABS = [
  { key: "course", label: "Course" },
  { key: "participants", label: "Participants" },
  { key: "grades", label: "Grades" },
  { key: "competencies", label: "Competencies" },
  { key: "more", label: "More" },
];

export default function CourseTabs({ active, onChange }) {
  const scrollRef = useRef(null);

  /* auto-scroll active tab into view on mobile */
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-tab="${active}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <div className="relative">
      {/* fade edges for horizontal scroll */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-slate-50 dark:from-[#0c0c18] to-transparent z-10 md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-slate-50 dark:from-[#0c0c18] to-transparent z-10 md:hidden" />

      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-hide rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur p-1"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              data-tab={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/60"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="course-tab-pill"
                  className="absolute inset-0 rounded-xl bg-white dark:bg-white/[0.08] shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-[1]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
