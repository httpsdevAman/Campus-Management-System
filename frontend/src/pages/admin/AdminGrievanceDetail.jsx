import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  assignGrievance,
  getAuthorityUsers,
  getGrievanceById,
  updateGrievanceStatus,
} from "../../services/grievanceService";
import StatusBadge from "../../components/grievances/StatusBadge";
import { PriorityBadge } from "../../components/grievances/StatusBadge";
import StatusProgress from "../../components/grievances/StatusProgress";
import Timeline from "../../components/grievances/Timeline";
import { formatDateTime } from "../../utils/date";

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-7 w-64 rounded bg-slate-200 dark:bg-white/10" />
    <div className="h-4 w-40 rounded bg-slate-200 dark:bg-white/10" />
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4 h-10" />
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-32" />
      </div>
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-40" />
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-48" />
      </div>
    </div>
  </div>
);

export default function AdminGrievanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [g, setG] = useState(null);
  const [authorities, setAuthorities] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [data, auths] = await Promise.all([
          getGrievanceById(id),
          getAuthorityUsers(),
        ]);
        if (!mounted) return;
        setG(data);
        setAuthorities(auths);
        setSelectedId(data.assignedTo?.id || "");
        setNewPriority(data.priority);
      } catch {
        if (mounted) setG(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id]);

  async function saveAssignment() {
    const target = authorities.find((a) => a.id === selectedId) || null;
    if (!target) return;
    setSaving(true);

    let updated = await assignGrievance({ id, authorityUser: target, by: user });

    if (newPriority && newPriority !== g.priority) {
      updated = await updateGrievanceStatus({
        id,
        status: updated.status,
        message: `Priority changed from ${g.priority} to ${newPriority}`,
        by: user,
      });
      updated.priority = newPriority;
    }

    setG(updated);
    setSaving(false);
  }

  if (loading) return <DetailSkeleton />;

  if (!g) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">Grievance not found</p>
        <button onClick={() => navigate("/admin/grievances")} className="mt-3 text-sm text-indigo-500 hover:underline cursor-pointer">
          Back to grievances
        </button>
      </div>
    );
  }

  const selectClass =
    "w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

  const optClass = "bg-white dark:bg-[#161625] dark:text-white";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{g.title}</h1>
            <StatusBadge status={g.status} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-white/40">
            <span className="font-mono text-xs">{g.id}</span>
            <span>·</span>
            <span>{g.category}</span>
            <span>·</span>
            <PriorityBadge priority={g.priority} />
            <span>·</span>
            <span className="text-xs">Updated {formatDateTime(g.updatedAt)}</span>
          </div>
        </div>
        <button onClick={() => navigate("/admin/grievances")} className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
          Back
        </button>
      </div>

      {/* Status progress */}
      <div className="mb-5">
        <StatusProgress status={g.status} />
      </div>

      {/* Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-white/90">Description</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">{g.description}</p>
          </div>

          <Timeline updates={g.updates} />
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Details card */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-white/40">Created by</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">{g.createdBy?.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Assigned to</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {g.assignedTo?.name || (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
                      Awaiting assignment
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Created</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">{formatDateTime(g.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Last updated</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">{formatDateTime(g.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {/* Assign / Reassign card */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">Assign / Reassign</h3>

            <label className="text-sm font-medium text-slate-700 dark:text-white/70">
              Authority
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className={`mt-2 ${selectClass}`}
            >
              <option value="" className={optClass}>Select authority...</option>
              {authorities.map((a) => (
                <option key={a.id} value={a.id} className={optClass}>
                  {a.name} ({a.email})
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-white/70">
              Priority
            </label>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className={`mt-2 ${selectClass}`}
            >
              <option value="LOW" className={optClass}>Low</option>
              <option value="MEDIUM" className={optClass}>Medium</option>
              <option value="HIGH" className={optClass}>High</option>
            </select>

            <motion.button
              onClick={saveAssignment}
              disabled={!selectedId || saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {saving ? "Saving..." : "Save Assignment"}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
