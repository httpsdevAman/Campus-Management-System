import SettingsPanel from "./SettingsPanel";

const ACCENT_OPTIONS = [
  { value: "indigo",  label: "Indigo",  dot: "bg-indigo-500" },
  { value: "violet",  label: "Violet",  dot: "bg-violet-500" },
  { value: "emerald", label: "Emerald", dot: "bg-emerald-500" },
];

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all" />
    </div>
  );
}

export default function BrandingSettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  function set(key, val) { onChange({ ...d, [key]: val }); }

  return (
    <SettingsPanel title="Branding" description="Customize your institute identity" onSave={onSave} onReset={onReset} saving={saving}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Institute Name" value={d.instituteName || ""} onChange={(v) => set("instituteName", v)} placeholder="IIT Mandi" />
        <Field label="App Name" value={d.appName || ""} onChange={(v) => set("appName", v)} placeholder="Campus CMS" />
        <Field label="Light Logo Path" value={d.lightLogoPath || ""} onChange={(v) => set("lightLogoPath", v)} placeholder="/logo-light.png" />
        <Field label="Dark Logo Path" value={d.darkLogoPath || ""} onChange={(v) => set("darkLogoPath", v)} placeholder="/logo-dark.png" />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-2">Accent Color</label>
        <div className="flex items-center gap-3">
          {ACCENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => set("accentColor", opt.value)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                d.accentColor === opt.value
                  ? "border-indigo-400 dark:border-indigo-400/40 bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-300"
                  : "border-slate-200/60 dark:border-white/[0.06] text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.03]"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${opt.dot}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </SettingsPanel>
  );
}
