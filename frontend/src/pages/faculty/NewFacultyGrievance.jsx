import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { createGrievance } from "../../services/grievanceService";

export default function NewFacultyGrievance() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Infrastructure");
  const [priority, setPriority] = useState("MEDIUM");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    const g = await createGrievance({
      title,
      category,
      description,
      priority,
      createdBy: user,
    });
    setLoading(false);
    navigate(`/faculty/grievances/${g.id}`);
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

  const selectClass =
    "mt-2 w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-[#161625] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200";

  const optClass = "bg-white dark:bg-[#161625] dark:text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create Grievance
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
          Provide clear details to speed up resolution.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-6 transition-colors duration-300"
      >
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-white/70">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g., Projector malfunction in lecture hall"
              required
            />
          </div>

          {/* Category + Priority */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option className={optClass}>Infrastructure</option>
                <option className={optClass}>IT</option>
                <option className={optClass}>Academic</option>
                <option className={optClass}>Hostel</option>
                <option className={optClass}>Mess</option>
                <option className={optClass}>Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={selectClass}
              >
                <option value="LOW" className={optClass}>Low</option>
                <option value="MEDIUM" className={optClass}>Medium</option>
                <option value="HIGH" className={optClass}>High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-white/70">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className={inputClass}
              placeholder="Write the issue clearly with relevant context..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-1">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {loading ? "Submitting..." : "Submit Grievance"}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate("/faculty/grievances")}
              className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
