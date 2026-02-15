const STATUS_STYLES = {
  SUBMITTED:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  UNDER_REVIEW:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
  IN_PROGRESS:
    "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  RESOLVED:
    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
  CLOSED:
    "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
  // Legacy
  PENDING:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  IN_REVIEW:
    "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
  REJECTED:
    "bg-slate-500/10 text-slate-600 dark:bg-slate-400/10 dark:text-slate-300",
};

const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  PENDING: "Submitted",
  IN_REVIEW: "Under Review",
  REJECTED: "Closed",
};

const PRIORITY_STYLES = {
  LOW: "bg-slate-500/10 text-slate-500 dark:bg-slate-400/10 dark:text-slate-400",
  MEDIUM:
    "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  HIGH: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

export const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-colors duration-200 ${
      STATUS_STYLES[status] || STATUS_STYLES.SUBMITTED
    }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

export const PriorityBadge = ({ priority }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-colors duration-200 ${
      PRIORITY_STYLES[priority] || PRIORITY_STYLES.LOW
    }`}
  >
    {priority}
  </span>
);

export default StatusBadge;
