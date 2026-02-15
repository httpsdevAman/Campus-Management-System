import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  getUserById,
  updateUser,
  changeUserRole,
  changeUserStatus,
  resetUserPassword,
  deleteUser,
} from "../../services/userService";
import { initials } from "../../utils/string";
import RolePill from "../../components/users/RolePill";
import StatusPill from "../../components/users/StatusPill";
import UserEditModal from "../../components/users/UserEditModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";

/* ── Avatar gradient ── */
const avatarGrad = {
  student:   "from-indigo-500 to-violet-500",
  faculty:   "from-violet-500 to-purple-500",
  authority: "from-amber-500 to-orange-500",
  admin:     "from-rose-500 to-pink-500",
};

/* ── Audit action icons ── */
const auditIcon = {
  UPDATED:        <span className="w-2 h-2 rounded-full bg-indigo-400" />,
  ROLE_CHANGED:   <span className="w-2 h-2 rounded-full bg-violet-400" />,
  STATUS_CHANGED: <span className="w-2 h-2 rounded-full bg-amber-400" />,
  PASSWORD_RESET: <span className="w-2 h-2 rounded-full bg-sky-400" />,
  DELETED:        <span className="w-2 h-2 rounded-full bg-red-400" />,
};

/* ── Glass card ── */
function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-5 ${className}`}>
      {title && <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-4">{title}</h3>}
      {children}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0 py-2.5 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
      <span className="sm:w-36 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-white/75">{value || "—"}</span>
    </div>
  );
}

/* ── Animation ── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

const ROLES = ["student", "faculty", "authority", "admin"];

export default function AdminUserDetail() {
  const { id } = useParams();
  const { user: admin } = useAuth();
  const navigate = useNavigate();

  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // modals
  const [editOpen, setEditOpen] = useState(false);
  const [confirm, setConfirm] = useState(null); // { type, label, message, danger }
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const [roleValue, setRoleValue] = useState("");

  const by = useMemo(() => ({ id: admin?.id, name: admin?.name, role: admin?.role }), [admin]);
  const isSelf = target?.id === admin?.id;

  const load = useCallback(async () => {
    try {
      const u = await getUserById(id);
      setTarget(u);
      setRoleValue(u.role);
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  function showToast(type, message) { setToast({ open: true, type, message }); }

  /* ── Handlers ── */
  async function handleEditSave(patch) {
    try {
      await updateUser({ id: target.id, patch, by });
      await load();
      setEditOpen(false);
      showToast("success", "User updated");
    } catch (e) { showToast("error", e.message); }
  }

  async function handleRoleChange() {
    if (roleValue === target.role) return;
    try {
      await changeUserRole({ id: target.id, role: roleValue, by });
      await load();
      showToast("success", `Role changed to ${roleValue}`);
    } catch (e) { showToast("error", e.message); }
  }

  async function handleConfirmAction() {
    try {
      if (confirm.type === "status") {
        const next = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        await changeUserStatus({ id: target.id, status: next, by });
        showToast("success", next === "ACTIVE" ? "User activated" : "User suspended");
      } else if (confirm.type === "reset") {
        await resetUserPassword({ id: target.id, by });
        showToast("success", "Password reset link sent");
      } else if (confirm.type === "delete") {
        await deleteUser({ id: target.id, by });
        showToast("success", "User deleted");
      }
      await load();
    } catch (e) { showToast("error", e.message); }
    setConfirm(null);
  }

  /* ── Loading / Not found ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (notFound || !target) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-slate-700 dark:text-white/75">User not found</p>
        <button onClick={() => navigate("/admin/users")} className="mt-3 text-sm font-semibold text-indigo-500 dark:text-indigo-400 cursor-pointer">
          &larr; Back to users
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

        {/* ── Back + title ── */}
        <motion.div variants={item} className="flex items-center gap-3">
          <button onClick={() => navigate("/admin/users")}
            className="p-2 rounded-xl border border-slate-200/50 dark:border-white/[0.06] text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white/90">User Profile</h1>
            <p className="text-xs font-medium text-slate-400 dark:text-white/30">
              {target.role === "student" ? (target.studentId || target.id) : (target.employeeId || target.id)}
            </p>
          </div>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">
            {/* Summary card */}
            <motion.div variants={item}>
              <Card>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarGrad[target.role] || avatarGrad.student} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg`}>
                    {initials(target.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white/90 truncate">{target.name}</h2>
                    <p className="text-sm text-slate-400 dark:text-white/35 truncate">{target.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <RolePill role={target.role} />
                      <StatusPill status={target.status} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Details card */}
            <motion.div variants={item}>
              <Card title="Details">
                <DetailRow label="Department" value={target.department} />
                <DetailRow label="Phone" value={target.meta?.phone} />
                {target.role === "student" && (
                  <>
                    <DetailRow label="Roll No." value={target.meta?.rollNo} />
                    <DetailRow label="Semester" value={target.meta?.semester ? `${target.meta.semester}th Semester` : null} />
                  </>
                )}
                {target.role !== "student" && (
                  <DetailRow label="Designation" value={target.meta?.designation} />
                )}
                <DetailRow label="Joined" value={target.meta?.joinedAt ? new Date(target.meta.joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : null} />
                <DetailRow label="Last Updated" value={new Date(target.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              </Card>
            </motion.div>

            {/* Audit timeline */}
            <motion.div variants={item}>
              <Card title="Audit Log">
                {(target.audit || []).length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-white/30">No audit events</p>
                ) : (
                  <div className="space-y-0">
                    {target.audit.map((a, idx) => (
                      <div key={a.id} className="flex gap-3 py-3 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
                        <div className="flex flex-col items-center pt-1.5">
                          {auditIcon[a.action] || auditIcon.UPDATED}
                          {idx < target.audit.length - 1 && <div className="w-px flex-1 bg-slate-200/40 dark:bg-white/[0.04] mt-1" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700 dark:text-white/75">{a.message}</p>
                          <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">
                            by {a.by?.name} &middot; {new Date(a.at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/[0.04] text-slate-500 dark:text-white/35">
                          {a.action.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Actions ── */}
          <motion.div variants={item}>
            <Card title="Actions">
              <div className="space-y-3">
                {/* Edit */}
                <button onClick={() => setEditOpen(true)}
                  className="w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-white/70 border border-slate-200/50 dark:border-white/[0.06] hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Edit user
                </button>

                {/* Change role */}
                <div className="rounded-xl border border-slate-200/50 dark:border-white/[0.06] p-3 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">Change Role</p>
                  <div className="flex items-center gap-2">
                    <select value={roleValue} onChange={(e) => setRoleValue(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-700 dark:text-white/70 outline-none cursor-pointer">
                      {ROLES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                    <button onClick={handleRoleChange} disabled={roleValue === target.role}
                      className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                      Save
                    </button>
                  </div>
                </div>

                {/* Toggle status */}
                {target.status !== "DELETED" && (
                  <button
                    onClick={() => setConfirm({
                      type: "status",
                      label: target.status === "ACTIVE" ? "Suspend" : "Activate",
                      message: target.status === "ACTIVE"
                        ? `Suspend "${target.name}"? They will lose access.`
                        : `Activate "${target.name}"? They will regain access.`,
                      danger: target.status === "ACTIVE",
                    })}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold border transition-colors cursor-pointer ${
                      target.status === "ACTIVE"
                        ? "text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-400/10 hover:bg-amber-50 dark:hover:bg-amber-500/5"
                        : "text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-400/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/5"
                    }`}
                  >
                    {target.status === "ACTIVE" ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                    {target.status === "ACTIVE" ? "Suspend user" : "Activate user"}
                  </button>
                )}

                {/* Reset password */}
                <button
                  onClick={() => setConfirm({ type: "reset", label: "Reset Password", message: `Send a password reset link to "${target.email}"?`, danger: false })}
                  className="w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-400/10 hover:bg-sky-50 dark:hover:bg-sky-500/5 transition-colors cursor-pointer">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Reset password
                </button>

                {/* Delete */}
                {!isSelf && target.status !== "DELETED" && (
                  <button
                    onClick={() => setConfirm({ type: "delete", label: "Delete", message: `Permanently delete "${target.name}"? This marks the account as deleted.`, danger: true })}
                    className="w-full flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-400/10 hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors cursor-pointer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    Delete user
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <UserEditModal open={editOpen} user={target} onSave={handleEditSave} onClose={() => setEditOpen(false)} />
      <ConfirmModal
        open={!!confirm}
        title={confirm?.label || ""}
        message={confirm?.message || ""}
        confirmLabel={confirm?.label || "Confirm"}
        danger={confirm?.danger}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm(null)}
      />
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
    </>
  );
}
