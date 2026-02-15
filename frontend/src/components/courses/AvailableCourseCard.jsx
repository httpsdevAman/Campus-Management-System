import { motion } from "framer-motion";
import CourseChips from "./CourseChips";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: Math.min(i * 0.05, 0.3), ease: "easeOut" },
  }),
};

export default function AvailableCourseCard({
  course,
  index = 0,
  onEnroll,
  enrolling = false,
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group rounded-2xl border border-slate-200/50 dark:border-white/[0.05]
        bg-white/40 dark:bg-white/[0.015] backdrop-blur
        p-4 transition-all duration-300
        hover:border-slate-300/60 dark:hover:border-white/[0.09]
        hover:bg-white/60 dark:hover:bg-white/[0.03]
        hover:shadow-sm"
    >
      {/* Code + Title */}
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-white/25 shrink-0">
          {course.code}
        </span>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white/85 leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
          {course.title}
        </h4>
      </div>

      {/* Instructor */}
      <p className="text-xs text-slate-500 dark:text-white/40 mb-2.5">
        {course.instructor?.name || "Unassigned"}
      </p>

      {/* Chips + Credits */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <CourseChips items={[course.department, course.type || "Lecture"].filter(Boolean)} />
        <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 shrink-0">
          {course.credits} cr
        </span>
      </div>

      {/* Enroll button */}
      <motion.button
        onClick={() => onEnroll(course.id)}
        disabled={enrolling}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-xl border border-indigo-200 dark:border-indigo-500/20
          bg-indigo-50 dark:bg-indigo-500/10
          px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-300
          hover:bg-indigo-100 dark:hover:bg-indigo-500/20
          disabled:opacity-50 transition-colors cursor-pointer"
      >
        {enrolling ? "Enrolling..." : "Enroll"}
      </motion.button>
    </motion.div>
  );
}
