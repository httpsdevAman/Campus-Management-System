import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { listAllCourses } from "../../services/courseService";
import CourseTable from "../../components/courses/CourseTable";
import CourseCard from "../../components/courses/CourseCard";

const Skeleton = () => (
  <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 animate-pulse">
    <div className="h-5 w-44 rounded bg-slate-200 dark:bg-white/10" />
    <div className="mt-3 h-4 w-72 rounded bg-slate-200 dark:bg-white/10" />
  </div>
);

export default function AdminCourses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("ALL");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await listAllCourses();
      if (mounted) setItems(data);
      setLoading(false);
    })();
    return () => (mounted = false);
  }, []);

  const departments = useMemo(() => {
    const set = new Set(items.map((c) => c.department).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [items]);

  const filtered = useMemo(() => {
    let pool = [...items].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (dept !== "ALL") pool = pool.filter((c) => c.department === dept);
    if (q) {
      const lower = q.toLowerCase();
      pool = pool.filter((c) => c.title.toLowerCase().includes(lower) || c.code.toLowerCase().includes(lower));
    }
    return pool;
  }, [items, q, dept]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">Manage instructors and enrollments.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        >
          {departments.map((x) => (
            <option key={x} value={x}>
              {x === "ALL" ? "All departments" : x}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by code or title..."
          className="w-full md:max-w-xs rounded-xl border border-slate-200/60 dark:border-white/[0.06]
            bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85
            placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${dept}-${q}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center">
              <p className="text-lg font-semibold text-slate-800 dark:text-white/85">No courses found</p>
            </div>
          ) : (
            <>
              <CourseTable rows={filtered} onOpen={(cid) => navigate(`/admin/courses/${cid}`)} />
              <div className="md:hidden grid gap-3">
                {filtered.map((c, i) => (
                  <CourseCard key={c.id} course={c} index={i} onClick={() => navigate(`/admin/courses/${c.id}`)} />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
