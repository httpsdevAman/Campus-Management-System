import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CalendarCard from "../../components/calendar/CalendarCard";
import { listAssignedGrievances } from "../../services/grievanceService";
import { listGlobalEvents } from "../../services/calendarService";

/* ── Icons ── */
const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-5 ${className}`}>
      {title && <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-4">{title}</h3>}
      {children}
    </div>
  );
}

const priorityStyle = {
  HIGH:   "bg-red-500/10 text-red-600 dark:text-red-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  LOW:    "bg-slate-500/10 text-slate-500 dark:text-white/40",
};
const statusStyle = {
  SUBMITTED:   "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  RESOLVED:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  CLOSED:      "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export default function AuthorityDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      listAssignedGrievances(user.id),
      listGlobalEvents(),
    ]).then(([g, ge]) => {
      if (cancelled) return;
      setGrievances(g);
      setCalEvents(ge);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* KPI data */
  const submitted = grievances.filter((g) => g.status === "SUBMITTED").length;
  const inProgress = grievances.filter((g) => g.status === "IN_PROGRESS" || g.status === "UNDER_REVIEW").length;
  const weekAgo = Date.now() - 7 * 86400000;
  const resolvedWeek = grievances.filter(
    (g) => g.status === "RESOLVED" && new Date(g.updatedAt).getTime() > weekAgo
  ).length;

  const kpis = [
    { value: String(grievances.length), label: "Total Assigned",      icon: <FlagIcon />,  color: "indigo" },
    { value: String(submitted),         label: "Submitted",           icon: <ClockIcon />, color: "amber" },
    { value: String(inProgress),        label: "In Progress",         icon: <EyeIcon />,   color: "violet" },
    { value: String(resolvedWeek),      label: "Resolved This Week",  icon: <CheckIcon />, color: "emerald" },
  ];

  /* Priority queue: not yet resolved/closed, sorted by priority */
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const queue = grievances
    .filter((g) => g.status !== "RESOLVED" && g.status !== "CLOSED")
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
    .slice(0, 6);

  /* Recently updated */
  const recent = [...grievances]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 5);

  /* ── Left column ── */
  const left = (
    <Card title="Priority Queue">
      {queue.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No pending grievances</p>
      ) : (
        <div className="space-y-2.5">
          {queue.map((g) => (
            <motion.div key={g.id} whileHover={{ x: 2 }} onClick={() => navigate(`/authority/grievances/${g.id}`)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-white/[0.04] hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{g.title}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{g.category} &middot; by {g.createdBy?.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityStyle[g.priority] || priorityStyle.LOW}`}>{g.priority}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyle[g.status] || "bg-slate-500/10 text-slate-600"}`}>{g.status.replace(/_/g, " ")}</span>
              </div>
            </motion.div>
          ))}
          <button onClick={() => navigate("/authority/grievances")} className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
            View all grievances &rarr;
          </button>
        </div>
      )}
    </Card>
  );

  /* ── Right column ── */
  const right = <CalendarCard events={calEvents} />;

  /* ── Bottom ── */
  const bottom = (
    <Card title="Recently Updated">
      {recent.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No recent activity</p>
      ) : (
        <div className="space-y-2.5">
          {recent.map((g) => (
            <div key={g.id} className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{g.title}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{g.id} &middot; {g.category}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusStyle[g.status] || "bg-slate-500/10 text-slate-600"}`}>{g.status.replace(/_/g, " ")}</span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-white/25">
                  {new Date(g.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <DashboardLayout
      greeting={`Welcome back, ${user?.name?.split(" ")[0]}`}
      role={user?.role}
      kpis={kpis}
      left={left}
      right={right}
      bottom={bottom}
    />
  );
}
