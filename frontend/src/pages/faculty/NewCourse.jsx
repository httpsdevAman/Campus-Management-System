import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { createCourse } from "../../services/courseService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function NewCourse() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("Spring 2026");
  const [department, setDepartment] = useState("CSE");
  const [credits, setCredits] = useState(4);
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("Core, Systems");
  const [days, setDays] = useState(["Mon", "Wed"]);
  const [time, setTime] = useState("10:00-11:00");
  const [room, setRoom] = useState("A-101");
  const [saving, setSaving] = useState(false);

  const instructor = useMemo(() => ({ id: user.id, name: user.name, email: user.email }), [user]);

  async function submit() {
    if (!code.trim() || !title.trim()) return;
    setSaving(true);
    const created = await createCourse({
      code,
      title,
      semester,
      department,
      credits,
      instructor,
      description: desc,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      schedule: { days, time, room },
      enrolledStudentIds: [],
    });
    setSaving(false);
    navigate(`/faculty/courses/${created.id}`);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Course</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-white/40">Set up course basics, then add materials and assignments.</p>
        </div>
        <button
          onClick={() => navigate("/faculty/courses")}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03]
            px-4 py-2 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition"
        >
          Back
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur p-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Course code (e.g., CS301)"
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
              px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Course title"
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
              px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Semester"
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
              px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Department"
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
              px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(Number(e.target.value))}
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
              px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
          />
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 dark:text-white/40 mb-2">Schedule</div>
          <div className="grid gap-3 md:grid-cols-3">
            <select
              multiple
              value={days}
              onChange={(e) => setDays(Array.from(e.target.selectedOptions).map((o) => o.value))}
              className="h-28 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
                px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
            >
              {DAYS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Time (e.g., 10:00-11:00)"
              className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
                px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
            />
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Room"
              className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
                px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-white/35">
            Tip: hold Ctrl/Cmd to select multiple days.
          </p>
        </div>

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          placeholder="Course description..."
          className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03]
            px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30"
        />

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={saving}
            onClick={submit}
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60 transition"
          >
            {saving ? "Creating..." : "Create Course"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
