import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  getCourseById,
  renameSection,
  deleteSection,
  addMaterial,
  addAssignment,
  updateSectionItem,
  deleteSectionItem,
} from "../../services/courseService";
import CourseTabs from "../../components/courses/CourseTabs";
import CourseAccordion from "../../components/courses/CourseAccordion";
import CourseChips from "../../components/courses/CourseChips";
import {
  RenameSectionModal,
  DeleteSectionModal,
  MaterialModal,
} from "../../components/courses/SectionEditorModal";
import { formatDate } from "../../utils/date";

/* ── Skeleton ── */
const Skeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-8 w-80 rounded bg-slate-200 dark:bg-white/10" />
    <div className="flex gap-2">
      <div className="h-5 w-16 rounded-lg bg-slate-200 dark:bg-white/10" />
      <div className="h-5 w-20 rounded-lg bg-slate-200 dark:bg-white/10" />
    </div>
    <div className="h-10 w-full rounded-2xl bg-slate-200 dark:bg-white/10" />
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-32" />
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-20" />
    </div>
  </div>
);

/* ── Participants Tab ── */
function ParticipantsTab({ participants = [] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return participants;
    const lower = q.toLowerCase();
    return participants.filter(
      (p) => p.name?.toLowerCase().includes(lower) || p.email?.toLowerCase().includes(lower)
    );
  }, [participants, q]);

  const rolePill = (role) => {
    const colors = {
      Faculty: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
      TA: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
      Student: "bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/60",
    };
    return colors[role] || colors.Student;
  };

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search participants..."
        className="mb-4 w-full md:max-w-sm rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors"
      />
      {filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500 dark:text-white/40">No participants found.</p>
      ) : (
        <>
          <div className="hidden md:block rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-white/[0.06]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-white/40">Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0 border-slate-200/40 dark:border-white/[0.04]">
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white/85">{p.name}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-white/45 font-mono text-xs">{p.displayId || p.id}</td>
                    <td className="px-5 py-3 text-slate-500 dark:text-white/45">{p.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${rolePill(p.role)}`}>{p.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{p.name}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40 font-mono">{p.displayId || p.id}</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">{p.email}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${rolePill(p.role)}`}>{p.role}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Grades Tab ── */
function GradesTab() {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
      </div>
      <p className="text-lg font-semibold text-slate-800 dark:text-white/85">Grade management coming soon</p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm text-slate-500 dark:text-white/40">You will be able to publish and manage grades here.</p>
    </div>
  );
}

/* ── Competencies Tab ── */
function CompetenciesTab({ tags = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5">
      <h4 className="text-sm font-semibold text-slate-800 dark:text-white/90 mb-3">Course Tags & Competencies</h4>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-white/[0.06] dark:text-white/60">{t}</span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-white/40">No competencies defined yet.</p>
      )}
    </div>
  );
}

/* ── More Tab ── */
function MoreTab({ course }) {
  const items = [
    { label: "Syllabus", desc: "View course syllabus", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" },
    { label: "Policies", desc: "Attendance, grading, and academic integrity", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { label: "Course Settings", desc: "Edit course metadata", icon: "M12 20V10M18 20V4M6 20v-4" },
  ];

  return (
    <div className="space-y-2">
      {items.map((a) => (
        <div key={a.label} className="flex items-center gap-3.5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-4 hover:bg-white/80 dark:hover:bg-white/[0.035] transition-colors cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-500 dark:text-white/40 shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{a.label}</p>
            <p className="text-xs text-slate-500 dark:text-white/40">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ── */
export default function FacultyCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState("course");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  /* modal state */
  const [renamingSection, setRenamingSection] = useState(null);
  const [deletingSectionId, setDeletingSectionId] = useState(null);
  const [addingItemSectionId, setAddingItemSectionId] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // { item, sectionId }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getCourseById(id, user.role);
        const ok = data.instructor?.id === user.id;
        if (!ok) throw new Error("Forbidden");
        if (mounted) setCourse(data);
      } catch {
        if (mounted) setCourse(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id, user.id]);

  function copyCode() {
    if (!course) return;
    navigator.clipboard?.writeText(course.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const [sectionError, setSectionError] = useState(null);

  /* ── Section CRUD (only for custom sections; Resources/Assignments are fixed) ── */
  async function handleRenameSection(newName) {
    if (!renamingSection) return;
    setSectionError(null);
    setSaving(true);
    try {
      const updated = await renameSection({ courseId: id, sectionId: renamingSection, newName });
      setCourse(updated);
      setRenamingSection(null);
    } catch (e) {
      setSectionError(e?.message || "Action not supported");
    }
    setSaving(false);
  }

  async function handleDeleteSection() {
    if (!deletingSectionId) return;
    setSectionError(null);
    setSaving(true);
    try {
      const updated = await deleteSection({ courseId: id, sectionId: deletingSectionId, by: user });
      setCourse(updated);
      setDeletingSectionId(null);
    } catch (e) {
      setSectionError(e?.message || "Action not supported");
    }
    setSaving(false);
  }

  /* ── Item CRUD (Resource/Assignment upload via backend) ── */
  async function handleAddItem(item) {
    if (!addingItemSectionId) return;
    setSectionError(null);
    setSaving(true);
    try {
      let updated;
      if (addingItemSectionId === "sec-resources") {
        if (!item.file) {
          setSectionError("Please attach a file (PDF or ZIP) to upload.");
          setSaving(false);
          return;
        }
        updated = await addMaterial({
          courseId: id,
          material: {
            title: item.title,
            description: item.description,
            file: item.file,
          },
        });
      } else if (addingItemSectionId === "sec-assignments") {
        if (!item.file) {
          setSectionError("Please attach a PDF file for the assignment.");
          setSaving(false);
          return;
        }
        updated = await addAssignment({
          courseId: id,
          assignment: {
            title: item.title,
            description: item.description,
            dueAt: item.meta?.dueAt,
            file: item.file,
          },
        });
      } else {
        setSectionError("Use Resources or Assignments section to add content.");
        setSaving(false);
        return;
      }
      setCourse(updated);
      setAddingItemSectionId(null);
    } catch (e) {
      setSectionError(e?.message || "Failed to upload. Please try again.");
    }
    setSaving(false);
  }

  function handleItemClick(item, sectionId) {
    setEditingItem({ item, sectionId });
  }

  async function handleEditItem(patch) {
    if (!editingItem) return;
    setSectionError(null);
    setSaving(true);
    try {
      const updated = await updateSectionItem({
        courseId: id,
        sectionId: editingItem.sectionId,
        itemId: editingItem.item.id,
        patch,
        by: user,
      });
      setCourse(updated);
      setEditingItem(null);
    } catch (e) {
      setSectionError(e?.message || "Action not supported");
    }
    setSaving(false);
  }

  async function handleDeleteItem() {
    if (!editingItem) return;
    setSectionError(null);
    setSaving(true);
    try {
      const updated = await deleteSectionItem({
        courseId: id,
        sectionId: editingItem.sectionId,
        itemId: editingItem.item.id,
        by: user,
      });
      setCourse(updated);
      setEditingItem(null);
    } catch (e) {
      setSectionError(e?.message || "Action not supported");
    }
    setSaving(false);
  }

  async function handleDuplicateItem() {
    if (!editingItem) return;
    const src = editingItem.item;
    const dup = {
      kind: src.kind,
      title: src.title + " (Copy)",
      description: src.description || "",
      url: src.url || "",
      attachment: src.attachment || null,
      published: src.published,
      tags: [...(src.tags || [])],
    };
    if (src.kind === "ASSIGNMENT" && src.meta) {
      dup.meta = { ...src.meta };
    }
    setSectionError(null);
    setSaving(true);
    try {
      const updated = await addSectionItem({ courseId: id, sectionId: editingItem.sectionId, item: dup, by: user });
      setCourse(updated);
      setEditingItem(null);
    } catch (e) {
      setSectionError(e?.message || "Action not supported");
    }
    setSaving(false);
  }

  if (loading) return <Skeleton />;

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">Course not found / not accessible</p>
        <button onClick={() => navigate("/faculty/courses")} className="mt-3 text-sm text-indigo-500 hover:underline cursor-pointer">Back to courses</button>
      </div>
    );
  }

  const chips = [course.department, course.semester, course.type, `${course.credits} cr`].filter(Boolean);
  const renamingSec = (course.sections || []).find((s) => s.id === renamingSection);
  const deletingSec = (course.sections || []).find((s) => s.id === deletingSectionId);
  const addingSec = (course.sections || []).find((s) => s.id === addingItemSectionId);
  const editingSec = editingItem ? (course.sections || []).find((s) => s.id === editingItem.sectionId) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate("/faculty/courses")}
              className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-white/40 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
              Back to Courses
            </button>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              <span className="text-slate-400 dark:text-white/30">{course.code}</span>
              <span className="mx-2 text-slate-300 dark:text-white/15">&mdash;</span>
              {course.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-white/55">{(course.enrolledStudentIds || []).length} enrolled</span>
              <span className="text-slate-300 dark:text-white/15">|</span>
              <CourseChips items={chips} />
            </div>
          </div>

          <button
            onClick={copyCode}
            title="Copy course code"
            className="shrink-0 flex items-center gap-1.5 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            {copied ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>Copied</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>{course.code}</>
            )}
          </button>
        </div>
      </div>

      {sectionError && (
        <div className="mb-4 rounded-xl border border-amber-200/60 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {sectionError}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <CourseTabs active={tab} onChange={setTab} />
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {tab === "course" && (
            <div className="space-y-5">
              {/* Overview */}
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Overview</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">{course.description || "No description provided."}</p>
                  </div>
                  <div className="hidden lg:block shrink-0 w-48 space-y-2 text-xs">
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Schedule</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{(course.schedule?.days || []).join(", ")} <span className="text-slate-400 dark:text-white/30">{course.schedule?.time}</span></p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Room</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.room || "TBA"}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3">
                      <span className="text-slate-400 dark:text-white/30">Updated</span>
                      <p className="font-semibold text-slate-700 dark:text-white/70">{formatDate(course.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                <div className="lg:hidden mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Days</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{(course.schedule?.days || []).join(", ")}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Time</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.time || "—"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-white/[0.03] p-3 text-center">
                    <span className="text-slate-400 dark:text-white/30">Room</span>
                    <p className="font-semibold text-slate-700 dark:text-white/70">{course.schedule?.room || "TBA"}</p>
                  </div>
                </div>
              </div>

              {/* Accordion */}
              <CourseAccordion
                sections={course.sections || []}
                editable
                onRename={(secId) => setRenamingSection(secId)}
                onAddItem={(secId) => setAddingItemSectionId(secId)}
                onDeleteSection={(secId) => setDeletingSectionId(secId)}
                onItemClick={handleItemClick}
              />
            </div>
          )}
          {tab === "participants" && <ParticipantsTab participants={course.participants || []} />}
          {tab === "grades" && <GradesTab />}
          {tab === "competencies" && <CompetenciesTab tags={course.tags} />}
          {tab === "more" && <MoreTab course={course} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ── */}

      {/* Rename Section */}
      {renamingSec && (
        <RenameSectionModal
          currentName={renamingSec.name}
          onClose={() => setRenamingSection(null)}
          onSave={handleRenameSection}
          saving={saving}
        />
      )}

      {/* Delete Section */}
      {deletingSec && (
        <DeleteSectionModal
          sectionName={deletingSec.name}
          itemCount={(deletingSec.items || []).length}
          onClose={() => setDeletingSectionId(null)}
          onConfirm={handleDeleteSection}
          saving={saving}
        />
      )}

      {/* Add Material / Assignment (unified modal in create mode) */}
      {addingSec && !editingItem && (
        <MaterialModal
          sectionName={addingSec.name}
          sectionId={addingSec.id}
          onClose={() => setAddingItemSectionId(null)}
          onSave={handleAddItem}
          saving={saving}
        />
      )}

      {/* Edit Material (unified modal in edit mode) */}
      {editingItem && editingSec && (
        <MaterialModal
          sectionName={editingSec.name}
          editingItem={editingItem.item}
          onClose={() => setEditingItem(null)}
          onSave={handleEditItem}
          onDelete={handleDeleteItem}
          onDuplicate={handleDuplicateItem}
          saving={saving}
        />
      )}
    </motion.div>
  );
}
