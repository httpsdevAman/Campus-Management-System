const colors = {
  student:   "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  faculty:   "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  authority: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  admin:     "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

export default function RolePill({ role }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors[role] || colors.student}`}>
      {role}
    </span>
  );
}
