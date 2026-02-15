import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  listCoursesForStudent,
  listAvailableCourses,
  enrollCourse,
} from "../../services/courseService";
import EnrolledCourseCard from "../../components/courses/EnrolledCourseCard";
import AvailableCourseCard from "../../components/courses/AvailableCourseCard";

/* ── Constants ───────────────────────────────── */
const TABS = [
  { key: "enrolled", label: "Enrolled Courses" },
  { key: "available", label: "New Courses Available" },
];
const LS_KEY = "coursesTab";

function readTab() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === "enrolled" || v === "available" ? v : "enrolled";
  } catch {
    return "enrolled";
  }
}

/* ── Skeletons ───────────────────────────────── */
const EnrolledSkeleton = () => (
  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 animate-pulse">
    <div className="grid gap-4 md:grid-cols-4">
      <div className="md:col-span-3 space-y-2.5">
        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-3 w-32 rounded bg-slate-200 dark:bg-white/10" />
        <div className="flex gap-2">
          <div className="h-4 w-12 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
          <div className="h-4 w-14 rounded-lg bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="md:col-span-1 space-y-2">
        <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10 md:ml-auto" />
        <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10 md:ml-auto" />
        <div className="h-8 w-full md:w-20 rounded-xl bg-slate-200 dark:bg-white/10 md:ml-auto" />
      </div>
    </div>
  </div>
);

const AvailableSkeleton = () => (
  <div className="rounded-2xl border border-slate-200/50 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.015] p-4 animate-pulse">
    <div className="h-4 w-36 rounded bg-slate-200 dark:bg-white/10" />
    <div className="mt-2 h-3 w-24 rounded bg-slate-200 dark:bg-white/10" />
    <div className="mt-3 flex gap-2">
      <div className="h-4 w-12 rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-14 rounded-lg bg-slate-200 dark:bg-white/10" />
    </div>
    <div className="mt-3 h-8 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
  </div>
);

/* ── Empty state ─────────────────────────────── */
function EmptyState({ tab, hasFilters }) {
  const isEnrolled = tab === "enrolled";

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center transition-colors duration-300">
      <div
        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
          isEnrolled
            ? "bg-indigo-500/10 dark:bg-indigo-400/10"
            : "bg-emerald-500/10 dark:bg-emerald-400/10"
        }`}
      >
        {isEnrolled ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
        )}
      </div>
      <p className="text-lg font-semibold text-slate-800 dark:text-white/85">
        {hasFilters
          ? isEnrolled
            ? "No enrolled courses match your search"
            : "No available courses match your search"
          : isEnrolled
          ? "No enrolled courses yet"
          : "All courses enrolled! Check back later for new offerings."}
      </p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 dark:text-white/40">
        {hasFilters
          ? "Try adjusting your filters."
          : isEnrolled
          ? "Switch to the \"New Courses Available\" tab and enroll to get started."
          : "You're all caught up. New courses will appear here when available."}
      </p>
    </div>
  );
}

/* ── Page ─────────────────────────────────────── */
export default function StudentCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState([]);
  const [available, setAvailable] = useState([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("ALL");
  const [enrollingId, setEnrollingId] = useState(null);
  const [activeTab, setActiveTab] = useState(readTab);

  function switchTab(key) {
    setActiveTab(key);
    try { localStorage.setItem(LS_KEY, key); } catch { /* noop */ }
  }

  async function fetchAll() {
    setLoading(true);
    const [e, a] = await Promise.all([
      listCoursesForStudent(),
      listAvailableCourses(),
    ]);
    setEnrolled(e);
    setAvailable(a);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  /* departments from both lists */
  const departments = useMemo(() => {
    const set = new Set(
      [...enrolled, ...available].map((c) => c.department).filter(Boolean)
    );
    return ["ALL", ...Array.from(set).sort()];
  }, [enrolled, available]);

  /* filter helper */
  function matchesFilter(c) {
    if (dept !== "ALL" && c.department !== dept) return false;
    if (q) {
      const lower = q.toLowerCase();
      if (
        !c.title.toLowerCase().includes(lower) &&
        !c.code.toLowerCase().includes(lower) &&
        !c.instructor?.name?.toLowerCase().includes(lower)
      )
        return false;
    }
    return true;
  }

  const filteredEnrolled = useMemo(
    () =>
      enrolled
        .filter(matchesFilter)
        .sort((a, b) => (a.title || "").localeCompare(b.title || "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enrolled, q, dept]
  );

  const filteredAvailable = useMemo(
    () =>
      available
        .filter(matchesFilter)
        .sort((a, b) => (a.title || "").localeCompare(b.title || "")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [available, q, dept]
  );

  async function handleEnroll(courseId) {
    setEnrollingId(courseId);
    await enrollCourse({
      courseId,
      student: { id: user.id, name: user.name, email: user.email },
    });
    await fetchAll();
    setEnrollingId(null);
  }

  const hasFilters = q !== "" || dept !== "ALL";

  const selectClass =
    "rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";
  const optClass = "bg-white dark:bg-[#161625] dark:text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* ── Header ── */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Courses
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
          View enrolled courses and browse new ones to enroll in.
        </p>
      </div>

      {/* ── Toolbar: Tabs + Filters ── */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Segmented tab switch */}
        <div className="flex items-center rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.02] backdrop-blur p-1 w-full md:w-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`relative flex-1 md:flex-none shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40 ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/60"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="courses-list-tab-pill"
                    className="absolute inset-0 rounded-xl bg-white dark:bg-white/[0.08] shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-[1] flex items-center justify-center gap-2 whitespace-nowrap">
                  {tab.label}
                  {!loading && (
                    <span
                      className={`inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                          : "bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-white/30"
                      }`}
                    >
                      {tab.key === "enrolled"
                        ? filteredEnrolled.length
                        : filteredAvailable.length}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Department filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by code, title, or instructor..."
            className="w-full sm:w-64 rounded-xl border border-slate-200/60 dark:border-white/[0.06]
              bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85
              placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none
              focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200"
          />
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className={selectClass}
          >
            {departments.map((x) => (
              <option key={x} value={x} className={optClass}>
                {x === "ALL" ? "All departments" : x}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tab content with crossfade ── */}
      <AnimatePresence mode="wait">
        {activeTab === "enrolled" ? (
          <motion.div
            key="enrolled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {loading ? (
              <div className="space-y-3">
                <EnrolledSkeleton />
                <EnrolledSkeleton />
              </div>
            ) : filteredEnrolled.length === 0 ? (
              <EmptyState tab="enrolled" hasFilters={hasFilters} />
            ) : (
              <div className="space-y-3">
                {filteredEnrolled.map((c, i) => (
                  <EnrolledCourseCard
                    key={c.id}
                    course={c}
                    index={i}
                    onOpen={(cid) => navigate(`/student/courses/${cid}`)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="available"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {loading ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <AvailableSkeleton />
                <AvailableSkeleton />
                <AvailableSkeleton />
              </div>
            ) : filteredAvailable.length === 0 ? (
              <EmptyState tab="available" hasFilters={hasFilters} />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredAvailable.map((c, i) => (
                  <AvailableCourseCard
                    key={c.id}
                    course={c}
                    index={i}
                    enrolling={enrollingId === c.id}
                    onEnroll={handleEnroll}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
