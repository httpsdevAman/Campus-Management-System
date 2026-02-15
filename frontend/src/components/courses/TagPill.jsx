export default function TagPill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide
      bg-slate-900/5 text-slate-700 dark:bg-white/[0.06] dark:text-white/70">
      {text}
    </span>
  );
}
