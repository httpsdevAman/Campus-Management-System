import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  listAllGrievances,
  assignGrievance,
  getAuthorityUsers,
} from "../../services/grievanceService";
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

const optClass = "bg-white dark:bg-[#161625] dark:text-white";

export default function AdminGrievances() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [tab, setTab] = useState("UNASSIGNED");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [assigning, setAssigning] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const [data, auths] = await Promise.all([
        listAllGrievances(),
        getAuthorityUsers(),
      ]);
      if (mounted) {
        setItems(data);
        setAuthorities(auths);
      }
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  const unassignedCount = useMemo(
    () => items.filter((g) => !g.assignedTo).length,
    [items]
  );

  const tabbed = useMemo(() => {
    if (tab === "UNASSIGNED") return items.filter((g) => !g.assignedTo);
    return items;
  }, [items, tab]);

  const filtered = useMemo(() => {
    return tabbed.filter((g) => {
      const matchQ =
        !q ||
        g.id.toLowerCase().includes(q.toLowerCase()) ||
        g.title.toLowerCase().includes(q.toLowerCase());
      const matchS = status === "ALL" || g.status === status;
      return matchQ && matchS;
    });
  }, [tabbed, q, status]);

  async function quickAssign(gId, authorityId) {
    const target = authorities.find((a) => a.id === authorityId);
    if (!target) return;
    setAssigning(gId);
    const updated = await assignGrievance({ id: gId, authorityUser: target, by: user });
    setItems((prev) => prev.map((g) => (g.id === gId ? updated : g)));
    setAssigning(null);
  }

  const tabOptions = [
    { value: "UNASSIGNED", label: "Unassigned", count: unassignedCount },
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
          Grievances
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
          Monitor, assign, and manage campus grievances.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <FilterChips options={tabOptions} value={tab} onChange={setTab} />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by ID or title..."
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200 md:max-w-md"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200 md:w-56"
        >
          <option value="ALL" className={optClass}>All Status</option>
          <option value="SUBMITTED" className={optClass}>Submitted</option>
          <option value="UNDER_REVIEW" className={optClass}>Under Review</option>
          <option value="IN_PROGRESS" className={optClass}>In Progress</option>
          <option value="RESOLVED" className={optClass}>Resolved</option>
          <option value="CLOSED" className={optClass}>Closed</option>
        </select>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
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
              <SkeletonRow />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-8 text-center transition-colors duration-300">
              <p className="text-base font-semibold text-slate-700 dark:text-white/80">
                {tab === "UNASSIGNED" ? "No unassigned grievances" : "No grievances match your filters"}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
                {tab === "UNASSIGNED"
                  ? "All grievances have been assigned to authorities."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          ) : (
            <GrievanceTable
              items={filtered}
              onOpen={(id) => navigate(`/admin/grievances/${id}`)}
              renderAction={(g) => (
                <select
                  value={g.assignedTo?.id || ""}
                  onChange={(e) => quickAssign(g.id, e.target.value)}
                  disabled={assigning === g.id}
                  onClick={(e) => e.stopPropagation()}
                  className={`rounded-lg border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-2.5 py-1.5 text-xs text-slate-700 dark:text-white/80 outline-none focus:ring-2 focus:ring-indigo-400/30 disabled:opacity-50 cursor-pointer transition-colors ${
                    !g.assignedTo
                      ? "ring-1 ring-amber-400/30 dark:ring-amber-400/20"
                      : ""
                  }`}
                >
                  <option value="" className={optClass}>
                    {g.assignedTo ? "Reassign..." : "Assign..."}
                  </option>
                  {authorities.map((a) => (
                    <option key={a.id} value={a.id} className={optClass}>
                      {a.name}
                    </option>
                  ))}
                </select>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
