import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getCourseById, submitAssignment, unenrollStudent } from "../../services/courseService";
import CourseTabs from "../../components/courses/CourseTabs";
import CourseAccordion from "../../components/courses/CourseAccordion";
import CourseChips from "../../components/courses/CourseChips";
import AssignmentDrawer from "../../components/courses/AssignmentDrawer";
import { formatDate } from "../../utils/date";

/* ── Skeleton ── */
const Skeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-8 w-80 rounded bg-slate-200 dark:bg-white/10" />
    <div className="flex gap-2">
      <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="h-5 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="h-5 w-14 rounded-lg bg-slate-200 dark:bg-white/10" />
    </div>
    <div className="h-10 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-32" />
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-20" />
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-20" />
    </div>
  </div>
);

/* ── Participants Tab ── */
function ParticipantsTab({ participants = [] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return participants;
    const lower = q.toLowerCase();
    return participants.filter(
      (p) => p.name?.toLowerCase().includes(lower) || p.email?.toLowerCase().includes(lower)
    );
  }, [participants, q]);

  const rolePill = (role) => {
    const colors = {
      Faculty: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
      TA: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
      Student: "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/60",
    };
    return colors[role] || colors.Student;
  };

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search participants..."
        className="mb-4 w-full md:max-w-sm rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors"
      />

      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-white/40">No participants found.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0 border-slate-200/40 dark:border-white/[0.04]">
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white/85">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-white/45 font-mono text-xs">{p.displayId || p.id}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-white/45">{p.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${rolePill(p.role)}`}>
                        {p.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40 font-mono">{p.displayId || p.id}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">{p.email}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${rolePill(p.role)}`}>
                    {p.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Grades Tab (placeholder) ── */
function GradesTab() {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <p className="text-lg font-semibold text-slate-800 dark:text-white/85">Grades will appear when published</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 dark:text-white/40">
        Your instructor has not published any grades yet. Check back later.
      </p>
    </div>
  );
}

/* ── Competencies Tab ── */
function CompetenciesTab({ tags = [] }) {
  const competencies = [
    { name: "Problem Solving", progress: 72 },
    { name: "Technical Writing", progress: 45 },
    { name: "Critical Thinking", progress: 60 },
  ];

  return (
    <div className="space-y-4">
      {tags.length > 0 && (
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-white/90 mb-3">Course Tags</h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/60">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white/90 mb-4">Competency Progress</h4>
        <div className="space-y-4">
          {competencies.map((c) => (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-white/70">{c.name}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/30">{c.progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-slate-400 dark:text-white/25">Competencies are estimated based on course progress.</p>
      </div>
    </div>
  );
}

/* ── More Tab ── */
function MoreTab({ course }) {
  const items = [
    { label: "Syllabus", desc: "View course syllabus", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { label: "Policies", desc: "Attendance, grading, and academic integrity", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { label: "Contact Instructor", desc: course.instructor?.email || "—", href: course.instructor?.email ? `mailto:${course.instructor.email}` : null, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" },
    { label: "Report Issue", desc: "File a grievance for this course", href: "/student/grievances/new", icon: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" },
  ];

  return (
    <div className="space-y-2">
      {items.map((a) => {
        const Tag = a.href ? "a" : "div";
        return (
          <Tag key={a.label} href={a.href || undefined} className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4 hover:bg-white/80 dark:hover:bg-white/[0.035] transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/40 shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{a.label}</p>
              <p className="text-xs text-slate-500 dark:text-white/40">{a.desc}</p>
            </div>
          </Tag>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */
export default function StudentCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState("course");
  const [copied, setCopied] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(null); // { item, sectionId }
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getCourseById(id, user.role);
        const ok = (data.enrolledStudentIds || []).includes(user.id);
        if (!ok) throw new Error("Forbidden");
        if (mounted) setCourse(data);
      } catch {
        if (mounted) setCourse(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id, user.id]);

  function copyCode() {
    if (!course) return;
    navigator.clipboard?.writeText(course.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleAssignmentClick(item, sectionId) {
    setOpenAssignment({ item, sectionId });
  }

  async function handleUnenroll() {
    if (!course || !window.confirm(`Are you sure you want to unenroll from ${course.title}?`)) return;
    setUnenrolling(true);
    try {
      await unenrollStudent({ courseId: id });
      navigate("/student/courses");
    } catch (e) {
      alert(e?.message || "Failed to unenroll");
    } finally {
      setUnenrolling(false);
    }
  }

  async function handleAssignmentSubmit({ courseId: cid, sectionId, assignmentId, files, note }) {
    setSubmittingAssignment(true);
    try {
      const updated = await submitAssignment({
        courseId: cid,
        sectionId,
        assignmentId,
        student: { id: user.id, name: user.name, email: user.email },
        files,
        note,
      });
      setCourse(updated);
      setOpenAssignment(null);
    } finally {
      setSubmittingAssignment(false);
    }
  }

  if (loading) return <Skeleton />;

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">Course not found / not accessible</p>
        <button onClick={() => navigate("/student/courses")} className="mt-3 text-sm text-indigo-500 hover:underline cursor-pointer">
          Back to courses
        </button>
      </div>
    );
  }

  const chips = [course.department, course.semester, course.type, `${course.credits} cr`].filter(Boolean);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate("/student/courses")}
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              Back to Courses
            </button>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              <span className="text-slate-400 dark:text-white/30">{course.code}</span>
              <span className="mx-2 text-slate-300 dark:text-white/15">&mdash;</span>
              {course.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-white/55">{course.instructor?.name || "Unassigned"}</span>
              <span className="text-slate-300 dark:text-white/15">|</span>
              <CourseChips items={chips} />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUnenroll}
              disabled={unenrolling}
              className="flex items-center gap-1.5 rounded-xl border border-red-200/60 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {unenrolling ? "Unenrolling..." : "Unenroll"}
            </button>
            <button
              onClick={copyCode}
              title="Copy course code"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
            {copied ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>{course.code}</>
            )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <CourseTabs active={tab} onChange={setTab} />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {tab === "course" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Overview</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">{course.description || "No description provided."}</p>
                  </div>
                  <div className="hidden lg:block shrink-0 w-48 space-y-2 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Schedule</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{(course.schedule?.days || []).join(", ")} <span className="text-slate-400 dark:text-white/30">{course.schedule?.time}</span></p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Room</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.room || "TBA"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Updated</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{formatDate(course.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:hidden mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Days</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{(course.schedule?.days || []).join(", ")}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Time</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.time || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Room</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.room || "TBA"}</p>
                  </div>
                </div>
              </div>
              <CourseAccordion
                sections={(course.sections || []).map((s) => ({
                  ...s,
                  items: (s.items || []).filter((i) => i.published !== false),
                }))}
                editable={false}
                onAssignmentClick={handleAssignmentClick}
              />
            </div>
          )}
          {tab === "participants" && <ParticipantsTab participants={course.participants || []} />}
          {tab === "grades" && <GradesTab />}
          {tab === "competencies" && <CompetenciesTab tags={course.tags} />}
          {tab === "more" && <MoreTab course={course} />}
        </motion.div>
      </AnimatePresence>

      {/* Assignment Drawer */}
      {openAssignment && (
        <AssignmentDrawer
          assignment={openAssignment.item}
          courseId={id}
          sectionId={openAssignment.sectionId}
          studentId={user.id}
          onClose={() => setOpenAssignment(null)}
          onSubmit={handleAssignmentSubmit}
          submitting={submittingAssignment}
        />
      )}
    </motion.div>
  );
}
