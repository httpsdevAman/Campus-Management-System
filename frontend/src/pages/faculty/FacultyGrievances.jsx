import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listGrievancesByCreator } from "../../services/grievanceService";
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

const OPEN = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS"];
const CLOSED = ["RESOLVED", "CLOSED"];

export default function FacultyGrievances() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await listGrievancesByCreator(user.id);
      if (mounted) setItems(data);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, [user.id]);

  const filtered = useMemo(() => {
    let pool = items;
    if (filter === "OPEN") pool = items.filter((g) => OPEN.includes(g.status));
    else if (filter === "CLOSED") pool = items.filter((g) => CLOSED.includes(g.status));

    if (!q) return pool;
    return pool.filter(
      (g) =>
        g.id.toLowerCase().includes(q.toLowerCase()) ||
        g.title.toLowerCase().includes(q.toLowerCase())
    );
  }, [items, q, filter]);

  const chipOptions = useMemo(() => [
    { value: "ALL", label: "All", count: items.length },
    { value: "OPEN", label: "Open", count: items.filter((g) => OPEN.includes(g.status)).length },
    { value: "CLOSED", label: "Closed", count: items.filter((g) => CLOSED.includes(g.status)).length },
  ], [items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Grievances
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
            Create and track your complaints with status updates.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/faculty/grievances/new")}
          className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          + New Grievance
        </motion.button>
      </div>

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
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center transition-colors duration-300">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-500 dark:text-indigo-400">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white/85">
                No grievances found
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 dark:text-white/40">
                {q
                  ? "No results match your search. Try a different keyword."
                  : filter !== "ALL"
                    ? `No ${filter.toLowerCase()} grievances right now.`
                    : "You haven't submitted any grievances yet. Create one to get started."}
              </p>
              {!q && filter === "ALL" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/faculty/grievances/new")}
                  className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Create your first grievance
                </motion.button>
              )}
            </div>
          ) : (
            <GrievanceTable
              items={filtered}
              onOpen={(id) => navigate(`/faculty/grievances/${id}`)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
