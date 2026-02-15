import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { listOpportunitiesForFaculty } from "../../services/opportunityService";
import OpportunityCard from "../../components/opportunities/OpportunityCard";
import FilterChips from "../../components/grievances/FilterChips";

const TYPES = ["All", "Internship", "Project", "Hackathon", "Scholarship"];

const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="h-5 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="ml-auto h-4 w-14 rounded bg-slate-200 dark:bg-white/10" />
    </div>
    <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
    <div className="mt-3 space-y-1.5">
      <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
    </div>
  </div>
);

export default function FacultyOpportunities() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await listOpportunitiesForFaculty(user.id);
      if (mounted) setItems(data);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, [user.id]);

  const chipOptions = useMemo(() =>
    TYPES.map((t) => ({
      value: t,
      label: t,
      count: t === "All" ? items.length : items.filter((o) => o.type === t).length,
    })),
    [items]
  );

  const filtered = useMemo(() => {
    let pool = items;
    if (type !== "All") pool = pool.filter((o) => o.type === type);
    if (q) {
      const lower = q.toLowerCase();
      pool = pool.filter((o) =>
        o.title.toLowerCase().includes(lower) ||
        o.type.toLowerCase().includes(lower)
      );
    }
    return pool;
  }, [items, type, q]);

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
            My Opportunities
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
            Create and manage your opportunity postings for students.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/faculty/opportunities/new")}
          className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer"
        >
          + New Opportunity
        </motion.button>
      </div>

      {/* Chips + search */}
      <div className="mb-4">
        <FilterChips options={chipOptions} value={type} onChange={setType} />
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or type..."
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200 md:max-w-sm"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
        >
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center transition-colors duration-300">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <p className="text-lg font-semibold text-slate-800 dark:text-white/85">
                No opportunities found
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 dark:text-white/40">
                {q
                  ? "No results match your search."
                  : type !== "All"
                    ? `No ${type.toLowerCase()} opportunities posted.`
                    : "You haven't posted any opportunities yet."}
              </p>
              {!q && type === "All" && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/faculty/opportunities/new")}
                  className="mt-5 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Create your first opportunity
                </motion.button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {filtered.map((opp, i) => (
                <OpportunityCard
                  key={opp.id}
                  opp={opp}
                  index={i}
                  onClick={() => navigate(`/faculty/opportunities/${opp.id}`)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
