import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "../../utils/date";

/* ── Icon helpers ── */
const MaterialIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-indigo-500 dark:text-indigo-400">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

const AssignIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-amber-500 dark:text-amber-400">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function ItemCard({ item, editable, onItemClick, onAssignmentClick }) {
  const [expanded, setExpanded] = useState(false);
  const isAssignment = item.kind === "ASSIGNMENT";
  const Icon = isAssignment ? AssignIcon : MaterialIcon;
  const meta = item.meta || {};
  const dueDate = meta.dueAt ? new Date(meta.dueAt) : null;
  const isPast = dueDate && dueDate < new Date();

  const isHidden = item.published === false;

  const handleClick = () => {
    if (editable && onItemClick) {
      onItemClick(item);
    } else if (isAssignment && onAssignmentClick) {
      onAssignmentClick(item);
    }
  };

  const clickable = (editable && onItemClick) || (isAssignment && onAssignmentClick);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className={`group rounded-xl border border-slate-200/50 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.02] p-3.5 transition-all duration-200 ${
        clickable
          ? "cursor-pointer hover:border-slate-300/60 dark:hover:border-white/[0.09] hover:bg-white/60 dark:hover:bg-white/[0.035] hover:shadow-sm hover:-translate-y-0.5"
          : "hover:border-slate-300/60 dark:hover:border-white/[0.09]"
      } ${isHidden ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {item.url && !isAssignment && !editable ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-semibold text-slate-800 dark:text-white/85 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                >
                  {item.title}
                </a>
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{item.title}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Hidden pill (faculty only) */}
              {isHidden && editable && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/40">
                  Hidden
                </span>
              )}
              {isAssignment && meta.submissionRequired && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  item.submissions?.length
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                    : "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                }`}>
                  {item.submissions?.length ? "Submitted" : "Submit"}
                </span>
              )}
              {isAssignment && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    isPast
                      ? "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-white/30"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                  }`}
                >
                  {isPast ? "Closed" : "Open"}
                </span>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 dark:text-white/30">
            {item.createdAt && <span>{formatDate(item.createdAt)}</span>}
            {isAssignment && dueDate && (
              <span className={isPast ? "text-slate-400 dark:text-white/25" : "text-amber-500 dark:text-amber-400 font-semibold"}>
                Due {formatDate(meta.dueAt)}
              </span>
            )}
            {isAssignment && meta.points != null && (
              <span>{meta.points} pts</span>
            )}
            {isAssignment && item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                View PDF
              </a>
            )}
            {item.attachment && (
              <span className="inline-flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                {item.attachment.name}
              </span>
            )}
          </div>

          {/* Description preview */}
          {item.description && (
            <>
              <p className={`mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-white/45 ${
                !expanded ? "line-clamp-2" : ""
              }`}>
                {item.description}
              </p>
              {item.description.length > 120 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                  className="mt-1 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-white/[0.05] dark:text-white/35">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function SectionContentRenderer({ items = [], editable = false, onItemClick, onAssignmentClick }) {
  if (items.length === 0) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/25">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-400 dark:text-white/30">No materials yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} editable={editable} onItemClick={onItemClick} onAssignmentClick={onAssignmentClick} />
      ))}
    </div>
  );
}
