import SettingsPanel from "./SettingsPanel";

function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all" />
    </div>
  );
}

export default function AcademicSettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  function set(key, val) { onChange({ ...d, [key]: val }); }

  return (
    <SettingsPanel title="Academic Term" description="Configure the current academic session" onSave={onSave} onReset={onReset} saving={saving}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Current Semester" value={d.currentSemester || ""} onChange={(v) => set("currentSemester", v)} placeholder="Spring 2026" />
        <Field label="Academic Year" value={d.academicYear || ""} onChange={(v) => set("academicYear", v)} placeholder="2025-26" />
        <Field label="Registration Start" value={d.registrationStart || ""} onChange={(v) => set("registrationStart", v)} type="date" />
        <Field label="Registration End" value={d.registrationEnd || ""} onChange={(v) => set("registrationEnd", v)} type="date" />
        <Field label="Default Credit Limit" value={d.defaultCreditLimit ?? ""} onChange={(v) => set("defaultCreditLimit", Number(v) || 0)} type="number" placeholder="24" />
      </div>
    </SettingsPanel>
  );
}
