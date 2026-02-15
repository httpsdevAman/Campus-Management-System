import { motion } from "framer-motion";

const TABS = [
  { key: "branding",      label: "Branding",              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> },
  { key: "academic",      label: "Academic Term",         icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> },
  { key: "calendar",      label: "Calendar & Notices",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
  { key: "userPolicy",    label: "User & Access",         icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
  { key: "grievance",     label: "Grievance Rules",       icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg> },
  { key: "opportunities", label: "Opportunities",         icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg> },
];

export { TABS };

export default function SettingsTabs({ active, onChange }) {
  return (
    <nav className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-2 space-y-0.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer text-left ${
              isActive
                ? "bg-slate-900/[0.05] text-slate-800 dark:bg-white/[0.06] dark:text-white/90"
                : "text-slate-500 dark:text-white/40 hover:text-slate-700 hover:bg-slate-900/[0.03] dark:hover:text-white/70 dark:hover:bg-white/[0.03]"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="settings-tab-accent"
                className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
            <span className={`shrink-0 transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-60"}`}>
              {tab.icon}
            </span>
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
