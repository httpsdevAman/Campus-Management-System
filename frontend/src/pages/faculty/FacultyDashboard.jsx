import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CalendarCard from "../../components/calendar/CalendarCard";
import { listCoursesForFaculty } from "../../services/courseService";
import { listOpportunitiesForFaculty } from "../../services/opportunityService";
import { listGrievancesByCreator } from "../../services/grievanceService";
import { listGlobalEvents, getAssignmentDeadlinesForFaculty } from "../../services/calendarService";

/* ── Icons ── */
const BookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const BriefIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const ClipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);
const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
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

const statusStyle = {
  SUBMITTED:   "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
  IN_PROGRESS: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  RESOLVED:    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  CLOSED:      "bg-slate-500/10 text-slate-600 dark:text-slate-300",
};

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [opps, setOpps] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      listCoursesForFaculty(user.id),
      listOpportunitiesForFaculty(user.id),
      listGrievancesByCreator(user.id),
      listGlobalEvents(),
      getAssignmentDeadlinesForFaculty(user.id),
    ]).then(([c, o, g, ge, dl]) => {
      if (cancelled) return;
      setCourses(c);
      setOpps(o);
      setGrievances(g);
      setCalEvents([...ge, ...dl]);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* KPI data */
  const totalSubmissions = courses.flatMap((c) =>
    (c.sections || []).flatMap((s) =>
      (s.items || []).filter((it) => it.kind === "ASSIGNMENT").flatMap((it) => it.submissions || [])
    )
  ).length;

  const gCounts = { SUBMITTED: 0, UNDER_REVIEW: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
  grievances.forEach((g) => { if (gCounts[g.status] !== undefined) gCounts[g.status]++; });

  const kpis = [
    { value: String(courses.length), label: "Courses Teaching",        icon: <BookIcon />,  color: "indigo" },
    { value: String(opps.length),    label: "Opportunities Posted",    icon: <BriefIcon />, color: "violet" },
    { value: String(totalSubmissions), label: "Submissions to Review", icon: <ClipIcon />,  color: "amber" },
    { value: String(grievances.length), label: "My Grievances",       icon: <FlagIcon />,  color: "rose" },
  ];

  /* Recent submissions across courses */
  const recentSubs = courses.flatMap((c) =>
    (c.sections || []).flatMap((s) =>
      (s.items || []).filter((it) => it.kind === "ASSIGNMENT").flatMap((it) =>
        (it.submissions || []).map((sub) => ({ ...sub, assignmentTitle: it.title, courseCode: c.code }))
      )
    )
  ).sort((a, b) => (b.submittedAt || "").localeCompare(a.submittedAt || "")).slice(0, 5);

  /* ── Left column ── */
  const left = (
    <Card title="My Courses">
      {courses.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No courses assigned</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <motion.div key={c.id} whileHover={{ x: 2 }} onClick={() => navigate(`/faculty/courses/${c.id}`)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-white/[0.04] hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{c.code} — {c.title}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">
                  {c.schedule?.days?.join(", ")} &middot; {c.schedule?.time} &middot; {(c.enrolledStudentIds || []).length} students
                </p>
              </div>
              <span className="shrink-0 ml-3 text-xs font-bold text-slate-400 dark:text-white/25">{c.credits}cr</span>
            </motion.div>
          ))}
          <button onClick={() => navigate("/faculty/courses")} className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
            Manage courses &rarr;
          </button>
        </div>
      )}
    </Card>
  );

  /* ── Right column ── */
  const right = <CalendarCard events={calEvents} />;

  /* ── Bottom ── */
  const bottom = (
    <Card title="Recent Submissions">
      {recentSubs.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No submissions yet</p>
      ) : (
        <div className="space-y-2.5">
          {recentSubs.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{sub.student?.name}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5 truncate">{sub.courseCode} — {sub.assignmentTitle}</p>
              </div>
              <span className="shrink-0 ml-3 text-[11px] font-medium text-slate-400 dark:text-white/25">
                {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
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
