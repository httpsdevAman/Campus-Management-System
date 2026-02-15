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
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 dark:bg-violet-400/10 px-2.5 py-1 text-[11px] font-semibold text-violet-600 dark:text-violet-300">
            {t}
            <button onClick={() => remove(t)} className="hover:text-red-500 transition-colors cursor-pointer">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add type…"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
          className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all" />
        <button onClick={add} className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2.5 text-xs font-bold transition-colors cursor-pointer">Add</button>
      </div>
    </div>
  );
}

export default function OpportunitySettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  function set(key, val) { onChange({ ...d, [key]: val }); }

  return (
    <SettingsPanel title="Opportunities Moderation" description="Control opportunity posting rules" onSave={onSave} onReset={onReset} saving={saving}>
      <Toggle label="Require Admin Approval" description="Faculty-posted opportunities need admin approval before visibility" checked={d.requireApproval ?? false} onChange={(v) => set("requireApproval", v)} />
      <Field label="Auto-Expire After" value={d.autoExpireDays ?? 60} onChange={(v) => set("autoExpireDays", v)} suffix="days" />
      <TagInput label="Allowed Opportunity Types" tags={d.allowedTypes || []} onChange={(v) => set("allowedTypes", v)} />
    </SettingsPanel>
  );
}
