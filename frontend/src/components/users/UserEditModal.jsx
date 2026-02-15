import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "MATH", "HSS", "ADMIN"];

function Field({ label, value, onChange, readOnly, type = "text", options, placeholder }) {
  const cls =
    "w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 outline-none " +
    (readOnly
      ? "bg-slate-100/60 dark:bg-white/[0.03] border-slate-200/40 dark:border-white/[0.04] text-slate-400 dark:text-white/30 cursor-not-allowed"
      : "bg-white/80 dark:bg-white/[0.03] border-slate-200/60 dark:border-white/[0.08] text-slate-800 dark:text-white/80 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20");

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      {type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={readOnly} className={cls + " cursor-pointer"}>
          {(options || []).map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} readOnly={readOnly} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

/**
 * Glass modal for editing a user.
 * Props: { open, user, onSave({ name, department, meta }), onClose }
 */
export default function UserEditModal({ open, user, onSave, onClose }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const role = user?.role || "student";

  useEffect(() => {
    if (open && user) {
      setForm({
        name: user.name || "",
        department: user.department || "CSE",
        phone: user.meta?.phone || "",
        rollNo: user.meta?.rollNo || "",
        semester: user.meta?.semester ?? "",
        designation: user.meta?.designation || "",
      });
    }
  }, [open, user]);

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

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const meta = { phone: form.phone };
    if (role === "student") { meta.rollNo = form.rollNo; meta.semester = Number(form.semester) || 0; }
    if (role === "faculty" || role === "authority" || role === "admin") { meta.designation = form.designation; }
    await onSave({ name: form.name.trim(), department: form.department, meta });
    setSaving(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
          >
            <div className="w-full max-w-lg rounded-2xl border border-slate-200/50 dark:border-white/[0.08] bg-white/90 dark:bg-[#12121f]/95 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/40">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/40 dark:border-white/[0.06]">
                <h2 className="text-base font-bold text-slate-800 dark:text-white/90">Edit User</h2>
                <button onClick={onClose} className="p-2 rounded-xl text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} placeholder="Full name" />
                  <Field label="Email" value={user?.email || ""} readOnly />
                  <Field label="Department" value={form.department} onChange={(v) => set("department", v)} type="select" options={DEPARTMENTS} />
                  <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 …" />

                  {role === "student" && (
                    <>
                      <Field label="Roll No." value={form.rollNo} onChange={(v) => set("rollNo", v)} placeholder="B21CS001" />
                      <Field label="Semester" value={form.semester} onChange={(v) => set("semester", v)} type="number" placeholder="6" />
                    </>
                  )}
                  {(role === "faculty" || role === "authority" || role === "admin") && (
                    <Field label="Designation" value={form.designation} onChange={(v) => set("designation", v)} placeholder="Professor" />
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-200/40 dark:border-white/[0.06]">
                <button onClick={onClose} className="rounded-xl px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-white/50 border border-slate-200/50 dark:border-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer">
                  Cancel
                </button>
                <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale: 0.97 }}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-500/90 dark:hover:bg-indigo-500 shadow-sm transition-all cursor-pointer disabled:opacity-50">
                  {saving ? "Saving…" : "Save Changes"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
