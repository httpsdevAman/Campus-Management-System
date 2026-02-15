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

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/**
 * Desktop user table.
 * Props: { users, currentAdminId, onNavigate, onEdit, onToggleStatus, onDelete }
 */
export default function UserTable({ users, currentAdminId, onNavigate, onEdit, onToggleStatus, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200/40 dark:border-white/[0.04]">
            {["User", "Role", "Status", "Department", "Updated", ""].map((h) => (
              <th key={h} className="px-5 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = u.id === currentAdminId;
            return (
              <motion.tr
                key={u.id}
                onClick={() => onNavigate(u.id)}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                className="border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0 cursor-pointer group transition-colors"
              >
                {/* User */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad[u.role] || avatarGrad.student} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                      {initials(u.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white/80 truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-white/30 truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                {/* Role */}
                <td className="px-5 py-3.5"><RolePill role={u.role} /></td>
                {/* Status */}
                <td className="px-5 py-3.5"><StatusPill status={u.status} /></td>
                {/* Department */}
                <td className="px-5 py-3.5 text-xs font-medium text-slate-500 dark:text-white/45">{u.department || "—"}</td>
                {/* Updated */}
                <td className="px-5 py-3.5 text-xs font-medium text-slate-400 dark:text-white/30 whitespace-nowrap">
                  {new Date(u.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                {/* Actions */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onEdit(u)} title="Edit"
                      className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer">
                      <EditIcon />
                    </button>
                    {u.status !== "DELETED" && (
                      <button onClick={() => onToggleStatus(u)} title={u.status === "ACTIVE" ? "Suspend" : "Activate"}
                        className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer">
                        {u.status === "ACTIVE" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        )}
                      </button>
                    )}
                    {!isSelf && u.status !== "DELETED" && (
                      <button onClick={() => onDelete(u)} title="Delete"
                        className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
