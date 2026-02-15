import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listUsers, updateUser, changeUserStatus, deleteUser } from "../../services/userService";
import UserTable from "../../components/users/UserTable";
import UserCard from "../../components/users/UserCard";
import UserEditModal from "../../components/users/UserEditModal";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import { safeLower } from "../../utils/string";

/* ── Role chips ── */
const ROLE_FILTERS = [
  { key: "all",       label: "All" },
  { key: "student",   label: "Students" },
  { key: "faculty",   label: "Faculty" },
  { key: "authority", label: "Authority" },
  { key: "admin",     label: "Admin" },
];

/* ── Skeleton rows ── */
function Skeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-slate-200/40 dark:border-white/[0.04] bg-white/40 dark:bg-white/[0.01] p-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/[0.06]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/[0.06]" />
              <div className="h-2 w-48 rounded bg-slate-200/60 dark:bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Animation ── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

/* ══════════════════════════════════════
   Admin Users List Page
   ══════════════════════════════════════ */
export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // modal / confirm / toast state
  const [editUser, setEditUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type, user }
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  const by = useMemo(() => ({ id: user?.id, name: user?.name, role: user?.role }), [user]);

  const reload = useCallback(async () => {
    const data = await listUsers();
    setUsers(data);
  }, []);

  useEffect(() => { reload().then(() => setLoading(false)); }, [reload]);

  function showToast(type, message) { setToast({ open: true, type, message }); }

  /* ── Filtered users (search + role only) ── */
  const filtered = useMemo(() => {
    let list = users;

    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);

    if (search.trim()) {
      const q = safeLower(search);
      list = list.filter((u) =>
        safeLower(u.name).includes(q) ||
        safeLower(u.email).includes(q) ||
        safeLower(String(u.id)).includes(q) ||
        safeLower(u.studentId || "").includes(q) ||
        safeLower(u.employeeId || "").includes(q)
      );
    }

    return list;
  }, [users, search, roleFilter]);

  /* ── Action handlers ── */
  async function handleEditSave(patch) {
    try {
      await updateUser({ id: editUser.id, patch, by });
      await reload();
      setEditUser(null);
      showToast("success", "User updated");
    } catch (e) { showToast("error", e.message); }
  }

  async function handleConfirm() {
    const { type, user: target } = confirmAction;
    try {
      if (type === "toggle") {
        const next = target.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
        await changeUserStatus({ id: target.id, status: next, by });
        showToast("success", next === "ACTIVE" ? "User activated" : "User suspended");
      } else if (type === "delete") {
        await deleteUser({ id: target.id, by });
        showToast("success", "User deleted");
      }
      await reload();
    } catch (e) { showToast("error", e.message); }
    setConfirmAction(null);
  }

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

        {/* ── Header ── */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white/90">Users</h1>
          <p className="text-[13px] font-medium text-slate-400 dark:text-white/30 mt-1">
            {loading ? "Loading…" : `${filtered.length} user${filtered.length !== 1 ? "s" : ""}`}
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-slate-200/80 via-slate-200/40 to-transparent dark:from-white/[0.06] dark:via-white/[0.03] dark:to-transparent" />
        </motion.div>

        {/* ── Controls ── */}
        <motion.div variants={item} className="space-y-3">
          {/* Search */}
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID…"
              className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] backdrop-blur pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 placeholder:text-slate-400 dark:placeholder:text-white/25 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  roleFilter === f.key
                    ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                    : "text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50 hover:bg-slate-100/50 dark:hover:bg-white/[0.04]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content ── */}
        <motion.div variants={item}>
          {loading ? (
            <Skeleton />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl py-16 text-center">
              <p className="text-sm font-semibold text-slate-500 dark:text-white/40">No users found</p>
              <button
                onClick={() => { setSearch(""); setRoleFilter("all"); }}
                className="mt-3 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <UserTable
                  users={filtered}
                  currentAdminId={user?.id}
                  onNavigate={(id) => navigate(`/admin/users/${id}`)}
                  onEdit={(u) => setEditUser(u)}
                  onToggleStatus={(u) => setConfirmAction({ type: "toggle", user: u })}
                  onDelete={(u) => setConfirmAction({ type: "delete", user: u })}
                />
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden space-y-3">
                <AnimatePresence>
                  {filtered.map((u) => (
                    <motion.div key={u.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <UserCard
                        user={u}
                        currentAdminId={user?.id}
                        onNavigate={(id) => navigate(`/admin/users/${id}`)}
                        onEdit={(u) => setEditUser(u)}
                        onToggleStatus={(u) => setConfirmAction({ type: "toggle", user: u })}
                        onDelete={(u) => setConfirmAction({ type: "delete", user: u })}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* ── Edit Modal ── */}
      <UserEditModal open={!!editUser} user={editUser} onSave={handleEditSave} onClose={() => setEditUser(null)} />

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.type === "delete" ? "Delete User" : confirmAction?.user?.status === "ACTIVE" ? "Suspend User" : "Activate User"}
        message={
          confirmAction?.type === "delete"
            ? `Are you sure you want to delete "${confirmAction?.user?.name}"? This action will mark the account as deleted.`
            : confirmAction?.user?.status === "ACTIVE"
              ? `Suspend "${confirmAction?.user?.name}"? They will lose access until reactivated.`
              : `Activate "${confirmAction?.user?.name}"? They will regain full access.`
        }
        confirmLabel={confirmAction?.type === "delete" ? "Delete" : confirmAction?.user?.status === "ACTIVE" ? "Suspend" : "Activate"}
        danger={confirmAction?.type === "delete" || confirmAction?.user?.status === "ACTIVE"}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      {/* ── Toast ── */}
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
    </>
  );
}
