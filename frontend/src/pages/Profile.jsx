import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/profileService";
import { validateUrl } from "../utils/validators";

/* ── Social link config (filter by role: student=all, faculty=linkedin+github, admin/authority=none) ── */
const SOCIAL_LINK_CONFIG = [
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    roles: ["student", "faculty"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "text-[#0A66C2]",
    bg: "bg-[#0A66C2]/10 hover:bg-[#0A66C2]/15 dark:bg-[#0A66C2]/15 dark:hover:bg-[#0A66C2]/25",
  },
  {
    key: "githubUrl",
    label: "GitHub",
    roles: ["student", "faculty"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    color: "text-slate-800 dark:text-white/80",
    bg: "bg-slate-800/10 hover:bg-slate-800/15 dark:bg-white/10 dark:hover:bg-white/15",
  },
  {
    key: "leetcodeUrl",
    label: "LeetCode",
    roles: ["student"],
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
    color: "text-[#FFA116]",
    bg: "bg-[#FFA116]/10 hover:bg-[#FFA116]/15 dark:bg-[#FFA116]/15 dark:hover:bg-[#FFA116]/25",
  },
];

function getSocialKeysForRole(role) {
  return SOCIAL_LINK_CONFIG.filter((s) => s.roles.includes(role));
}

/* ── User ID display: studentId for student, employeeId for faculty/admin/authority ── */
function getDisplayUserId(profile, user, role) {
  if (role === "student") return profile?.studentId || user?.studentId || user?.id || "—";
  return profile?.employeeId || user?.employeeId || user?.id || "—";
}

function getUserIdLabel(role) {
  if (role === "student") return "Student ID";
  return "Employee ID";
}

/* ── Role badge colors ── */
const rolePill = {
  student: "bg-indigo-500/10 text-indigo-600 border-indigo-500/15 dark:bg-indigo-400/10 dark:text-indigo-300 dark:border-indigo-400/15",
  faculty: "bg-violet-500/10 text-violet-600 border-violet-500/15 dark:bg-violet-400/10 dark:text-violet-300 dark:border-violet-400/15",
  authority: "bg-amber-500/10 text-amber-600 border-amber-500/15 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/15",
  admin: "bg-rose-500/10 text-rose-600 border-rose-500/15 dark:bg-rose-400/10 dark:text-rose-300 dark:border-rose-400/15",
};

/* ── Detail row ── */
function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-0 py-3 border-b border-slate-200/40 dark:border-white/[0.04] last:border-b-0">
      <span className="sm:w-40 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-700 dark:text-white/75">
        {value || "—"}
      </span>
    </div>
  );
}

/* ── Stagger animation ── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* ── Reusable form field ── */
function Field({ label, value, onChange, error, readOnly, type = "text", placeholder, textarea }) {
  const cls =
    "w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 outline-none " +
    (readOnly
      ? "bg-slate-100/60 dark:bg-white/[0.03] border-slate-200/40 dark:border-white/[0.04] text-slate-400 dark:text-white/30 cursor-not-allowed"
      : error
        ? "bg-white/80 dark:bg-white/[0.03] border-red-300 dark:border-red-500/40 text-slate-800 dark:text-white/80 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
        : "bg-white/80 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/[0.08] text-slate-800 dark:text-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20");

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          rows={3}
          className={cls + " resize-none"}
        />
      ) : type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          className={cls + " cursor-pointer"}
        >
          {placeholder?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {error && <p className="mt-1 text-xs font-medium text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

/* ── Edit Social Links Modal (only socials are editable) ── */
function EditSocialsModal({ open, onClose, profile, user, onSaved }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const role = user?.role || "student";
  const socialKeys = getSocialKeysForRole(role);

  useEffect(() => {
    if (open && profile) {
      const keys = getSocialKeysForRole(role);
      const socialForm = {};
      keys.forEach((s) => { socialForm[s.key] = profile[s.key] || ""; });
      setForm(socialForm);
      setErrors({});
    }
  }, [open, profile, role]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const errs = {};
    for (const s of socialKeys) {
      const urlErr = validateUrl(form[s.key]);
      if (urlErr) errs[s.key] = urlErr;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    const updated = await updateProfile(user.id, { ...profile, ...form });
    setSaving(false);
    onSaved(updated);
    onClose();
  }

  if (socialKeys.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="w-full max-w-md rounded-2xl border border-slate-200/50 dark:border-white/[0.08] bg-white/90 dark:bg-[#12121f]/95 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/40 dark:border-white/[0.06]">
                <h2 className="text-base font-bold text-slate-800 dark:text-white/90">Edit Social Links</h2>
                <button onClick={onClose} className="p-2 rounded-xl text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {socialKeys.map((s) => (
                  <Field key={s.key} label={`${s.label} URL`} value={form[s.key] || ""} onChange={(v) => set(s.key, v)} error={errors[s.key]} placeholder={s.key === "linkedinUrl" ? "https://linkedin.com/in/..." : s.key === "githubUrl" ? "https://github.com/..." : "https://leetcode.com/u/..."} />
                ))}
              </div>
              <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-200/40 dark:border-white/[0.06]">
                <button onClick={onClose} className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200/50 dark:border-white/[0.06] transition-all cursor-pointer">Cancel</button>
                <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale: 0.97 }} className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 cursor-pointer">{saving ? "Saving..." : "Save"}</motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════
   ── Profile Page ──
   ══════════════════════════════════════════════════════════ */
export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editSocialsOpen, setEditSocialsOpen] = useState(false);

  const role = user?.role || "student";

  // Load profile on mount
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    getProfile(user).then((p) => {
      if (!cancelled) {
        setProfile(p);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const memberDate = profile.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2024";

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* ── Top: Avatar card + Details card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">

          {/* ── Left: Avatar Card ── */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center text-center"
          >
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-400/10">
                {profile.fullName?.charAt(0) || "?"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-[3px] border-white dark:border-[#0c0c18] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-800 dark:text-white/90 leading-tight">
              {profile.fullName}
            </h2>

            <span className={`mt-2.5 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${rolePill[role] || rolePill.student}`}>
              {role}
            </span>

            <p className="mt-3 text-sm text-slate-500 dark:text-white/40 break-all">
              {profile.instituteEmail}
            </p>
          </motion.div>

          {/* ── Right: Details Card ── */}
          <motion.div
            variants={item}
            className="rounded-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8"
          >
            <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-4">
              Details
            </h3>

            <div>
              <DetailRow label="Role" value={role.charAt(0).toUpperCase() + role.slice(1)} />
              <DetailRow label="Department" value={profile.department} />
              <DetailRow label="Institute Email" value={profile.instituteEmail} />
              <DetailRow label={getUserIdLabel(role)} value={getDisplayUserId(profile, user, role)} />
            </div>
          </motion.div>
        </div>

        {/* ── Social Links (hidden for admin/authority, editable for student/faculty) ── */}
        {getSocialKeysForRole(role).length > 0 && (
        <motion.div
          variants={item}
          className="rounded-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider">
              Social Profiles
            </h3>
            <button
              onClick={() => setEditSocialsOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            {getSocialKeysForRole(role).map((s) => {
              const url = profile[s.key];
              if (!url) {
                return (
                  <motion.button
                    key={s.key}
                    onClick={() => setEditSocialsOpen(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-dashed border-slate-300/60 dark:border-white/[0.08] px-4 py-3 text-sm font-semibold text-slate-400 dark:text-white/25 hover:text-slate-500 dark:hover:text-white/40 hover:border-slate-400 dark:hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
                  >
                    {s.icon}
                    Add {s.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </motion.button>
                );
              }
              return (
                <motion.a
                  key={s.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`inline-flex items-center gap-2.5 rounded-xl border border-slate-200/50 dark:border-white/[0.06] px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${s.bg} ${s.color}`}
                >
                  {s.icon}
                  {s.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
        )}

        {/* ── Account Info ── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-slate-200/50 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-6 sm:p-8"
        >
          <h3 className="text-sm font-bold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-4">
            Account
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">Member Since</p>
              <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-white/75">{memberDate}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">Last Login</p>
              <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-white/75">Today</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-white/30">Status</p>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                Active
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Edit Socials Modal ── */}
      <EditSocialsModal
        open={editSocialsOpen}
        onClose={() => setEditSocialsOpen(false)}
        profile={profile}
        user={user}
        onSaved={setProfile}
      />
    </>
  );
}
