import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Constants ── */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const dotColor = {
  amber:  "bg-amber-400",
  red:    "bg-red-400",
  violet: "bg-violet-400",
  blue:   "bg-blue-400",
  rose:   "bg-rose-400",
};

const tagColor = {
  HOLIDAY:  "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  EXAM:     "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-300",
  EVENT:    "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
  NOTICE:   "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
  DEADLINE: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
};

/* ── Helpers ── */
function toKey(d) {
  const yr = d.getFullYear();
  const mn = String(d.getMonth() + 1).padStart(2, "0");
  const dy = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mn}-${dy}`;
}

function buildGrid(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/* ── Small icons ── */
const ChevLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
);
const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);

/* ══════════════════════════════════════════
   Inline form for creating / editing events
   ══════════════════════════════════════════ */
function EventForm({ initial, date, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [type, setType] = useState(initial?.type || "EVENT");
  const [desc, setDesc] = useState(initial?.description || "");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const typeOpts = [
    { value: "HOLIDAY", label: "Holiday",  color: "amber" },
    { value: "EXAM",    label: "Exam",     color: "red" },
    { value: "EVENT",   label: "Event",    color: "violet" },
    { value: "NOTICE",  label: "Notice",   color: "blue" },
  ];

  function submit() {
    if (!title.trim()) return;
    const chosen = typeOpts.find((t) => t.value === type);
    onSave({
      title: title.trim(),
      date: initial?.date || date,
      type,
      color: chosen?.color || "violet",
      description: desc.trim(),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="pt-3 space-y-2.5">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-700 dark:text-white/70 outline-none cursor-pointer"
          >
            {typeOpts.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          className="w-full rounded-lg border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-800 dark:text-white/80 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        />
        <div className="flex items-center gap-2 pt-1">
          <button onClick={submit} className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer">
            {initial ? "Update" : "Add"}
          </button>
          <button onClick={onCancel} className="rounded-lg border border-slate-200/60 dark:border-white/[0.08] px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   CalendarCard component
   ══════════════════════════════════════════
   Props:
     events       – [{ id, title, date:"YYYY-MM-DD", type, color, description? }]
     onCreateEvent(data)  – admin only
     onEditEvent(id, data) – admin only
     onDeleteEvent(id)    – admin only
*/
export default function CalendarCard({ events = [], onCreateEvent, onEditEvent, onDeleteEvent }) {
  const today = new Date();
  const todayKey = toKey(today);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(todayKey);
  const [dir, setDir] = useState(0);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // event object

  const editable = !!(onCreateEvent && onDeleteEvent);

  /* Navigate months */
  function prev() { setDir(-1); if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); setAdding(false); setEditing(null); }
  function next() { setDir(1);  if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); setAdding(false); setEditing(null); }

  /* Build event map */
  const eventMap = {};
  events.forEach((e) => {
    if (!eventMap[e.date]) eventMap[e.date] = [];
    eventMap[e.date].push(e);
  });

  const grid = buildGrid(year, month);
  const selectedEvents = selected ? (eventMap[selected] || []) : [];

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl p-5">

      {/* ── Month header ── */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white/90">
          {MONTHS[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"><ChevLeft /></button>
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); setSelected(todayKey); setDir(0); }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Today
          </button>
          <button onClick={next} className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"><ChevRight /></button>
        </div>
      </div>

      {/* ── Day labels ── */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-white/25 py-1">
            {d.slice(0, 2)}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: dir > 0 ? 24 : dir < 0 ? -24 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir > 0 ? -24 : 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="grid grid-cols-7"
        >
          {grid.map((day, i) => {
            if (day === null) return <div key={`pad-${i}`} />;

            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateKey === todayKey;
            const isSel = dateKey === selected;
            const hasEvents = eventMap[dateKey]?.length > 0;
            const dayEvents = eventMap[dateKey] || [];

            // collect unique dot colors (max 3)
            const dots = [...new Set(dayEvents.map((e) => e.color))].slice(0, 3);

            return (
              <button
                key={dateKey}
                onClick={() => { setSelected(dateKey); setAdding(false); setEditing(null); }}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  isSel
                    ? "bg-indigo-500/10 dark:bg-indigo-400/10"
                    : "hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className={`text-xs font-semibold leading-none ${
                  isSel
                    ? "text-indigo-600 dark:text-indigo-300"
                    : isToday
                      ? "text-indigo-500 dark:text-indigo-400"
                      : "text-slate-600 dark:text-white/60"
                }`}>
                  {day}
                </span>
                {/* Event dots */}
                {hasEvents && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dots.map((c, j) => (
                      <span key={j} className={`w-1 h-1 rounded-full ${dotColor[c] || "bg-slate-400"}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Divider ── */}
      <div className="my-3 h-px bg-slate-200/40 dark:bg-white/[0.04]" />

      {/* ── Selected day event list ── */}
      <div className="min-h-[48px]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider">
            {selected
              ? new Date(selected + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Select a day"}
          </p>
          {editable && selected && (
            <button
              onClick={() => { setAdding(true); setEditing(null); }}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <PlusIcon /> Add
            </button>
          )}
        </div>

        {selectedEvents.length === 0 && !adding && (
          <p className="text-xs text-slate-400 dark:text-white/25">No events</p>
        )}

        <AnimatePresence mode="popLayout">
          {selectedEvents.map((evt) => (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-start gap-2.5 py-2 group"
            >
              <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[evt.color] || "bg-slate-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 dark:text-white/75 truncate">
                  {evt.title}
                </p>
                {evt.description && (
                  <p className="text-[11px] text-slate-400 dark:text-white/30 truncate">{evt.description}</p>
                )}
                <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${tagColor[evt.type] || tagColor.EVENT}`}>
                  {evt.type === "DEADLINE" ? "Due" : evt.type.toLowerCase()}
                </span>
              </div>
              {editable && evt.type !== "DEADLINE" && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => { setEditing(evt); setAdding(false); }}
                    className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  ><EditIcon /></button>
                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1 rounded text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  ><TrashIcon /></button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Inline create / edit form */}
        <AnimatePresence>
          {adding && (
            <EventForm
              date={selected}
              onSave={(data) => { onCreateEvent(data); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          )}
          {editing && (
            <EventForm
              initial={editing}
              onSave={(data) => { onEditEvent(editing.id, data); setEditing(null); }}
              onCancel={() => setEditing(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
