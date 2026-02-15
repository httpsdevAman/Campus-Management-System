import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const roleBadge = {
  student: "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/10 dark:text-indigo-300",
  faculty: "bg-violet-500/10 text-violet-500 dark:bg-violet-400/10 dark:text-violet-300",
  authority: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  admin: "bg-rose-500/10 text-rose-500 dark:bg-rose-400/10 dark:text-rose-300",
};

const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {user?.name?.charAt(0) || "?"}
        </div>
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold text-slate-700 dark:text-white/85 truncate max-w-[120px] leading-tight">
            {user?.name}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-white/30 truncate max-w-[120px] leading-tight">
            {user?.email}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-slate-400 dark:text-white/30 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50 border bg-white/80 backdrop-blur-2xl border-slate-200/60 shadow-lg shadow-black/[0.06] dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-white/[0.08] dark:shadow-black/40"
          >
            {/* User info header */}
            <div className="px-4 pt-3.5 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <p className="text-sm font-semibold text-slate-800 dark:text-white/90 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-400 dark:text-white/35 truncate mt-0.5">
                {user?.email}
              </p>
              <span
                className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  roleBadge[user?.role] || ""
                }`}
              >
                {user?.role}
              </span>
            </div>

            {/* Actions */}
            <div className="p-1.5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-white/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all duration-200 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
