import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CalendarCard from "../../components/calendar/CalendarCard";
import { listCoursesForStudent } from "../../services/courseService";
import { listGrievancesForStudent } from "../../services/grievanceService";
import { listAllOpportunities } from "../../services/opportunityService";
import { listGlobalEvents, getAssignmentDeadlinesForStudent } from "../../services/calendarService";

/* ── KPI icons ── */
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const CreditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const ClipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

/* ── Glass card ── */
function Card({ title, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-5 ${className}`}>
      {title && <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-4">{title}</h3>}
      {children}
    </div>
  );
}

/* ── Status badge colors ── */
const statusStyle = {
  SUBMITTED:   "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  RESOLVED:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  CLOSED:      "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [opps, setOpps] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      listCoursesForStudent(user.id),
      listGrievancesForStudent(user.id),
      listAllOpportunities(),
      listGlobalEvents(),
      getAssignmentDeadlinesForStudent(user.id),
    ]).then(([c, g, o, ge, dl]) => {
      if (cancelled) return;
      setCourses(c);
      setGrievances(g);
      setOpps(o.slice(0, 3));
      setCalEvents([...ge, ...dl]);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* KPI data */
  const totalCredits = courses.reduce((s, c) => s + (c.credits || 0), 0);
  const now = new Date();
  const assignmentsDue = courses.flatMap((c) =>
    (c.sections || []).flatMap((sec) =>
      (sec.items || []).filter((it) =>
        it.kind === "ASSIGNMENT" && it.published !== false && it.meta?.dueAt && new Date(it.meta.dueAt) > now
      )
    )
  ).length;

  const kpis = [
    { value: "8.4",                  label: "Current CGPA",          icon: <StarIcon />,   color: "indigo", trend: { up: true, label: "+0.2" } },
    { value: String(courses.length), label: "Enrolled Courses",      icon: <BookIcon />,   color: "violet" },
    { value: String(totalCredits),   label: "Credits This Semester",  icon: <CreditIcon />, color: "emerald" },
    { value: String(assignmentsDue), label: "Assignments Due",       icon: <ClipIcon />,   color: "amber" },
  ];

  /* Grievance breakdown */
  const gCounts = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
  grievances.forEach((g) => { if (gCounts[g.status] !== undefined) gCounts[g.status]++; });

  const attendance = 87;

  /* ── Left column ── */
  const left = (
    <>
      {/* Attendance */}
      <Card title="Attendance">
        <div className="flex items-center gap-5">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-200/60 dark:text-white/[0.06]" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${attendance} ${100 - attendance}`} strokeLinecap="round"
                className="text-emerald-500 dark:text-emerald-400" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-white/90">{attendance}%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-white/75">Overall Average</p>
            <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">Across {courses.length} courses this semester</p>
          </div>
        </div>
      </Card>

      {/* Grievance status */}
      <Card title="My Grievances">
        {grievances.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-white/30">No grievances filed</p>
        ) : (
          <div className="space-y-2.5">
            {Object.entries(gCounts).filter(([, v]) => v > 0).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle[status] || "bg-slate-500/10 text-slate-600"}`}>
                  {status.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-white/75">{count}</span>
              </div>
            ))}
            <button onClick={() => navigate("/student/grievances")} className="mt-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
              View all grievances &rarr;
            </button>
          </div>
        )}
      </Card>
    </>
  );

  /* ── Right column ── */
  const right = <CalendarCard events={calEvents} />;

  /* ── Bottom ── */
  const bottom = (
    <Card title="Opportunities">
      {opps.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No opportunities available</p>
      ) : (
        <div className="space-y-3">
          {opps.map((o) => (
            <motion.div key={o.id} whileHover={{ x: 2 }} onClick={() => navigate(`/student/opportunities/${o.id}`)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-white/[0.04] hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{o.title}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{o.type} &middot; {o.location}</p>
              </div>
              <span className="shrink-0 ml-3 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">{o.type}</span>
            </motion.div>
          ))}
          <button onClick={() => navigate("/student/opportunities")} className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
            Browse all opportunities &rarr;
          </button>
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
