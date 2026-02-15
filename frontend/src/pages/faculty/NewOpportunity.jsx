import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { createOpportunity } from "../../services/opportunityService";

export default function NewOpportunity() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Internship");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState(["", "", ""]);
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [stipend, setStipend] = useState("");
  const [loading, setLoading] = useState(false);

  function updateReq(index, value) {
    setRequirements((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addReqField() {
    if (requirements.length < 8) setRequirements((prev) => [...prev, ""]);
  }

  function removeReqField(index) {
    if (requirements.length > 1) setRequirements((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline) return;

    setLoading(true);
    const opp = await createOpportunity({
      title,
      type,
      description,
      requirements: requirements.filter((r) => r.trim()),
      deadline: new Date(deadline).toISOString(),
      location,
      stipend,
      postedBy: user,
    });
    setLoading(false);
    navigate(`/faculty/opportunities/${opp.id}`);
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
          Post Opportunity
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-white/40">
          New postings require approval before they're visible to students.
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
              placeholder="e.g., ML Research Internship"
              required
            />
          </div>

          {/* Type + Deadline */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectClass}
              >
                <option className={optClass}>Internship</option>
                <option className={optClass}>Project</option>
                <option className={optClass}>Hackathon</option>
                <option className={optClass}>Scholarship</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`${inputClass} dark:color-scheme-dark`}
                style={{ colorScheme: "auto" }}
                required
              />
            </div>
          </div>

          {/* Location + Stipend */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
                placeholder="e.g., On-campus / Remote / Hybrid"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-white/70">
                Stipend / Prize
              </label>
              <input
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                className={inputClass}
                placeholder="e.g., ₹15,000/month"
              />
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
              rows={5}
              className={inputClass}
              placeholder="Describe the opportunity, what students will do, expected outcomes..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-white/70">
              Requirements
            </label>
            <div className="mt-2 space-y-2">
              {requirements.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={r}
                    onChange={(e) => updateReq(i, e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200"
                    placeholder={`Requirement ${i + 1}`}
                  />
                  {requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReqField(i)}
                      className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-3 py-2 text-sm text-slate-400 dark:text-white/30 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-500/20 transition-colors cursor-pointer"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {requirements.length < 8 && (
              <button
                type="button"
                onClick={addReqField}
                className="mt-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                + Add requirement
              </button>
            )}
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
              {loading ? "Posting..." : "Post Opportunity"}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate("/faculty/opportunities")}
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
