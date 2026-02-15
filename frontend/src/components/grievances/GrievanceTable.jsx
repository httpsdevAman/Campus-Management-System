import { StatusBadge, PriorityBadge } from "./StatusBadge";
import { timeAgo } from "../../utils/date";

const GrievanceTable = ({ items = [], onOpen, showAssigned = true, renderAction }) => {
  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] overflow-hidden transition-colors duration-300">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 dark:border-white/[0.06]">
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                ID
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                Title
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                Category
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                Status
              </th>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                Priority
              </th>
              {showAssigned && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                  Assigned
                </th>
              )}
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                Updated
              </th>
              {renderAction && (
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/35">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {items.map((g) => (
              <tr
                key={g.id}
                onClick={() => onOpen?.(g.id)}
                className="cursor-pointer transition-colors duration-150 hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-white/50">
                  {g.id}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white/85 max-w-[250px] truncate">
                  {g.title}
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-white/50">
                  {g.category}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={g.status} />
                </td>
                <td className="px-5 py-3.5">
                  <PriorityBadge priority={g.priority} />
                </td>
                {showAssigned && (
                  <td className="px-5 py-3.5 text-slate-500 dark:text-white/50">
                    {g.assignedTo?.name || (
                      <span className="text-slate-300 dark:text-white/20">
                        Unassigned
                      </span>
                    )}
                  </td>
                )}
                <td className="px-5 py-3.5 text-xs text-slate-400 dark:text-white/30">
                  {timeAgo(g.updatedAt)}
                </td>
                {renderAction && (
                  <td
                    className="px-5 py-3.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {renderAction(g)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {items.map((g) => (
          <div
            key={g.id}
            className="w-full rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-white/[0.04]"
          >
            <button
              onClick={() => onOpen?.(g.id)}
              className="w-full text-left cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white/85 truncate">
                    {g.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-white/35">
                    <span className="font-mono">{g.id}</span>
                    <span>·</span>
                    <span>{g.category}</span>
                    <span>·</span>
                    <span>{timeAgo(g.updatedAt)}</span>
                  </div>
                  {showAssigned && (
                    <p className="mt-1.5 text-xs text-slate-400 dark:text-white/35">
                      {g.assignedTo?.name || "Unassigned"}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={g.status} />
                  <PriorityBadge priority={g.priority} />
                </div>
              </div>
            </button>
            {renderAction && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-white/[0.04]">
                {renderAction(g)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default GrievanceTable;
