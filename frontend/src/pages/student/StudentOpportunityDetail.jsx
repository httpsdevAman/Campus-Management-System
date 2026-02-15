import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  getOpportunityById,
  applyToOpportunity,
} from "../../services/opportunityService";
import { TypePill } from "../../components/opportunities/StatusPill";
import { formatDate, formatDateTime } from "../../utils/date";

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="h-7 w-72 rounded bg-slate-200 dark:bg-white/10" />
    <div className="h-4 w-48 rounded bg-slate-200 dark:bg-white/10" />
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-40" />
      </div>
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 h-56" />
    </div>
  </div>
);

export default function StudentOpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [opp, setOpp] = useState(null);
  const [note, setNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getOpportunityById(id);
        if (mounted) {
          setOpp(data);
          const myApp = data.applications?.find(
            (a) =>
              String(a.student?.id) === String(user?.id) ||
              String(a.student?.id) === String(user?._id)
          );
          setApplied(!!myApp);
        }
      } catch {
        if (mounted) setOpp(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => (mounted = false);
  }, [id, user.id]);

  async function submitApplication() {
    if (applied) return;
    setApplying(true);
    const updated = await applyToOpportunity({
      id,
      student: { id: user.id, name: user.name, email: user.email },
      note,
    });
    setOpp(updated);
    setApplied(true);
    setNote("");
    setApplying(false);
  }

  if (loading) return <DetailSkeleton />;

  if (!opp) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-slate-700 dark:text-white/80">
          Opportunity not found
        </p>
        <button
          onClick={() => navigate("/student/opportunities")}
          className="mt-3 text-sm text-indigo-500 hover:underline cursor-pointer"
        >
          Back to opportunities
        </button>
      </div>
    );
  }

  const daysLeft = Math.max(0, Math.ceil((new Date(opp.deadline) - Date.now()) / 86400000));
  const expired = daysLeft === 0;

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
            <span>By {opp.postedBy?.name}</span>
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
          </div>
        </div>
        <button
          onClick={() => navigate("/student/opportunities")}
          className="rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Description */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-white/90">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/65 whitespace-pre-wrap">
              {opp.description}
            </p>
          </div>

          {/* Requirements */}
          {opp.requirements?.length > 0 && (
            <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
              <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">
                Requirements
              </h3>
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

          {/* Apply form */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            {applied ? (() => {
              const myApp = opp.applications?.find(
                (a) =>
                  String(a.student?.id) === String(user?.id) ||
                  String(a.student?.id) === String(user?._id)
              );
              const status = myApp?.status || "SUBMITTED";
              return (
                <div className="flex items-center gap-3 py-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    status === "ACCEPTED"
                      ? "bg-emerald-500/10 dark:bg-emerald-400/10"
                      : status === "REJECTED"
                        ? "bg-rose-500/10 dark:bg-rose-400/10"
                        : "bg-indigo-500/10 dark:bg-indigo-400/10"
                  }`}>
                    {status === "ACCEPTED" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 dark:text-emerald-400">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : status === "REJECTED" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 dark:text-rose-400">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500 dark:text-indigo-400">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      status === "ACCEPTED"
                        ? "text-emerald-600 dark:text-emerald-300"
                        : status === "REJECTED"
                          ? "text-rose-600 dark:text-rose-300"
                          : "text-indigo-600 dark:text-indigo-300"
                    }`}>
                      {status === "ACCEPTED"
                        ? "Application accepted"
                        : status === "REJECTED"
                          ? "Application rejected"
                          : "Application submitted"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-white/30">
                      {status === "ACCEPTED"
                        ? "Congratulations! The faculty has accepted your application."
                        : status === "REJECTED"
                          ? "Unfortunately, your application was not selected."
                          : "Your application is under review."}
                    </p>
                  </div>
                </div>
              );
            })() : expired ? (
              <div className="py-2">
                <p className="text-sm font-semibold text-slate-500 dark:text-white/50">
                  Applications closed
                </p>
                <p className="text-xs text-slate-400 dark:text-white/30">
                  The deadline for this opportunity has passed.
                </p>
              </div>
            ) : (
              <>
                <h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-white/90">
                  Apply
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200/60 dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.03] px-4 py-2.5 text-sm text-slate-800 dark:text-white/85 placeholder:text-slate-400 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-indigo-400/30 transition-colors duration-200"
                  placeholder="Why are you a good fit? Mention relevant experience..."
                />
                <div className="mt-3">
                  <motion.button
                    onClick={submitApplication}
                    disabled={applying}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {applying ? "Submitting..." : "Submit Application"}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-5 transition-colors duration-300">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 dark:text-white/90">
              Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-white/40">Type</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {opp.type}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Location</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {opp.location || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Stipend / Prize</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {opp.stipend || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Deadline</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">
                  {formatDate(opp.deadline)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Posted by</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {opp.postedBy?.name}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Posted</dt>
                <dd className="mt-0.5 text-slate-700 dark:text-white/70">
                  {formatDateTime(opp.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-white/40">Applications</dt>
                <dd className="mt-0.5 font-medium text-slate-800 dark:text-white/85">
                  {opp.applications.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
