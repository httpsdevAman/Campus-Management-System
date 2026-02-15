const colors = {
  ACTIVE:    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  SUSPENDED: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  DELETED:   "bg-red-500/10 text-red-500 dark:bg-red-400/10 dark:text-red-400",
};

export default function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[status] || colors.ACTIVE}`}>
      {status}
    </span>
  );
}
