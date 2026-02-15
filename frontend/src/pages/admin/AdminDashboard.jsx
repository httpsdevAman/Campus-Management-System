import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CalendarCard from "../../components/calendar/CalendarCard";
import { listAllGrievances, assignGrievance, getAuthorityUsers } from "../../services/grievanceService";
import { getUsersCount } from "../../services/userService";
import { listAllOpportunities } from "../../services/opportunityService";
import {
  listGlobalEvents,
  createGlobalEvent,
  updateGlobalEvent,
  deleteGlobalEvent,
} from "../../services/calendarService";

/* ── Icons ── */
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const FlagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const BriefIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);
  const [opps, setOpps] = useState([]);
  const [calEvents, setCalEvents] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    const [g, o, ge, auth, count] = await Promise.all([
      listAllGrievances(),
      listAllOpportunities(),
      listGlobalEvents(),
      getAuthorityUsers(),
      getUsersCount(),
    ]);
    setGrievances(g);
    setOpps(o);
    setCalEvents(ge);
    setAuthorities(auth);
    setUserCount(count);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, loadData]);

  /* Calendar CRUD handlers */
  async function handleCreate(data) {
    await createGlobalEvent(data);
    setCalEvents(await listGlobalEvents());
  }
  async function handleEdit(id, data) {
    await updateGlobalEvent(id, data);
    setCalEvents(await listGlobalEvents());
  }
  async function handleDelete(id) {
    await deleteGlobalEvent(id);
    setCalEvents(await listGlobalEvents());
  }

  /* Quick-assign handler */
  async function handleAssign(grievanceId, authorityUser) {
    await assignGrievance({ id: grievanceId, authorityUser, by: { id: user.id, name: user.name, role: user.role } });
    const updated = await listAllGrievances();
    setGrievances(updated);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* KPI data */
  const unassigned = grievances.filter((g) => !g.assignedTo).length;

  const kpis = [
    { value: String(userCount.toLocaleString()), label: "Total Users", icon: <UsersIcon />, color: "indigo" },
    { value: String(grievances.length),  label: "Total Grievances",        icon: <FlagIcon />,  color: "rose" },
    { value: String(unassigned),         label: "Unassigned Grievances",   icon: <AlertIcon />, color: "amber" },
    { value: String(opps.length),        label: "Total Opportunities",     icon: <BriefIcon />, color: "violet" },
  ];

  /* Global events for the management panel */
  const upcomingEvents = [...calEvents]
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  /* Unassigned grievances for quick-assign */
  const unassignedList = grievances.filter((g) => !g.assignedTo).slice(0, 5);

  /* ── Left column ── */
  const left = (
    <Card title="Upcoming Global Events">
      {upcomingEvents.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">No upcoming events</p>
      ) : (
        <div className="space-y-2.5">
          {upcomingEvents.map((e) => {
            const typeColor = {
              HOLIDAY: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
              EXAM:    "bg-red-500/10 text-red-600 dark:text-red-300",
              EVENT:   "bg-violet-500/10 text-violet-600 dark:text-violet-300",
              NOTICE:  "bg-blue-500/10 text-blue-600 dark:text-blue-300",
            };
            return (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{e.title}</p>
                  <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{e.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${typeColor[e.type] || typeColor.EVENT}`}>{e.type.toLowerCase()}</span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-white/25">
                    {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mt-3 text-[11px] text-slate-400 dark:text-white/25">Use the calendar to create, edit, or delete events.</p>
    </Card>
  );

  /* ── Right column ── */
  const right = (
    <CalendarCard
      events={calEvents}
      onCreateEvent={handleCreate}
      onEditEvent={handleEdit}
      onDeleteEvent={handleDelete}
    />
  );

  /* ── Bottom ── */
  const bottom = (
    <Card title="Unassigned Grievances">
      {unassignedList.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-white/30">All grievances have been assigned</p>
      ) : (
        <div className="space-y-3">
          {unassignedList.map((g) => (
            <div key={g.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 dark:border-white/[0.04]">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 dark:text-white/75 truncate">{g.title}</p>
                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{g.id} &middot; {g.category} &middot; by {g.createdBy?.name}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityStyle[g.priority] || priorityStyle.LOW}`}>{g.priority}</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const auth = authorities.find((a) => a.id === e.target.value);
                    if (auth) handleAssign(g.id, auth);
                  }}
                  className="rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-2 py-1.5 text-[11px] font-medium text-slate-600 dark:text-white/60 outline-none cursor-pointer"
                >
                  <option value="" disabled>Assign to…</option>
                  {authorities.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button onClick={() => navigate("/admin/grievances")} className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
            Manage all grievances &rarr;
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
