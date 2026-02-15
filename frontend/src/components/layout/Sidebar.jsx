import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

/* ── Icons (18×18, strokeWidth 1.8 for slim look) ── */
const icons = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  flag: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  briefcase: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="8" y2="6.01" /><line x1="16" y1="6" x2="16" y2="6.01" /><line x1="12" y1="6" x2="12" y2="6.01" />
      <line x1="8" y1="10" x2="8" y2="10.01" /><line x1="16" y1="10" x2="16" y2="10.01" /><line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" /><line x1="16" y1="14" x2="16" y2="14.01" /><line x1="12" y1="14" x2="12" y2="14.01" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

/* ── Single nav item ── */
function NavItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 pl-4 pr-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-slate-900/[0.05] text-slate-800 dark:bg-white/[0.06] dark:text-white/90"
            : "text-slate-500 dark:text-white/40 hover:text-slate-700 hover:bg-slate-900/[0.03] dark:hover:text-white/70 dark:hover:bg-white/[0.03]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Left accent bar */}
          <span
            className={`absolute left-1 top-1/2 -translate-y-1/2 w-[3px] rounded-full transition-all duration-200 ${
              isActive
                ? "h-5 bg-indigo-500 dark:bg-indigo-400"
                : "h-0 bg-transparent"
            }`}
          />
          <span className={`shrink-0 transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-80"}`}>
            {icons[icon] || icons.grid}
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

/* ── Main Sidebar ── */
export default function Sidebar({ navItems, isDark, onMobileClose, isMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "student";

  function handleLogout() {
    onMobileClose?.();
    logout();
    navigate("/login");
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3 select-none">
          <img
            src={isDark ? "/iitmandidarklogo.png" : "/iitmandilightlogo.png"}
            alt="IIT Mandi"
            className="h-9 w-auto object-contain"
          />
          <div className="w-px h-8 bg-slate-300/40 dark:bg-white/[0.08] shrink-0" />
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[12px] font-bold tracking-[0.16em] uppercase leading-tight text-slate-900 dark:text-white transition-colors duration-300">
              IIT Mandi
            </span>
            <span className="text-[7px] font-semibold tracking-[0.12em] uppercase leading-tight text-slate-400 dark:text-white/40 transition-colors duration-300">
              Campus CMS
            </span>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 h-px bg-slate-200/60 dark:bg-white/[0.05]" />

      {/* ── Menu label + Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 pt-5 pb-3">
        <p className="px-4 pb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-white/25 select-none">
          Menu
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              onClick={onMobileClose}
            />
          ))}
        </div>
      </nav>

      {/* ── Divider ── */}
      <div className="mx-5 h-px bg-slate-200/60 dark:bg-white/[0.05]" />

      {/* ── Bottom: Settings + Logout ── */}
      <div className="px-3 py-4 space-y-0.5">
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-3 w-full pl-4 pr-3.5 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 dark:text-white/40 hover:text-slate-700 hover:bg-slate-900/[0.03] dark:hover:text-white/70 dark:hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
        >
          <span className="shrink-0 opacity-60 group-hover:opacity-80 transition-opacity"><LogoutIcon /></span>
          Logout
        </motion.button>
      </div>
    </div>
  );
}
