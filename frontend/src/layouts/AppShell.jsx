import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import navConfig from "../config/navConfig";
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";

// ── Theme helper ──
const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Component ──
const AppShell = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    if (drawerOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";
  const navItems = navConfig[user?.role] || [];

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="h-screen flex bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 dark:from-[#0a0a0f] dark:via-[#0c0c18] dark:to-[#0a0a0f] transition-colors duration-300">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-[250px] xl:w-[260px] shrink-0 border-r border-slate-200/50 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.015] backdrop-blur-xl">
          <Sidebar
            navItems={navItems}
            isDark={isDark}
          />
        </aside>

        {/* ── Mobile Drawer (slides from right) ── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setDrawerOpen(false)}
              />

              {/* Drawer panel */}
              <motion.div
                ref={drawerRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="fixed inset-y-0 right-0 z-50 w-[280px] max-w-[85vw] lg:hidden border-l border-slate-200/50 dark:border-white/[0.05] bg-white/95 dark:bg-[#0c0c18]/95 backdrop-blur-2xl shadow-2xl"
              >
                {/* Close button */}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer z-10"
                  aria-label="Close menu"
                >
                  <CloseIcon />
                </button>

                <Sidebar
                  navItems={navItems}
                  isDark={isDark}
                  onMobileClose={() => setDrawerOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Main area ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top navbar */}
          <TopNavbar
            isDark={isDark}
            toggleTheme={toggleTheme}
            onMenuClick={() => setDrawerOpen(true)}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1200px] p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
