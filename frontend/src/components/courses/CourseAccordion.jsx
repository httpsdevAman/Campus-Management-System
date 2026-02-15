import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionContentRenderer from "./SectionContentRenderer";

const TYPE_COLORS = {
  NOTES: "bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
  ASSIGNMENTS: "bg-amber-50 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
  RESOURCES: "bg-sky-50 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
  CUSTOM: "bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-300",
};

function ChevronIcon({ open }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 90 : 0 }}
      transition={{ duration: 0.2 }}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-slate-400 dark:text-white/30"
    >
      <polyline points="9 18 15 12 9 6" />
    </motion.svg>
  );
}

function AccordionSection({ section, isOpen, onToggle, editable, onRename, onAddItem, onDeleteSection, onItemClick, onAssignmentClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="flex w-full items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 min-w-0 items-center gap-3 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400/40 rounded-lg -m-1 p-1 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.015]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.05] shrink-0">
            <ChevronIcon open={isOpen} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800 dark:text-white/90 truncate">
                {section.name}
              </span>
              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${TYPE_COLORS[section.type] || TYPE_COLORS.CUSTOM}`}>
                {section.type}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-white/25 shrink-0">
            {section.items?.length || 0} item{(section.items?.length || 0) !== 1 ? "s" : ""}
          </span>
        </button>

        {/* Faculty kebab menu */}
        {editable && (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-200/60 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/30">
                <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-full mt-1 z-40 w-40 rounded-xl border border-slate-200/60 dark:border-white/[0.08] bg-white dark:bg-[#1a1a2e] shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); onAddItem?.(section.id); }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/[0.05] cursor-pointer"
                  >
                    {section.id === "sec-assignments" ? "Add assignment" : section.id === "sec-resources" ? "Add resource" : "Add material"}
                  </button>
                  {section.id !== "sec-resources" && section.id !== "sec-assignments" && (
                    <>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onRename?.(section.id); }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/[0.05] cursor-pointer"
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onDeleteSection?.(section.id); }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 cursor-pointer"
                      >
                        Delete section
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              <SectionContentRenderer
                items={section.items || []}
                editable={editable}
                onItemClick={editable && onItemClick ? (item) => onItemClick(item, section.id) : undefined}
                onAssignmentClick={onAssignmentClick ? (item) => onAssignmentClick(item, section.id) : undefined}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CourseAccordion({ sections = [], editable = false, onRename, onAddItem, onDeleteSection, onItemClick, onAssignmentClick }) {
  const [openId, setOpenId] = useState(sections[0]?.id || null);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function collapseAll() {
    setOpenId(null);
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 dark:text-white/25">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-white/60">No sections yet</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-white/30">
          {editable ? "Create a section to start adding materials." : "Course materials will appear here."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {sections.length > 1 && (
        <div className="mb-2 flex justify-end">
          <button
            onClick={collapseAll}
            className="text-[11px] font-semibold text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50 transition-colors cursor-pointer"
          >
            Collapse all
          </button>
        </div>
      )}
      <div className="space-y-3">
        {sections.map((sec) => (
          <AccordionSection
            key={sec.id}
            section={sec}
            isOpen={openId === sec.id}
            onToggle={() => toggle(sec.id)}
            editable={editable}
            onRename={onRename}
            onAddItem={onAddItem}
            onDeleteSection={onDeleteSection}
            onItemClick={onItemClick}
            onAssignmentClick={onAssignmentClick}
          />
        ))}
      </div>
    </div>
  );
}
