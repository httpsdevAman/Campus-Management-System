import { motion } from "framer-motion";
import { initials } from "../../utils/string";
import RolePill from "./RolePill";
import StatusPill from "./StatusPill";

const avatarGrad = {
  student:   "from-indigo-500 to-violet-500",
  faculty:   "from-violet-500 to-purple-500",
  authority: "from-amber-500 to-orange-500",
  admin:     "from-rose-500 to-pink-500",
};

/**
 * Mobile stacked user card.
 * Props: { user, currentAdminId, onNavigate, onEdit, onToggleStatus, onDelete }
 */
export default function UserCard({ user: u, currentAdminId, onNavigate, onEdit, onToggleStatus, onDelete }) {
  const isSelf = u.id === currentAdminId;

  return (
    <motion.div
      whileHover={{ y: -1 }}
      onClick={() => onNavigate(u.id)}
      className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-4 cursor-pointer transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrad[u.role] || avatarGrad.student} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {initials(u.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-white/80 truncate">{u.name}</p>
          <p className="text-[11px] text-slate-400 dark:text-white/30 truncate">{u.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <RolePill role={u.role} />
        <StatusPill status={u.status} />
        {u.department && <span className="text-[10px] font-medium text-slate-400 dark:text-white/30">{u.department}</span>}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-200/30 dark:border-white/[0.04]" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit(u)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 hover:bg-indigo-500/15 transition-colors cursor-pointer">
          Edit
        </button>
        {u.status !== "DELETED" && (
          <button onClick={() => onToggleStatus(u)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 hover:bg-amber-500/15 transition-colors cursor-pointer">
            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
          </button>
        )}
        {!isSelf && u.status !== "DELETED" && (
          <button onClick={() => onDelete(u)} className="flex-1 rounded-lg py-2 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-400/10 hover:bg-red-500/15 transition-colors cursor-pointer">
            Delete
          </button>
        )}
      </div>
    </motion.div>
  );
}
