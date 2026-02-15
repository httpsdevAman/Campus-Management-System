import { formatDate, formatDateTime } from "../../utils/date";

export default function AssignmentList({ items = [], editable = false, onAdd }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06]
      bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5 transition-colors duration-300">
      <div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Assignments</h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-white/40">Track tasks and due dates.</p>
      </div>

      {editable && <AddAssignment onAdd={onAdd} />}

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-white/40 py-4">No assignments yet.</div>
        ) : (
          items.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white/85">{a.title}</div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-white/40">
                    Due: <span className="font-semibold text-slate-700 dark:text-white/70">{formatDate(a.dueAt)}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 dark:text-white/30">{formatDateTime(a.at)}</div>
              </div>
              {a.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-white/65 whitespace-pre-wrap">
                  {a.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AddAssignment({ onAdd }) {
  const [title, setTitle] = useStateSafe("");
  const [dueAt, setDueAt] = useStateSafe("");
  const [description, setDescription] = useStateSafe("");

  return (
    <div className="mt-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06]
      bg-white/40 dark:bg-white/[0.03] p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Assignment title"
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <input
          type="datetime-local"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Description (optional)"
        className="mt-3 w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
          px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
      />
      <div className="mt-3">
        <button
          onClick={() => {
            if (!title.trim() || !dueAt) return;
            const iso = new Date(dueAt).toISOString();
            onAdd?.({ title, dueAt: iso, description });
            setTitle("");
            setDueAt("");
            setDescription("");
          }}
          className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
        >
          + Add Assignment
        </button>
      </div>
    </div>
  );
}

function useStateSafe(initial) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return require("react").useState(initial);
}
