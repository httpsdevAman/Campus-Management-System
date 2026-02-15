import { motion } from "framer-motion";
import CourseChips from "./CourseChips";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: Math.min(i * 0.06, 0.35), ease: "easeOut" },
  }),
};

export default function EnrolledCourseCard({ course, index = 0, onOpen }) {
  const chips = [
    course.department,
    course.semester,
    course.type || "Lecture",
  ].filter(Boolean);

  const sched = course.schedule || {};

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.995 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(course.id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(course.id); } }}
      className="group relative rounded-2xl border border-slate-200/60 dark:border-white/[0.06]
        bg-white/60 dark:bg-white/[0.02] backdrop-blur cursor-pointer
        shadow-sm hover:shadow-md dark:shadow-none
        transition-all duration-300 overflow-hidden
        outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/40"
    >
      {/* Accent strip on hover */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-4">
          {/* Left: col-span-3 */}
          <div className="md:col-span-3 min-w-0">
            {/* Code + Title */}
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-mono text-xs font-semibold text-slate-400 dark:text-white/30 shrink-0">
                {course.code}
              </span>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200 truncate">
                {course.title}
              </h3>
            </div>

            {/* Instructor */}
            <p className="mt-1.5 text-xs text-slate-500 dark:text-white/45">
              <span className="text-slate-400 dark:text-white/30">Instructor:</span>{" "}
              {course.instructor?.name || "Unassigned"}
            </p>

            {/* Chips */}
            <div className="mt-2.5">
              <CourseChips items={chips} />
            </div>

            {/* Description */}
            {course.description && (
              <p className="mt-2.5 text-sm leading-relaxed text-slate-500 dark:text-white/45 line-clamp-2">
                {course.description}
              </p>
            )}
          </div>

          {/* Right: col-span-1 — Meta stack */}
          <div className="md:col-span-1 flex flex-col gap-2 md:items-end">
            <div className="space-y-2 text-xs md:text-right">
              <div>
                <span className="text-slate-400 dark:text-white/30">Credits</span>
                <p className="font-bold text-slate-700 dark:text-white/80">{course.credits}</p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-white/30">Slot</span>
                <p className="font-semibold text-slate-600 dark:text-white/65">
                  {(sched.days || []).join(", ") || "TBA"}{" "}
                  <span className="text-slate-400 dark:text-white/30">
                    {sched.time || ""}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-slate-400 dark:text-white/30">Room</span>
                <p className="font-semibold text-slate-600 dark:text-white/65">
                  {sched.room || "TBA"}
                </p>
              </div>
            </div>

            {/* Hover arrow indicator */}
            <div className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-white/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span>View course</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
