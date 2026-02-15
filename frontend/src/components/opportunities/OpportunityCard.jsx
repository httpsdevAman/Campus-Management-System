import { motion } from "framer-motion";
import { TypePill } from "./StatusPill";
import { formatDate, timeAgo } from "../../utils/date";

const OpportunityCard = ({ opp, index = 0, onClick }) => {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(opp.deadline) - Date.now()) / 86400000)
  );
  const expired = daysLeft === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      onClick={onClick}
      className="group rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 cursor-pointer transition-all duration-200 hover:border-slate-300/70 dark:hover:border-white/[0.1] hover:bg-white/80 dark:hover:bg-white/[0.035] hover:shadow-sm"
    >
      {/* Top row: type + deadline */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <TypePill type={opp.type} />
        <span
          className={`text-[11px] font-semibold shrink-0 ${
            expired
              ? "text-slate-400 dark:text-white/25"
              : daysLeft <= 3
                ? "text-rose-500 dark:text-rose-400"
                : daysLeft <= 7
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-slate-400 dark:text-white/35"
          }`}
        >
          {expired ? "Deadline passed" : `${daysLeft}d left`}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-slate-800 dark:text-white/90 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200">
        {opp.title}
      </h3>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-white/35">
        {opp.location && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {opp.location}
          </span>
        )}
        {opp.stipend && (
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {opp.stipend}
          </span>
        )}
        <span>Deadline {formatDate(opp.deadline)}</span>
      </div>

      {/* Description preview */}
      <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-white/45 line-clamp-2">
        {opp.description}
      </p>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 dark:text-white/25">
        <span>By {opp.postedBy?.name}</span>
        <span>{timeAgo(opp.createdAt)}</span>
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
