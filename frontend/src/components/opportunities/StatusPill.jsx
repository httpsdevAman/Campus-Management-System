const STATUS_STYLES = {
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  APPROVED:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  REJECTED:
    "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

const TYPE_STYLES = {
  Internship:
    "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  Project:
    "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  Hackathon:
    "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
  Scholarship:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
};

export const StatusPill = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${
      STATUS_STYLES[status] || STATUS_STYLES.PENDING
    }`}
  >
    {status === "IN_REVIEW" ? "In Review" : status?.charAt(0) + status?.slice(1).toLowerCase()}
  </span>
);

export const TypePill = ({ type }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${
      TYPE_STYLES[type] || "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/50"
    }`}
  >
    {type}
  </span>
);

export default StatusPill;
