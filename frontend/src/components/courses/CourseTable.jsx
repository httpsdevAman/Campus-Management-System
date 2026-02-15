import TagPill from "./TagPill";

export default function CourseTable({ rows, onOpen }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/[0.06]
      bg-white/60 dark:bg-white/[0.02] backdrop-blur">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500 dark:text-white/40">
          <tr className="border-b border-slate-200/50 dark:border-white/[0.06]">
            <th className="px-5 py-3 font-semibold">Course</th>
            <th className="px-5 py-3 font-semibold">Dept</th>
            <th className="px-5 py-3 font-semibold">Instructor</th>
            <th className="px-5 py-3 font-semibold">Tags</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr
              key={c.id}
              onClick={() => onOpen(c.id)}
              className="cursor-pointer border-b border-slate-200/40 dark:border-white/[0.06]
                hover:bg-white/70 dark:hover:bg-white/[0.03]"
            >
              <td className="px-5 py-4">
                <div className="font-mono text-xs text-slate-500 dark:text-white/40">{c.code}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{c.title}</div>
                <div className="text-xs text-slate-500 dark:text-white/40">{c.semester}</div>
              </td>
              <td className="px-5 py-4 text-slate-700 dark:text-white/70">{c.department}</td>
              <td className="px-5 py-4 text-slate-700 dark:text-white/70">{c.instructor?.name || "Unassigned"}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {(c.tags || []).slice(0, 3).map((t) => (
                    <TagPill key={t} text={t} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="px-5 py-10 text-center text-slate-500 dark:text-white/40">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
