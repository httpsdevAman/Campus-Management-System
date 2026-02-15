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

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200/30 dark:border-white/[0.03] last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-white/75">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
          checked ? "bg-indigo-500" : "bg-slate-300 dark:bg-white/[0.12]"
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`} />
      </button>
    </div>
  );
}

const ROLE_OPTIONS = ["student", "faculty", "authority", "admin"];

export default function UserPolicySettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  function set(key, val) { onChange({ ...d, [key]: val }); }

  return (
    <SettingsPanel title="User & Access Policies" description="Control registration and access rules" onSave={onSave} onReset={onReset} saving={saving}>
      <Toggle label="Registration Enabled" description="Allow new users to register" checked={d.registrationEnabled ?? true} onChange={(v) => set("registrationEnabled", v)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Field label="Allowed Email Domain" value={d.allowedEmailDomain || ""} onChange={(v) => set("allowedEmailDomain", v)} placeholder="iitmandi.ac.in" />
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">Default Role</label>
          <select value={d.defaultRole || "student"} onChange={(e) => set("defaultRole", e.target.value)}
            className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-white/70 outline-none cursor-pointer">
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
          </select>
        </div>
        <Field label="Session Timeout (minutes)" value={d.sessionTimeoutMinutes ?? ""} onChange={(v) => set("sessionTimeoutMinutes", Number(v) || 0)} type="number" placeholder="60" />
      </div>
    </SettingsPanel>
  );
}
