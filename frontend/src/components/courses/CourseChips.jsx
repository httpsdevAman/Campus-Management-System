const COLORS = {
  CSE: "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  EE: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  MATH: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  Lab: "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  Lecture: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
};

const fallback =
  "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/60";

export default function CourseChips({ items = [] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            COLORS[item] || fallback
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
