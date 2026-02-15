import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  assignInstructor,
  enrollStudent,
  getCourseById,
  listFacultyUsers,
  listStudentUsers,
  unenrollStudent,
} from "../../services/courseService";
import MaterialList from "../../components/courses/MaterialList";
import AssignmentList from "../../components/courses/AssignmentList";
import TagPill from "../../components/courses/TagPill";
import { formatDateTime } from "../../utils/date";

const Skeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-7 w-72 rounded bg-slate-200 dark:bg-white/10" />
    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-white/10" />
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-44" />
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-56" />
      </div>
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-64" />
    </div>
  </div>
);

export default function AdminCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [facultyUsers, setFacultyUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);

  const [facultyId, setFacultyId] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [courseData, faculties, students] = await Promise.all([
          getCourseById(id, user?.role || "admin"),
          listFacultyUsers(),
          listStudentUsers(),
        ]);
        if (mounted) {
          setCourse(courseData);
          setFacultyId(courseData.instructor?.id || "");
          setFacultyUsers(faculties);
          setStudentUsers(students);
        }
      } catch (e) {
        if (mounted) {
          setCourse(null);
          setError(e?.message || "Failed to load");
        }
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id, user?.role]);

  async function saveInstructor() {
    setError(null);
    setSaving(true);
    try {
      const f = facultyUsers.find((x) => x.id === facultyId) || null;
      const updated = await assignInstructor({ courseId: course.id, facultyUser: f, by: { id: "ADMIN", name: "Admin", role: "ADMIN" } });
      setCourse(updated);
    } catch (e) {
      setError(e?.message || "Failed to save instructor");
    }
    setSaving(false);
  }

  async function addStudent() {
    if (!studentId) return;
    setError(null);
    setSaving(true);
    try {
      const s = studentUsers.find((x) => x.id === studentId);
      const updated = await enrollStudent({ courseId: course.id, studentUser: s, by: { id: "ADMIN", name: "Admin", role: "ADMIN" } });
      setCourse(updated);
      setStudentId("");
    } catch (e) {
      setError(e?.message || "Failed to enroll student");
    }
    setSaving(false);
  }

  async function removeStudent(sid) {
    setError(null);
    setSaving(true);
    try {
      await unenrollStudent({ courseId: course.id, studentId: sid, by: { id: "ADMIN", name: "Admin", role: "ADMIN" } });
      setCourse(await getCourseById(id, user?.role || "admin"));
    } catch (e) {
      setError(e?.message || "Failed to remove student");
    }
    setSaving(false);
  }

  if (loading) return <Skeleton />;

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">{error || "Course not found"}</p>
        <button onClick={() => navigate("/admin/courses")} className="mt-3 text-sm text-indigo-500 hover:underline">
          Back to courses
        </button>
      </div>
    );
  }

  const enrolled = (course.enrolledStudentIds || []).map((sid) => {
    const u = studentUsers.find((s) => s.id === sid || s._id === sid);
    return u ? { id: u.id || u._id, name: u.name, email: u.email || u.instituteEmail || "—" } : { id: sid, name: String(sid), email: "—" };
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-slate-500 dark:text-white/40">{course.code}</span>
            <span className="text-xs text-slate-400 dark:text-white/20">•</span>
            <span className="text-xs text-slate-500 dark:text-white/40">{course.semester}</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
            {course.department} • {course.credits} credits
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/courses")}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03]
            px-4 py-2 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition"
        >
          Back
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Overview</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">
              {course.description || "No description provided."}
            </p>
            {course.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((t) => (
                  <TagPill key={t} text={t} />
                ))}
              </div>
            )}
            {(saving && <div className="mt-3 text-xs text-slate-500 dark:text-white/40">Saving...</div>) ||
              (error && <div className="mt-3 text-xs text-rose-600 dark:text-rose-400">{error}</div>)}
          </div>

          <MaterialList items={course.materials || []} editable={false} />
          <AssignmentList items={course.assignments || []} editable={false} />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Instructor</h3>
            <div className="mt-3 flex flex-col gap-3">
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
                  px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="">Unassigned</option>
                {facultyUsers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <button
                onClick={saveInstructor}
                className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
              >
                Save Instructor
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/[0.06] text-xs text-slate-500 dark:text-white/40">
              Updated: {formatDateTime(course.updatedAt)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur p-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Enrollments</h3>

            <div className="mt-3 flex gap-2">
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
                  px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
              >
                <option value="">Select student</option>
                {studentUsers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addStudent}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {enrolled.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-white/40 py-3">No enrolled students yet.</div>
              ) : (
                enrolled.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 dark:border-white/[0.06]
                      bg-white/40 dark:bg-white/[0.03] px-4 py-3"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-white/85">{s.name}</div>
                      <div className="text-xs text-slate-500 dark:text-white/40">{s.email}</div>
                    </div>
                    <button
                      onClick={() => removeStudent(s.id)}
                      className="text-xs font-semibold text-rose-600 dark:text-rose-300 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
