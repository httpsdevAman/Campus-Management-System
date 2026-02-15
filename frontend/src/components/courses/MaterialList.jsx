import { formatDateTime } from "../../utils/date";

export default function MaterialList({ items = [], editable = false, onAdd }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06]
      bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5 transition-colors duration-300">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Materials</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-white/40">Links, PDFs, videos, and resources.</p>
        </div>
      </div>

      {editable && <AddMaterial onAdd={onAdd} />}

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-white/40 py-4">No materials yet.</div>
        ) : (
          items.map((m) => (
            <a
              key={m.id}
              href={m.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl border border-slate-200/60 dark:border-white/[0.06]
                bg-white/40 dark:bg-white/[0.03] p-4 hover:bg-white/60 dark:hover:bg-white/[0.04] transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-white/40">{m.type}</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white/85">{m.title}</div>
                  <div className="mt-1 text-xs text-slate-400 dark:text-white/30">{formatDateTime(m.at)}</div>
                </div>
                <span className="text-xs font-semibold text-indigo-500">Open</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

function AddMaterial({ onAdd }) {
  const [title, setTitle] = useStateSafe("");
  const [type, setType] = useStateSafe("LINK");
  const [url, setUrl] = useStateSafe("");

  return (
    <div className="mt-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06]
      bg-white/40 dark:bg-white/[0.03] p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Material title"
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        >
          <option value="LINK">LINK</option>
          <option value="PDF">PDF</option>
          <option value="VIDEO">VIDEO</option>
        </select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>
      <div className="mt-3">
        <button
          onClick={() => {
            if (!title.trim() || !url.trim()) return;
            onAdd?.({ title, type, url });
            setTitle("");
            setType("LINK");
            setUrl("");
          }}
          className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
        >
          + Add Material
        </button>
      </div>
    </div>
  );
}

// tiny safe hook without importing react in this file's top (keeps bundle simple)
function useStateSafe(initial) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return require("react").useState(initial);
}
