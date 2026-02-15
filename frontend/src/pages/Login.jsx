import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// ── Design tokens ────────────────────────────────────────────────
const inputClass =
  "w-full px-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 " +
  "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-400/30 focus:border-indigo-300 " +
  "dark:bg-white/[0.05] dark:border-white/[0.08] dark:text-white dark:placeholder-white/30 dark:focus:ring-indigo-400/40 dark:focus:border-white/20";

const labelClass =
  "block text-sm font-medium mb-1.5 text-slate-500 dark:text-white/50";

// ── Animation variants ───────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const heroContent = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: 0.3 } },
};

// ── Icons ────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────
const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// ── Component ────────────────────────────────────────────────────
const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(getInitialTheme);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Redirect when user is set (after login or on load) — avoid navigating before state updates
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
      // Navigation happens in useEffect when user state updates
    } catch (err) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="h-screen flex items-center justify-center relative overflow-hidden px-4 py-4 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:bg-none dark:bg-[#0a0a0f] transition-colors duration-500">
        {/* ── Ambient background ──────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent dark:from-slate-950 dark:via-[#0c0c18] dark:to-gray-950 transition-colors duration-500" />

        {/* Blobs */}
        <div className="animate-blob-slow absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-indigo-200/40 dark:bg-indigo-500/[0.07] transition-colors duration-500" />
        <div className="animate-blob-slow-reverse absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full blur-[100px] bg-violet-200/30 dark:bg-violet-500/[0.05] transition-colors duration-500" />

        {/* ── Theme toggle ────────────────────────────────────── */}
        <motion.button
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          whileTap={{ scale: 0.92 }}
          className="fixed top-4 right-4 z-50 p-2.5 rounded-xl border cursor-pointer transition-all duration-300 backdrop-blur-lg bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white hover:border-slate-300 shadow-sm dark:bg-white/[0.05] dark:border-white/[0.08] dark:text-white/60 dark:hover:bg-white/[0.1] dark:hover:border-white/[0.15] dark:shadow-none focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {/* ── Main card ───────────────────────────────────────── */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-[1100px] max-h-[92vh] rounded-3xl overflow-hidden transition-all duration-500 bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.08)] dark:bg-white/[0.03] dark:backdrop-blur-2xl dark:border-white/[0.06] dark:shadow-[0_8px_60px_-12px_rgba(0,0,0,0.7)]"
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* ── Left: Form ────────────────────────────────── */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex-1 flex items-center justify-center p-6 lg:p-10"
            >
              <div className="w-full max-w-sm">
                {/* Brand */}
                <motion.p
                  variants={fadeUp}
                  className="text-xs font-semibold tracking-[0.2em] uppercase mb-6 text-indigo-500/70 dark:text-indigo-400/60 transition-colors duration-500"
                >
                  Campus CMS
                </motion.p>

                {/* Heading */}
                <motion.h1
                  variants={fadeUp}
                  className="text-3xl lg:text-4xl font-bold tracking-tight mb-1.5 text-slate-900 dark:text-white transition-colors duration-500"
                >
                  Welcome back
                </motion.h1>
                <motion.p
                  variants={fadeUp}
                  className="text-sm mb-7 text-slate-500 dark:text-white/40 transition-colors duration-500"
                >
                  Sign in with your institute email
                </motion.p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <motion.div variants={stagger} className="space-y-4">
                    {error && (
                      <motion.div
                        variants={fadeUp}
                        className="p-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20"
                      >
                        {error}
                      </motion.div>
                    )}
                    <motion.div variants={fadeUp}>
                      <label htmlFor="email" className={labelClass}>
                        Institute Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@iitmandi.ac.in"
                        className={inputClass}
                      />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                      <label htmlFor="password" className={labelClass}>
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={inputClass}
                      />
                    </motion.div>

                    {/* Remember me + Forgot password */}
                    <motion.div
                      variants={fadeUp}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-400/30 dark:border-white/[0.15] dark:bg-white/[0.05] cursor-pointer"
                        />
                        <span className="text-sm text-slate-500 dark:text-white/40 transition-colors duration-500">
                          Remember me
                        </span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400/80 dark:hover:text-indigo-300 transition-colors duration-200"
                      >
                        Forgot password?
                      </Link>
                    </motion.div>

                    <motion.div variants={fadeUp} className="pt-1">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] transition-all duration-300 cursor-pointer dark:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Signing in..." : "Sign In"}
                      </button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Footer link */}
                <motion.p
                  variants={fadeUp}
                  className="mt-5 text-center text-sm text-slate-400 dark:text-white/30 transition-colors duration-500"
                >
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400/80 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    Create account
                  </Link>
                </motion.p>
              </div>
            </motion.div>

            {/* ── Right: Hero panel ─────────────────────────── */}
            <motion.div
              variants={heroContent}
              initial="hidden"
              animate="visible"
              className="hidden lg:flex flex-1 items-center justify-center rounded-2xl m-3 relative overflow-hidden"
            >
              {/* Image layer */}
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: "url('/iitmandi.webp')" }}
              />

              {/* Overlay system */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 dark:from-black/80 dark:via-black/40 dark:to-black/20" />
              <div className="absolute inset-0 bg-indigo-950/20 mix-blend-multiply dark:bg-indigo-950/30" />
              <div className="absolute inset-0 backdrop-blur-[2px]" />

              {/* Inner border */}
              <div className="absolute inset-0 rounded-2xl border border-white/[0.08] dark:border-white/[0.06]" />

              {/* Content */}
              <div className="relative z-10 text-center max-w-sm px-10">
                <p className="text-xs font-semibold tracking-[0.2em] text-indigo-200/60 dark:text-indigo-300/50 uppercase mb-4">
                  Secure Portal
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                  Welcome to
                  <br />
                  IIT Mandi CMS
                </h2>
                <p className="text-white/60 dark:text-white/50 text-sm leading-relaxed">
                  A unified platform for students, faculty, and administration.
                  Manage academics, resources, and campus life — all in one
                  place.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
