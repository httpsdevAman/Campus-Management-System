import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const labelMap = {
  dashboard: "Dashboard",
  courses: "Courses",
  grievances: "Grievances",
  opportunities: "Opportunities",
  users: "Users",
  settings: "Settings",
  new: "New",
};

function getBreadcrumbs(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return [];

  const role = parts[0];
  const crumbs = [{ label: role.charAt(0).toUpperCase() + role.slice(1) }];

  for (let i = 1; i < parts.length; i++) {
    const seg = parts[i];
    const mapped = labelMap[seg];
    if (mapped) {
      crumbs.push({ label: mapped });
    }
  }

  return crumbs;
}

export default function TopBar({ onMenuClick, isDark }) {
  const location = useLocation();
  const { user } = useAuth();
  const crumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-20 lg:z-10">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/[0.02] border-b border-slate-200/50 dark:border-white/[0.04] px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">

          {/* ── Mobile: Logo (left) ── hidden on desktop since sidebar has it */}
          <div className="lg:hidden flex items-center gap-2.5 shrink-0 select-none">
            <img
              src={isDark ? "/iitmandidarklogo.png" : "/iitmandilightlogo.png"}
              alt="IIT Mandi"
              className="h-7 w-auto object-contain"
            />
            <div className="w-px h-6 bg-slate-300/50 dark:bg-white/10 shrink-0" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase leading-tight text-slate-900 dark:text-white">
                IIT Mandi
              </span>
              <span className="text-[6px] font-semibold tracking-[0.1em] uppercase leading-tight text-slate-500 dark:text-white/50">
                Campus CMS
              </span>
            </div>
          </div>

          {/* ── Desktop: Breadcrumb ── hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1.5 min-w-0">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 dark:text-white/15 shrink-0">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
                <span className={`text-sm truncate ${
                  i === crumbs.length - 1
                    ? "font-semibold text-slate-800 dark:text-white/85"
                    : "font-medium text-slate-400 dark:text-white/30"
                }`}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Desktop: Subtle greeting ── */}
          <span className="hidden lg:block text-xs text-slate-400 dark:text-white/25 font-medium">
            Welcome, {user?.name?.split(" ")[0]}
          </span>

          {/* ── Mobile: Hamburger (right) ── */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -mr-2 rounded-xl text-slate-500 dark:text-white/50 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
