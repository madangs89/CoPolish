import React from "react";

/**
 * CHANGE THIS LATER WITH REAL STATE
 */
const STATIC_DATA = {
  operation: "all", // "all" | "skills" | "projects" | etc
  status: "running", // pending | running | successful | failed
  currentOperation: "experience",
  optimizedSections: {
    skills: { status: "completed", note: "Keywords clarified for ATS" },
    projects: { status: "completed", note: "Descriptions refined" },
    experience: { status: "running", note: "Improving bullet clarity" },
    education: { status: "pending" },
    certifications: { status: "pending" },
  },
};

/**
 * ORDER FOR MULTI OPERATION
 */
const ALL_OPERATION_ORDER = [
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
];

export default function OptimizationPanel() {
  const { operation } = STATIC_DATA;
  const isAll = operation === "all";

  return (
    <div
      className="w-[360px] max-w-full bg-white rounded-xl shadow-xl p-4
                    lg:sticky lg:top-4
                    md:fixed md:right-0 md:top-0 md:h-full md:rounded-none
                    sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:h-[60%] sm:rounded-t-xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="font-semibold text-gray-900">Optimizing your resume…</h3>
        <button className="text-gray-400 hover:text-gray-600">✕</button>
      </div>

      {/* BODY */}
      <div className="mt-4 space-y-3 overflow-y-auto max-h-[65vh]">
        {isAll ? (
          ALL_OPERATION_ORDER.map((key) => {
            const section = STATIC_DATA.optimizedSections[key];
            return (
              <SectionRow
                key={key}
                label={capitalize(key)}
                status={section?.status}
                note={section?.note}
                isActive={STATIC_DATA.currentOperation === key}
              />
            );
          })
        ) : (
          <SectionRow
            label={capitalize(operation)}
            status={STATIC_DATA.status}
            note="Improving keyword relevance and grouping"
            isActive={STATIC_DATA.status === "running"}
          />
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-4 border-t pt-3 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Why this works</p>
        <ul className="space-y-1">
          <li>✓ Enhances ATS readability</li>
          <li>✓ Preserves factual accuracy</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * SECTION ROW
 */
function SectionRow({ label, status = "pending", note, isActive }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-lg mt-0.5">{getStatusIcon(status, isActive)}</span>

      <div>
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-500">{getStatusText(status, note)}</p>
      </div>
    </div>
  );
}

/**
 * HELPERS
 */
function getStatusIcon(status, isActive) {
  if (status === "completed") return "✔";
  if (status === "failed") return "✖";
  if (status === "running" || isActive) return "⏳";
  return "○";
}

function getStatusText(status, note) {
  if (status === "completed") return note || "Optimized";
  if (status === "running") return "Optimization in progress…";
  if (status === "failed") return "Optimization failed";
  return "Pending";
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
