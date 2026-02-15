import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsPanel from "./SettingsPanel";
import {
  listGlobalEvents,
  createGlobalEvent,
  updateGlobalEvent,
  deleteGlobalEvent,
} from "../../services/calendarService";

const TYPE_OPTIONS = [
  { value: "HOLIDAY", label: "Holiday" },
  { value: "EXAM",    label: "Exam" },
  { value: "EVENT",   label: "Event" },
  { value: "NOTICE",  label: "Notice" },
];
const COLOR_MAP = { HOLIDAY: "amber", EXAM: "red", EVENT: "violet", NOTICE: "blue" };
const TAG_COLOR = {
  HOLIDAY: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  EXAM:    "bg-red-500/10 text-red-600 dark:text-red-300",
  EVENT:   "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  NOTICE:  "bg-blue-500/10 text-blue-600 dark:text-blue-300",
};

function EventForm({ initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(initial?.date || "");
  const [type, setType] = useState(initial?.type || "EVENT");
  const [desc, setDesc] = useState(initial?.description || "");

  function handle() {
    if (!title.trim() || !date) return;
    onSubmit({ title: title.trim(), date, type, color: COLOR_MAP[type] || "violet", description: desc.trim() });
  }

  return (
    <div className="rounded-xl border border-slate-200/40 dark:border-white/[0.04] p-4 space-y-3 bg-white/40 dark:bg-white/[0.01]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title *"
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 transition-all" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 transition-all" />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-700 dark:text-white/70 outline-none cursor-pointer">
          {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)"
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 transition-all" />
      </div>
      <div className="flex gap-2">
        <button onClick={handle} className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer">
          {initial ? "Update" : "Add Event"}
        </button>
        <button onClick={onCancel} className="rounded-lg border border-slate-200/60 dark:border-white/[0.08] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CalendarSettings({ data, onChange, onSave, onReset, saving }) {
  const d = data || {};
  const [events, setEvents] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { listGlobalEvents().then(setEvents); }, []);

  async function reload() { setEvents(await listGlobalEvents()); }

  async function handleCreate(evtData) {
    await createGlobalEvent(evtData);
    await reload();
    setAdding(false);
  }
  async function handleUpdate(evtData) {
    await updateGlobalEvent(editing.id, evtData);
    await reload();
    setEditing(null);
  }
  async function handleDelete(id) {
    await deleteGlobalEvent(id);
    await reload();
  }

  return (
    <SettingsPanel title="Calendar & Notices" description="Manage global events and pinned notices" onSave={onSave} onReset={onReset} saving={saving}>
      {/* Pinned notice */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-1.5">Pinned Notice</label>
        <textarea
          value={d.pinnedNotice || ""}
          onChange={(e) => onChange({ ...d, pinnedNotice: e.target.value })}
          placeholder="Write a notice visible on all dashboards…"
          rows={2}
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all resize-none"
        />
      </div>

      {/* Global events */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">Global Events</label>
          {!adding && !editing && (
            <button onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Add event
            </button>
          )}
        </div>

        <AnimatePresence>
          {adding && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
              <EventForm onSubmit={handleCreate} onCancel={() => setAdding(false)} />
            </motion.div>
          )}
          {editing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
              <EventForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.length === 0 && <p className="text-xs text-slate-400 dark:text-white/25">No events</p>}
          {events
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2 px-3 rounded-xl border border-slate-200/30 dark:border-white/[0.03] group hover:bg-slate-50/40 dark:hover:bg-white/[0.01] transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-slate-700 dark:text-white/75 truncate">{e.title}</p>
                  <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${TAG_COLOR[e.type] || TAG_COLOR.EVENT}`}>{e.type.toLowerCase()}</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">
                  {new Date(e.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {e.description && ` — ${e.description}`}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                <button onClick={() => { setEditing(e); setAdding(false); }}
                  className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button onClick={() => handleDelete(e.id)}
                  className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SettingsPanel>
  );
}
