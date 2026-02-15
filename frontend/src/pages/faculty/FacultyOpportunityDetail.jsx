import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  getOpportunityById,
  updateOpportunity,
  updateApplicationStatus,
} from "../../services/opportunityService";
import { TypePill } from "../../components/opportunities/StatusPill";
import { formatDate, formatDateTime } from "../../utils/date";

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-7 w-80 rounded bg-slate-200 dark:bg-white/10" />
    <div className="h-4 w-56 rounded bg-slate-200 dark:bg-white/10" />
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-44" />
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-48" />
      </div>
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-64" />
      </div>
    </div>
  </div>
);

export default function FacultyOpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [opp, setOpp] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  /* edit form state */
  const [eTitle, setETitle] = useState("");
  const [eType, setEType] = useState("Internship");
  const [eDesc, setEDesc] = useState("");
  const [eReqs, setEReqs] = useState([""]);
  const [eDeadline, setEDeadline] = useState("");
  const [eLocation, setELocation] = useState("");
  const [eStipend, setEStipend] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getOpportunityById(id);
        if (mounted) setOpp(data);
      } catch {
        if (mounted) setOpp(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id]);

  const daysLeft = useMemo(() => {
    if (!opp?.deadline) return 0;
    return Math.max(0, Math.ceil((new Date(opp.deadline) - Date.now()) / 86400000));
  }, [opp]);

  const expired = !!opp && daysLeft === 0;

  function startEditing() {
    if (!opp) return;
    setETitle(opp.title);
    setEType(opp.type);
    setEDesc(opp.description);
    setEReqs(opp.requirements?.length ? [...opp.requirements] : [""]);
    setEDeadline(opp.deadline ? new Date(opp.deadline).toISOString().split("T")[0] : "");
    setELocation(opp.location || "");
    setEStipend(opp.stipend || "");
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function updateReq(index, value) {
    setEReqs((prev) => prev.map((r, i) => (i === index ? value : r)));
  }

  function addReqField() {
    if (eReqs.length < 8) setEReqs((prev) => [...prev, ""]);
  }

  function removeReqField(index) {
    if (eReqs.length > 1) setEReqs((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveEdits() {
    if (!eTitle.trim() || !eDesc.trim() || !eDeadline) return;
    setSaving(true);
    const updated = await updateOpportunity({
      id,
      title: eTitle,
      type: eType,
      description: eDesc,
      requirements: eReqs,
      deadline: new Date(eDeadline).toISOString(),
      location: eLocation,
      stipend: eStipend,
    });
    setOpp(updated);
    setEditing(false);
    setSaving(false);
  }

  async function handleStatusChange(appId, status) {
    const updated = await updateApplicationStatus({ oppId: id, appId, status });
    setOpp(updated);
  }

  if (loading) return <DetailSkeleton />;

  if (!opp) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">
          Opportunity not found
        </p>
        <button
          onClick={() => navigate("/faculty/opportunities")}
          className="mt-3 text-sm text-indigo-500 hover:underline cursor-pointer"
        >
          Back to opportunities
        </button>
      </div>
    );
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
    >
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {opp.title}
            </h1>
            <TypePill type={opp.type} />
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-white/40">
            <span className="font-mono text-xs">{opp.id}</span>
            <span>·</span>
            <span className="text-xs">
              Deadline {formatDate(opp.deadline)}
              {!expired && (
                <span className={`ml-1 font-semibold ${daysLeft <= 3 ? "text-rose-500 dark:text-rose-400" : daysLeft <= 7 ? "text-amber-500 dark:text-amber-400" : ""}`}>
                  ({daysLeft}d left)
                </span>
              )}
              {expired && <span className="ml-1 text-slate-400 dark:text-white/25">(closed)</span>}
            </span>
            <span>·</span>
            <span className="text-xs">{opp.applications.length} application{opp.applications.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startEditing}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              Edit
            </motion.button>
          )}
          <button
            onClick={() => navigate("/faculty/opportunities")}
            className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {editing ? (
            /* ── Edit form ── */
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-6 transition-colors duration-300">
              <h3 className="mb-4 text-sm font-semibold text-slate-800 dark:text-white/90">
                Edit Opportunity
              </h3>
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-white/70">Title</label>
                  <input value={eTitle} onChange={(e) => setETitle(e.target.value)} className={inputClass} required />
                </div>

                {/* Type + Deadline */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-white/70">Type</label>
                    <select value={eType} onChange={(e) => setEType(e.target.value)} className={selectClass}>
                      <option className={optClass}>Internship</option>
                      <option className={optClass}>Project</option>
                      <option className={optClass}>Hackathon</option>
                      <option className={optClass}>Scholarship</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-white/70">Deadline</label>
                    <input type="date" value={eDeadline} onChange={(e) => setEDeadline(e.target.value)} className={inputClass} style={{ colorScheme: "auto" }} required />
                  </div>
                </div>

                {/* Location + Stipend */}
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-white/70">Location</label>
                    <input value={eLocation} onChange={(e) => setELocation(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-white/70">Stipend / Prize</label>
                    <input value={eStipend} onChange={(e) => setEStipend(e.target.value)} className={inputClass} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-white/70">Description</label>
                  <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} rows={5} className={inputClass} required />
                </div>

                {/* Requirements */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-white/70">Requirements</label>
                  <div className="mt-2 space-y-2">
                    {eReqs.map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={r}
                          onChange={(e) => updateReq(i, e.target.value)}
                          className="flex-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] px-4 py-2 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200"
                          placeholder={`Requirement ${i + 1}`}
                        />
                        {eReqs.length > 1 && (
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
                  {eReqs.length < 8 && (
                    <button type="button" onClick={addReqField} className="mt-2 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:underline cursor-pointer">
                      + Add requirement
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <motion.button
                    onClick={saveEdits}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </motion.button>
                  <button
                    onClick={cancelEditing}
                    className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ── Read-only view ── */
            <>
              {/* Description */}
              <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
                <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-white/90">Description</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">{opp.description}</p>
              </div>

              {/* Requirements */}
              {opp.requirements?.length > 0 && (
                <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">Requirements</h3>
                  <ul className="space-y-2">
                    {opp.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-white/65">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500/50 dark:bg-indigo-400/40 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Applications (always visible) */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <div className="mb-3 flex items-center gap-2.5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Applications</h3>
              {opp.applications.length > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/40">
                  {opp.applications.length}
                </span>
              )}
            </div>
            {opp.applications.length === 0 ? (
              <div className="py-2">
                <p className="text-sm text-slate-500 dark:text-white/50">No applications yet.</p>
                <p className="text-xs text-slate-400 dark:text-white/30">Applications will appear here when students apply.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {opp.applications.map((a) => (
                  <div key={a.id} className={`rounded-xl border p-4 transition-colors duration-200 ${
                    a.status === "ACCEPTED"
                      ? "border-emerald-200/60 dark:border-emerald-500/15 bg-emerald-50/40 dark:bg-emerald-500/[0.03]"
                      : a.status === "REJECTED"
                        ? "border-rose-200/60 dark:border-rose-500/15 bg-rose-50/40 dark:bg-rose-500/[0.03]"
                        : "border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03]"
                  }`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white/85">{a.student?.name}</p>
                          <p className="text-xs text-slate-500 dark:text-white/40">{a.student?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          a.status === "ACCEPTED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                            : a.status === "REJECTED"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"
                              : "bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-white/40"
                        }`}>
                          {a.status || "SUBMITTED"}
                        </span>
                      </div>
                    </div>
                    {a.note && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-white/65 whitespace-pre-wrap">{a.note}</p>
                    )}
                    <div className="mt-2.5 flex items-center justify-between">
                      <p className="text-xs text-slate-400 dark:text-white/30">Applied {formatDateTime(a.at)}</p>
                      <div className="flex items-center gap-1.5">
                        {a.status !== "ACCEPTED" && (
                          <button
                            onClick={() => handleStatusChange(a.id, "ACCEPTED")}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 hover:bg-emerald-100 dark:hover:bg-emerald-400/20 transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {a.status !== "REJECTED" && (
                          <button
                            onClick={() => handleStatusChange(a.id, "REJECTED")}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 hover:bg-rose-100 dark:hover:bg-rose-400/20 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        {a.status !== "SUBMITTED" && (
                          <button
                            onClick={() => handleStatusChange(a.id, "SUBMITTED")}
                            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:text-white/50 bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-colors cursor-pointer"
                          >
                            Revert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">Details</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-white/40">Type</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">{opp.type}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Location</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">{opp.location || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Stipend / Prize</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">{opp.stipend || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Deadline</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">{formatDate(opp.deadline)}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Posted</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">{formatDateTime(opp.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Last updated</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">{formatDateTime(opp.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
