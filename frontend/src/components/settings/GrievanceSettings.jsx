import { useState } from "react";
import SettingsPanel from "./SettingsPanel";

function Field({ label, value, onChange, type = "number", placeholder, suffix }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input type={type} value={value} onChange={(e) => onChange(type === "number" ? (Number(e.target.value) || 0) : e.target.value)} placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all" />
        {suffix && <span className="text-xs font-medium text-slate-400 dark:text-white/30 shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-white/75">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${checked ? "bg-indigo-500" : "bg-slate-300 dark:bg-white/[0.12]"}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function TagInput({ label, tags, onChange }) {
  const [input, setInput] = useState("");

  function add() {
    const val = input.trim();
    if (val && !tags.includes(val)) { onChange([...tags, val]); }
    setInput("");
  }
  function remove(tag) { onChange(tags.filter((t) => t !== tag)); }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
            {t}
            <button onClick={() => remove(t)} className="hover:text-red-500 transition-colors cursor-pointer">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add category…"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all" />
        <button onClick={add} className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer">Add</button>
      </div>
    </div>
  );
}

export default function GrievanceSettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  function set(key, val) { onChange({ ...d, [key]: val }); }

  return (
    <SettingsPanel title="Grievance Rules" description="Configure SLAs and grievance policies" onSave={onSave} onReset={onReset} saving={saving}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">SLA by Priority (days)</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Low" value={d.slaLow ?? 14} onChange={(v) => set("slaLow", v)} suffix="days" />
        <Field label="Medium" value={d.slaMedium ?? 7} onChange={(v) => set("slaMedium", v)} suffix="days" />
        <Field label="High" value={d.slaHigh ?? 3} onChange={(v) => set("slaHigh", v)} suffix="days" />
      </div>

      <Toggle label="Escalation Enabled" description="Auto-escalate overdue grievances" checked={d.escalationEnabled ?? true} onChange={(v) => set("escalationEnabled", v)} />

      <Field label="Auto-Close Resolved After" value={d.autoCloseAfterDays ?? 30} onChange={(v) => set("autoCloseAfterDays", v)} suffix="days" />

      <TagInput label="Allowed Categories" tags={d.categories || []} onChange={(v) => set("categories", v)} />
    </SettingsPanel>
  );
}
