import { motion } from "framer-motion";
import { formatDateTime } from "../../utils/date";

/* ── type metadata ── */
const META = {
  COMMENT: {
    label: "Comment",
    dot: "bg-slate-400 dark:bg-slate-500",
    pill: "bg-slate-500/8 text-slate-600 dark:bg-white/[0.06] dark:text-white/50",
  },
  STATUS_CHANGE: {
    label: "Status Update",
    dot: "bg-indigo-500 dark:bg-indigo-400",
    pill: "bg-indigo-500/8 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  },
  ASSIGNMENT: {
    label: "Assignment",
    dot: "bg-violet-500 dark:bg-violet-400",
    pill: "bg-violet-500/8 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  },
};

const Timeline = ({ updates = [] }) => {
  const sorted = [...updates].sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-5 transition-colors duration-300">
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 mb-5">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">
          Timeline
        </h3>
        {sorted.length > 0 && (
          <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/40">
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.04]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400 dark:text-white/25"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 dark:text-white/30">
            No updates yet.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* ── Single continuous spine ── */}
          <div className="absolute z-0 left-[15px] top-0 bottom-0 w-px bg-slate-200/80 dark:bg-white/[0.06]" />

          {/* ── Events ── z-[1] so dots sit above spine */}
          <div className="relative z-[1]">
            {sorted.map((u, i) => {
              const m = META[u.type] || META.COMMENT;

              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(i * 0.06, 0.42),
                    ease: "easeOut",
                  }}
                  className={`flex items-start ${
                    i < sorted.length - 1 ? "pb-6" : ""
                  }`}
                >
                  {/* ── Dot column ── 30 px wide; dot centered = 15 px = spine */}
                  <div className="w-[30px] shrink-0 flex justify-center pt-[5px]">
                    <div
                      className={`w-[10px] h-[10px] rounded-full ring-[3px] ring-white dark:ring-[#0c0c18] ${m.dot}`}
                    />
                  </div>

                  {/* ── Content card ── */}
                  <div className="flex-1 min-w-0">
                    <div className="rounded-xl -ml-0.5 px-3 py-2 border border-transparent hover:border-slate-200/70 dark:hover:border-white/[0.06] hover:bg-white/70 dark:hover:bg-white/[0.02] transition-all duration-200">
                      {/* Top row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${m.pill}`}
                        >
                          {m.label}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-white/30">
                          {u.by?.name}
                        </span>
                      </div>

                      {/* Message */}
                      {u.message && (
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">
                          {u.message}
                        </p>
                      )}

                      {/* Timestamp */}
                      <p className="mt-1.5 text-[11px] text-slate-400/80 dark:text-white/20">
                        {formatDateTime(u.at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
