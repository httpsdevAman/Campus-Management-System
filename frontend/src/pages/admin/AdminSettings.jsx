import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSettings, updateSettings, resetSettings, getDefaults } from "../../services/settingsService";
import SettingsTabs, { TABS } from "../../components/settings/SettingsTabs";
import BrandingSettings from "../../components/settings/BrandingSettings";
import AcademicSettings from "../../components/settings/AcademicSettings";
import CalendarSettings from "../../components/settings/CalendarSettings";
import UserPolicySettings from "../../components/settings/UserPolicySettings";
import GrievanceSettings from "../../components/settings/GrievanceSettings";
import OpportunitySettings from "../../components/settings/OpportunitySettings";
import Toast from "../../components/common/Toast";

/* ── Animation ── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } } };

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("branding");
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  const load = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function showToast(type, message) { setToast({ open: true, type, message }); }

  /* Section-level updater — mutates local state only */
  function updateSection(section, data) {
    setSettings((prev) => ({ ...prev, [section]: data }));
  }

  /* Save current section */
  async function handleSave() {
    setSaving(true);
    try {
      await updateSettings({ [activeTab]: settings[activeTab] });
      showToast("success", "Settings saved");
    } catch {
      showToast("error", "Failed to save");
    }
    setSaving(false);
  }

  /* Reset current section to defaults */
  async function handleReset() {
    const defaults = getDefaults();
    const sectionDefaults = defaults[activeTab];
    if (!sectionDefaults) return;
    setSettings((prev) => ({ ...prev, [activeTab]: sectionDefaults }));
    await updateSettings({ [activeTab]: sectionDefaults });
    showToast("success", "Reset to defaults");
  }

  /* Props passed to every section panel */
  function panelProps(section) {
    return {
      data: settings?.[section],
      onChange: (val) => updateSection(section, val),
      onSave: handleSave,
      onReset: handleReset,
      saving,
    };
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-[3px] border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const panels = {
    branding:      <BrandingSettings {...panelProps("branding")} />,
    academic:      <AcademicSettings {...panelProps("academic")} />,
    calendar:      <CalendarSettings {...panelProps("calendar")} />,
    userPolicy:    <UserPolicySettings {...panelProps("userPolicy")} />,
    grievance:     <GrievanceSettings {...panelProps("grievance")} />,
    opportunities: <OpportunitySettings {...panelProps("opportunities")} />,
  };

  return (
    <>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* ── Header ── */}
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white/90">Settings</h1>
          <p className="text-[13px] font-medium text-slate-400 dark:text-white/30 mt-1">System configuration</p>
          <div className="mt-3 h-px bg-gradient-to-r from-slate-200/80 via-slate-200/40 to-transparent dark:from-white/[0.06] dark:via-white/[0.03] dark:to-transparent" />
        </motion.div>

        {/* ── Main: Tabs + Panel ── */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          {/* Left: tab nav */}
          {/* Desktop: vertical sidebar, Mobile: horizontal scrollable chips */}
          <div>
            {/* Desktop */}
            <div className="hidden lg:block sticky top-24">
              <SettingsTabs active={activeTab} onChange={setActiveTab} />
            </div>

            {/* Mobile: horizontal chips */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
                      : "text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50 hover:bg-slate-100/50 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: panel */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}>
                {panels[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} />
    </>
  );
}
