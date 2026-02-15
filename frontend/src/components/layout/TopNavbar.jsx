import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

/* ── Icons ── */
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

/* ── Route → title helper ── */
const labelMap = {
  dashboard: "Dashboard",
  courses: "Courses",
  grievances: "Grievances",
  opportunities: "Opportunities",
  users: "Users",
  settings: "Settings",
  departments: "Departments",
  new: "New",
};

function deriveTitle(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return "Dashboard";
  for (let i = parts.length - 1; i >= 1; i--) {
    const mapped = labelMap[parts[i]];
    if (mapped) return mapped;
  }
  return labelMap[parts[1]] || "Dashboard";
}

/* ── Role badge colors ── */
const roleBadge = {
  student: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  faculty: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  authority: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  admin: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

/* ── Format date ── */
function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Profile Dropdown ── */
function ProfileDropdown({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  function handleLogout() {
    onClose();
    logout();
    navigate("/login");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden z-50 border bg-white/80 backdrop-blur-2xl border-slate-200/60 shadow-lg shadow-black/[0.06] dark:bg-[#161625]/90 dark:backdrop-blur-2xl dark:border-white/[0.08] dark:shadow-black/40"
        >
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => { onClose(); navigate("/profile"); }}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 dark:text-white/60 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
            >
              <UserIcon />
              Profile
            </button>
            <div className="mx-2 h-px bg-slate-200/60 dark:bg-white/[0.06]" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 dark:text-white/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Main Component ── */
export default function TopNavbar({ title, subtitle, isDark, toggleTheme, onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const displayTitle = title || deriveTitle(location.pathname);
  const displaySubtitle = subtitle || formatToday();

  return (
    <header className="sticky top-0 z-20 lg:z-10">
      <div className="backdrop-blur-xl bg-white/50 dark:bg-white/[0.02] border-b border-slate-200/50 dark:border-white/[0.04] px-4 sm:px-6 h-16 flex items-center">

        {/* ── Mobile: Logo (left) ── */}
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

        {/* ── Desktop: Title + Subtitle (left) ── */}
        <div className="hidden lg:flex flex-col justify-center min-w-0">
          <h1 className="text-[15px] font-bold text-slate-800 dark:text-white/90 leading-tight truncate">
            {displayTitle}
          </h1>
          <p className="text-[11px] font-medium text-slate-400 dark:text-white/30 leading-tight mt-0.5 truncate">
            {displaySubtitle}
          </p>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Desktop: Utilities (right) ── */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.92 }}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2.5 rounded-xl cursor-pointer transition-all duration-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 dark:text-white/35 dark:hover:text-white/70 dark:hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="w-px h-7 bg-slate-200/70 dark:bg-white/[0.06] shrink-0" />

          {/* Profile chip */}
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen((v) => !v)}
              whileHover={{ y: -1 }}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                {user?.name?.charAt(0) || "?"}
              </div>

              {/* Name + role */}
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[13px] font-semibold text-slate-700 dark:text-white/80 truncate max-w-[120px] leading-tight">
                  {user?.name}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider leading-tight ${
                  roleBadge[user?.role]?.split(" ").filter(c => c.startsWith("text-")).join(" ") || "text-slate-400"
                }`}>
                  {user?.role}
                </span>
              </div>

              {/* Chevron */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 text-slate-300 dark:text-white/20 transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.button>

            {/* Dropdown */}
            <ProfileDropdown
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
            />
          </div>
        </div>

        {/* ── Mobile: Hamburger (right) ── */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -mr-2 rounded-xl text-slate-500 dark:text-white/50 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}
