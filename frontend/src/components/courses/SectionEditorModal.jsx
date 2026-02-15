import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTION_TYPES = ["NOTES", "ASSIGNMENTS", "RESOURCES", "CUSTOM"];

const inputClass =
  "w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

const selectClass =
  "w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

const optClass = "bg-white dark:bg-[#161625] dark:text-white";

function Overlay({ children, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg rounded-2xl border border-slate-200/60 dark:border-white/[0.08] bg-white dark:bg-[#161625] shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Toggle switch ── */
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer ${
          checked ? "bg-indigo-500" : "bg-slate-200 dark:bg-white/10"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm font-semibold text-slate-700 dark:text-white/75">{label}</span>
    </label>
  );
}

/* ── Create Section Modal ── */
export function CreateSectionModal({ onClose, onSave, saving }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("NOTES");

  return (
    <Overlay onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">New Section</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Section Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Week 3 Notes" className={inputClass + " mt-1.5"} autoFocus />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Type (semantic)</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " mt-1.5"}>
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t} className={optClass}>{t}</option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-slate-400 dark:text-white/25">The displayed name is always what you type above.</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={!name.trim() || saving}
            onClick={() => onSave({ name, type })}
            className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? "Creating..." : "Create"}
          </motion.button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Rename Section Modal ── */
export function RenameSectionModal({ currentName, onClose, onSave, saving }) {
  const [name, setName] = useState(currentName || "");

  return (
    <Overlay onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Rename Section</h3>
        <div>
          <label className="text-xs font-semibold text-slate-500 dark:text-white/40">New Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass + " mt-1.5"} autoFocus />
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={!name.trim() || saving}
            onClick={() => onSave(name)}
            className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </motion.button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Delete Section Confirm Modal ── */
export function DeleteSectionModal({ sectionName, itemCount, onClose, onConfirm, saving }) {
  return (
    <Overlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-400/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 dark:text-red-400">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Section</h3>
            <p className="text-xs text-slate-400 dark:text-white/30">{sectionName}</p>
          </div>
        </div>
        {itemCount > 0 ? (
          <div className="rounded-xl bg-red-50/50 dark:bg-red-400/5 border border-red-200/50 dark:border-red-400/10 p-3.5 mb-4">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              This section contains {itemCount} item{itemCount !== 1 ? "s" : ""}. Deleting it will remove all items permanently.
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-white/60 mb-4">This section is empty and will be removed.</p>
        )}
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Delete Item Confirm Modal ── */
export function DeleteItemModal({ itemTitle, onClose, onConfirm, saving }) {
  return (
    <Overlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-400/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 dark:text-red-400">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Item</h3>
            <p className="text-xs text-slate-400 dark:text-white/30 truncate max-w-[280px]">{itemTitle}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/60 mb-4">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? "Deleting..." : "Delete"}
          </motion.button>
        </div>
      </div>
    </Overlay>
  );
}

/* ── Unified Add / Edit Material Modal ── */
export function MaterialModal({ sectionName, sectionId, editingItem, onClose, onSave, onDelete, onDuplicate, saving }) {
  const isEdit = !!editingItem;
  const meta = editingItem?.meta || {};
  const isAssignmentSection = sectionId === "sec-assignments";

  const [title, setTitle] = useState(editingItem?.title || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [url, setUrl] = useState(editingItem?.url || "");
  const [attachment, setAttachment] = useState(editingItem?.attachment || null);
  const [attachmentFile, setAttachmentFile] = useState(null); // actual File for upload
  const [published, setPublished] = useState(editingItem?.published !== undefined ? editingItem.published : true);
  const [tagsStr, setTagsStr] = useState((editingItem?.tags || []).join(", "));

  const [isAssignment, setIsAssignment] = useState(editingItem?.kind === "ASSIGNMENT" || isAssignmentSection);
  const [submissionRequired, setSubmissionRequired] = useState(meta.submissionRequired ?? false);
  const [dueAt, setDueAt] = useState(meta.dueAt ? meta.dueAt.slice(0, 16) : "");
  const [points, setPoints] = useState(meta.points != null ? String(meta.points) : "");
  const [allowedTypes, setAllowedTypes] = useState((meta.allowedTypes || []).join(", "));
  const [maxSizeMB, setMaxSizeMB] = useState(meta.maxSizeMB != null ? String(meta.maxSizeMB) : "");
  const [allowResubmission, setAllowResubmission] = useState(meta.allowResubmission ?? true);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({ name: file.name, size: file.size, type: file.type });
      setAttachmentFile(file);
    }
  }

  function handleSave() {
    if (!title.trim()) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const item = {
      kind: isAssignment ? "ASSIGNMENT" : "MATERIAL",
      title,
      description,
      url,
      attachment,
      published,
      tags,
      file: attachmentFile,
    };

    if (isAssignment) {
      const parsedTypes = allowedTypes
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      item.meta = {
        submissionRequired,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
        points: points ? Number(points) : null,
        allowedTypes: parsedTypes,
        maxSizeMB: maxSizeMB ? Number(maxSizeMB) : null,
        allowResubmission,
      };
    }

    onSave(item);
  }

  return (
    <Overlay onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? "Edit Material" : "Add Material"}
          </h3>
          {isEdit && onDuplicate && (
            <button
              onClick={onDuplicate}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Duplicate
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 dark:text-white/30 mb-4">
          {isEdit ? `Editing in ${sectionName}` : `to ${sectionName}`}
        </p>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Material title" className={inputClass + " mt-1.5"} autoFocus />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Optional description..." className={inputClass + " mt-1.5"} />
          </div>

          {/* Link URL */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Link URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass + " mt-1.5"} />
          </div>

          {/* Attachment */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Attachment</label>
            <div className="mt-1.5">
              {attachment ? (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-indigo-500 dark:text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <span className="text-sm text-slate-700 dark:text-white/70 truncate">{attachment.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-white/25 shrink-0">{(attachment.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button onClick={() => { setAttachment(null); setAttachmentFile(null); }} className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer">Remove</button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-white/[0.08] p-4 hover:border-indigo-300 dark:hover:border-indigo-400/20 transition-colors">
                  <div className="text-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-400 dark:text-white/25"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-white/40">Click to attach a file</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/25">Use Add Material or Add Assignment on the course for file uploads</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileSelect} />
                </label>
              )}
            </div>
          </div>

          {/* Visibility */}
          <Toggle checked={published} onChange={setPublished} label={published ? "Published" : "Hidden"} />

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Tags</label>
            <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. lecture, notes, graded" className={inputClass + " mt-1.5"} />
            <p className="mt-1 text-[10px] text-slate-400 dark:text-white/25">Comma-separated</p>
          </div>

          {/* Assignment toggle (hidden when adding to Assignments section) */}
          <div className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-4">
            {!isAssignmentSection && (
              <Toggle checked={isAssignment} onChange={setIsAssignment} label="This is an assignment" />
            )}
            {(isAssignment || isAssignmentSection) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={(isAssignmentSection ? "" : "mt-4 ") + "space-y-4"}>
                  <Toggle checked={submissionRequired} onChange={setSubmissionRequired} label="Submission required" />

                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Due Date/Time</label>
                      <input type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className={inputClass + " mt-1.5"} style={{ colorScheme: "auto" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Points</label>
                      <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g. 20" className={inputClass + " mt-1.5"} />
                    </div>
                  </div>

                  {!isAssignmentSection && (
                    <>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Allowed file types</label>
                        <input value={allowedTypes} onChange={(e) => setAllowedTypes(e.target.value)} placeholder="e.g. pdf, zip, png" className={inputClass + " mt-1.5"} />
                        <p className="mt-1 text-[10px] text-slate-400 dark:text-white/25">Comma-separated</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Max file size (MB)</label>
                        <input type="number" value={maxSizeMB} onChange={(e) => setMaxSizeMB(e.target.value)} placeholder="e.g. 10" className={inputClass + " mt-1.5"} />
                      </div>
                      <Toggle checked={allowResubmission} onChange={setAllowResubmission} label="Allow resubmission" />
                    </>
                  )}
                  {isAssignmentSection && (
                    <p className="text-[10px] text-slate-400 dark:text-white/25">Attach a PDF file for the assignment above.</p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            {isEdit && onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!title.trim() || saving}
              onClick={handleSave}
              className="rounded-xl bg-indigo-500 px-5 py-2 text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add"}
            </motion.button>
          </div>
        </div>

        {/* Inline delete confirm */}
        {showDeleteConfirm && (
          <div className="mt-4 rounded-xl bg-red-50/50 dark:bg-red-400/5 border border-red-200/50 dark:border-red-400/10 p-4">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-3">Are you sure you want to delete this item?</p>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white dark:hover:bg-white/[0.05] transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); onDelete(); }}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                Yes, delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Overlay>
  );
}
