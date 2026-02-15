import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../../utils/date";

const inputClass =
  "w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function AssignmentDrawer({
  assignment,
  courseId,
  sectionId,
  studentId,
  onClose,
  onSubmit,
  submitting = false,
}) {
  const meta = assignment?.meta || {};
  const points = meta.points ?? assignment?.points;
  const dueDate = assignment?.dueAt ? new Date(assignment.dueAt) : null;
  const isPast = dueDate && dueDate < new Date();
  const submissionRequired = meta.submissionRequired ?? false;
  const allowedTypes = meta.allowedTypes || [];
  const maxSizeMB = meta.maxSizeMB || null;
  const allowResubmission = meta.allowResubmission ?? true;

  // Find existing submission by this student (handle ObjectId vs string)
  const existingSub = (assignment?.submissions || []).find(
    (s) => s.student && String(s.student.id || s.student) === String(studentId)
  );

  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState([]);
  const [showUpload, setShowUpload] = useState(!existingSub);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFiles = useCallback(
    (fileList) => {
      const errs = [];
      for (const f of fileList) {
        if (allowedTypes.length > 0) {
          const ext = f.name.split(".").pop()?.toLowerCase();
          if (!allowedTypes.includes(ext)) {
            errs.push(`"${f.name}" — type .${ext} not allowed (expected: ${allowedTypes.join(", ")})`);
          }
        }
        if (maxSizeMB && f.size > maxSizeMB * 1048576) {
          errs.push(`"${f.name}" — exceeds ${maxSizeMB} MB limit`);
        }
      }
      return errs;
    },
    [allowedTypes, maxSizeMB]
  );

  function addFiles(fileList) {
    const arr = Array.from(fileList);
    const errs = validateFiles(arr);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setFiles((prev) => [...prev, ...arr]);
  }

  function removeFile(idx) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleSubmit() {
    if (files.length === 0) {
      setErrors(["Please select at least one file."]);
      return;
    }
    const errs = validateFiles(files);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    onSubmit({
      courseId,
      sectionId,
      assignmentId: assignment.id,
      files, // Pass actual File objects for upload
      note,
    });
  }

  const canResubmit = existingSub && allowResubmission && !isPast;

  return (
    <AnimatePresence>
      {assignment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-lg rounded-2xl border border-slate-200/60 dark:border-white/[0.08] bg-white dark:bg-[#161625] shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {assignment.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {submissionRequired ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300">
                        Submission Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/40">
                        Reference Only
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isPast
                          ? "bg-red-50 text-red-500 dark:bg-red-400/10 dark:text-red-300"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
                      }`}
                    >
                      {isPast ? "Past Due" : "Open"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/30">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {dueDate && (
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide">Due Date</span>
                    <p className={`mt-0.5 text-sm font-bold ${isPast ? "text-red-500 dark:text-red-400" : "text-slate-700 dark:text-white/80"}`}>
                      {formatDate(assignment.dueAt)}
                    </p>
                  </div>
                )}
                {points != null && (
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide">Points</span>
                    <p className="mt-0.5 text-sm font-bold text-slate-700 dark:text-white/80">{points}</p>
                  </div>
                )}
                {allowedTypes.length > 0 && (
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide">Allowed Types</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-600 dark:text-white/65">{allowedTypes.join(", ")}</p>
                  </div>
                )}
                {maxSizeMB && (
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wide">Max Size</span>
                    <p className="mt-0.5 text-sm font-semibold text-slate-600 dark:text-white/65">{maxSizeMB} MB</p>
                  </div>
                )}
              </div>

              {/* Assignment PDF / Attached resource */}
              {(assignment.url || assignment.pdfUrl) && (
                <a
                  href={assignment.url || assignment.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] p-4 mb-5 transition-colors group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white/85">Assignment PDF</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">Click to view or download</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 shrink-0">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}

              {/* Description */}
              {assignment.description && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-white/40 mb-1.5">Description</h4>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">
                    {assignment.description}
                  </p>
                </div>
              )}

              {/* ── Not submission required ── */}
              {!submissionRequired && (
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 dark:bg-sky-400/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 dark:text-sky-400">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white/80">No submission required</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-white/40">This assignment is for reference only.</p>
                </div>
              )}

              {/* ── Existing submission ── */}
              {submissionRequired && existingSub && !showUpload && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-400/10 bg-emerald-50/50 dark:bg-emerald-400/[0.04] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Submitted</span>
                      <span className="text-xs text-emerald-600/70 dark:text-emerald-400/50 ml-auto">
                        {formatDate(existingSub.submittedAt)}
                      </span>
                    </div>

                    {/* Files */}
                    <div className="space-y-1.5 mb-2">
                      {(existingSub.files || []).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/[0.04] px-3 py-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/30 shrink-0">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="text-xs font-semibold text-slate-700 dark:text-white/75 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-white/25 shrink-0">{formatBytes(f.size)}</span>
                        </div>
                      ))}
                    </div>

                    {existingSub.note && (
                      <p className="text-xs text-slate-600 dark:text-white/50 italic">"{existingSub.note}"</p>
                    )}
                  </div>

                  {canResubmit && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setShowUpload(true); setFiles([]); setNote(""); setErrors([]); }}
                      className="w-full rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2.5 text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors cursor-pointer"
                    >
                      Resubmit
                    </motion.button>
                  )}

                  {existingSub && !allowResubmission && (
                    <p className="text-center text-xs text-slate-400 dark:text-white/30">Resubmission is not allowed for this assignment.</p>
                  )}
                </div>
              )}

              {/* ── Upload UI ── */}
              {submissionRequired && showUpload && (
                <div className="space-y-4">
                  {/* Drag & drop area */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors duration-200 ${
                      dragOver
                        ? "border-indigo-400 bg-indigo-50/50 dark:border-indigo-400/40 dark:bg-indigo-400/[0.04]"
                        : "border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/30">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-white/65">
                      Drag & drop files here
                    </p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-white/30">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 rounded-xl bg-indigo-500 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                    >
                      Choose file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      accept={allowedTypes.length > 0 ? allowedTypes.map((t) => "." + t).join(",") : undefined}
                      onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ""; }}
                    />
                  </div>

                  {/* Selected file chips */}
                  {files.length > 0 && (
                    <div className="space-y-1.5">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02] px-3 py-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400 shrink-0">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="flex-1 text-xs font-semibold text-slate-700 dark:text-white/75 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-white/25 shrink-0">{formatBytes(f.size)}</span>
                          <button
                            onClick={() => removeFile(i)}
                            className="shrink-0 flex h-5 w-5 items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-400/10 transition-colors cursor-pointer"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-red-500 dark:text-white/30 dark:hover:text-red-400">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Note textarea */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-white/40">Note (optional)</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Any comments for your instructor..."
                      className={inputClass + " mt-1.5"}
                    />
                  </div>

                  {/* Errors */}
                  {errors.length > 0 && (
                    <div className="rounded-xl border border-red-200 dark:border-red-400/20 bg-red-50 dark:bg-red-400/[0.06] p-3 space-y-1">
                      {errors.map((err, i) => (
                        <p key={i} className="text-xs font-semibold text-red-600 dark:text-red-400">{err}</p>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {existingSub && (
                      <button
                        onClick={() => { setShowUpload(false); setFiles([]); setErrors([]); }}
                        className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      disabled={files.length === 0 || submitting}
                      onClick={handleSubmit}
                      className="flex-1 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {submitting ? "Submitting..." : existingSub ? "Resubmit" : "Submit"}
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
