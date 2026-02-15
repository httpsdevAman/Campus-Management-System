import { motion } from "framer-motion";
import TagPill from "./TagPill";

export default function CourseCard({ course, index = 0, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="text-left rounded-2xl border border-slate-200/60 dark:border-white/[0.06]
        bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5 transition-colors duration-300
        hover:bg-white/70 dark:hover:bg-white/[0.03]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500 dark:text-white/40">{course.code}</span>
            <span className="text-xs text-slate-400 dark:text-white/20">•</span>
            <span className="text-xs text-slate-500 dark:text-white/40">{course.semester}</span>
          </div>
          <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
            {course.department} • {course.credits} credits
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-white/40">Instructor</p>
          <p className="text-sm font-semibold text-slate-800 dark:text-white/80">
            {course.instructor?.name || "Unassigned"}
          </p>
        </div>
      </div>

      {course.tags?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {course.tags.slice(0, 4).map((t) => (
            <TagPill key={t} text={t} />
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-white/40">
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/[0.04] px-3 py-2">
          <div className="font-semibold text-slate-700 dark:text-white/70">{(course.materials || []).length}</div>
          <div>Materials</div>
        </div>
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/[0.04] px-3 py-2">
          <div className="font-semibold text-slate-700 dark:text-white/70">{(course.assignments || []).length}</div>
          <div>Assignments</div>
        </div>
        <div className="rounded-xl bg-slate-900/5 dark:bg-white/[0.04] px-3 py-2">
          <div className="font-semibold text-slate-700 dark:text-white/70">{(course.enrolledStudentIds || []).length}</div>
          <div>Enrolled</div>
        </div>
      </div>
    </motion.button>
  );
}
