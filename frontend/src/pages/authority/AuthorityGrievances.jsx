import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listAssignedGrievances } from "../../services/grievanceService";
import GrievanceTable from "../../components/grievances/GrievanceTable";
import FilterChips from "../../components/grievances/FilterChips";

const SkeletonRow = () => (
  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-48 rounded bg-slate-200 dark:bg-white/10" />
      <div className="ml-auto h-4 w-16 rounded bg-slate-200 dark:bg-white/10" />
    </div>
  </div>
);

const ACTIVE = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"];
const CLOSED = ["RESOLVED", "CLOSED"];

export default function AuthorityGrievances() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ACTIVE");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await listAssignedGrievances(user.id);
      if (mounted) setItems(data);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, [user.id]);

  const counts = useMemo(() => {
    const c = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    items.forEach((g) => { if (c[g.status] != null) c[g.status]++; });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    let pool = items;
    if (filter === "ACTIVE") pool = items.filter((g) => ACTIVE.includes(g.status));
    else if (filter === "CLOSED") pool = items.filter((g) => CLOSED.includes(g.status));

    if (!q) return pool;
    return pool.filter(
      (g) =>
        g.id.toLowerCase().includes(q.toLowerCase()) ||
        g.title.toLowerCase().includes(q.toLowerCase())
    );
  }, [items, q, filter]);

  const chipOptions = [
    { value: "ACTIVE", label: "Active", count: counts.SUBMITTED + counts.UNDER_REVIEW + counts.IN_PROGRESS },
    { value: "CLOSED", label: "Closed", count: counts.RESOLVED + counts.CLOSED },
    { value: "ALL", label: "All", count: items.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Assigned Grievances
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
          Update statuses and add resolution remarks.
        </p>
      </div>

      {/* Status summary */}
      {!loading && items.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {[
            { label: "Submitted", count: counts.SUBMITTED, color: "text-amber-600 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10" },
            { label: "Under Review", count: counts.UNDER_REVIEW, color: "text-blue-600 dark:text-blue-300 bg-blue-500/10 dark:bg-blue-400/10" },
            { label: "In Progress", count: counts.IN_PROGRESS, color: "text-violet-600 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-400/10" },
            { label: "Resolved", count: counts.RESOLVED, color: "text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-400/10" },
            { label: "Closed", count: counts.CLOSED, color: "text-slate-600 dark:text-slate-300 bg-slate-500/10 dark:bg-slate-400/10" },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold ${s.color}`}
            >
              <span className="text-sm font-bold">{s.count}</span>
              {s.label}
            </div>
          ))}
        </div>
      )}

      {/* Chips + search */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterChips options={chipOptions} value={filter} onChange={setFilter} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by ID or title..."
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200 md:max-w-xs"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {loading ? (
            <div className="space-y-2">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-8 text-center transition-colors duration-300">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/[0.05]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-white/30">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-white/80">
                No grievances here
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
                {q
                  ? "Try adjusting your search."
                  : filter === "ACTIVE"
                    ? "No active grievances assigned to you right now."
                    : filter === "CLOSED"
                      ? "No closed grievances yet."
                      : "No grievances assigned to you."}
              </p>
            </div>
          ) : (
            <GrievanceTable
              items={filtered}
              onOpen={(id) => navigate(`/authority/grievances/${id}`)}
              showAssigned={false}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
