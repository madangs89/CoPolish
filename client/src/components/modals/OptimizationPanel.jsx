import React from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoaderForStatus } from "../../redux/slice/resumeSlice";
import DiffViewer from "react-diff-viewer";

/**
 * TEMP STATIC DATA (replace later)
 */
const STATIC_DATA = {
  operation: "all",
  currentOperation: "experience",
  optimizedSections: {
    skills: {
      status: "completed",
      note: "Keywords clarified for ATS",
      changes: [
        {
          section: "Skills",
          before: "Node.js, Express, Mongo",
          after: "Node.js, Express.js, MongoDB, REST APIs",
          reason: "Improved keyword coverage for ATS",
        },
      ],
    },

    projects: {
      status: "completed",
      note: "Descriptions refined",
      changes: [
        {
          section: "Schema Genius",
          before: "Built an AI backend generator",
          after:
            "Built an AI-powered backend generator transforming prompts into APIs",
          reason: "Added clarity and impact",
        },
      ],
    },

    experience: {
      status: "running",
      note: "Optimizing bullet clarity",
      changes: [
        {
          section: "Backend Developer Intern",
          before: "Worked on APIs",
          after: "Designed and optimized REST APIs",
          reason: "Clarified responsibility",
        },
      ],
    },

    education: { status: "pending", changes: [] },
    certifications: { status: "pending", changes: [] },
  },
};

const ORDER = [
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
];

export default function OptimizationPanel() {
  const dispatch = useDispatch();

  return (
    <aside className="w-[380px] bg-[#F8F9FB] border-l shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="font-medium text-gray-900">Optimizing your resume</h3>
        <button
          onClick={() => dispatch(setGlobalLoaderForStatus(false))}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="px-4 py-3 space-y-3 overflow-y-auto">
        {ORDER.map((key) => {
          const section = STATIC_DATA.optimizedSections[key];
          return (
            <SectionRow
              key={key}
              label={capitalize(key)}
              {...section}
              isActive={STATIC_DATA.currentOperation === key}
            />
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="px-4 py-3 border-t text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-1">Why this works</p>
        <ul className="space-y-1">
          <li>✓ Improves ATS readability</li>
          <li>✓ Keeps information truthful</li>
        </ul>
      </div>
    </aside>
  );
}

/* -------------------------------------------------- */
/* SECTION ROW                                        */
/* -------------------------------------------------- */

function SectionRow({ label, status, note, changes = [], isActive }) {
  return (
    <div
      className={`text-sm border bg-white p-2 rounded ${isActive && "loader"}`}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={status} isActive={isActive} />

        <div className="flex-1">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-gray-500">{note || "Pending"}</p>
        </div>
      </div>

      {/* INLINE DIFFS */}
      {changes.length > 0 && (
        <ul className="mt-2 ml-8 space-y-2 list-disc pl-3">
          {changes.map((c, i) => (
            <li key={i} className="rounded-md border border-gray-200 bg-white">
              <DiffViewer
                oldValue={c.before}
                newValue={c.after}
                splitView={false}
                showDiffOnly
                hideLineNumbers
                styles={{
                  diffContainer: {
                    background: "transparent",
                    fontSize: "13px",
                    lineHeight: "1.6",
                  },
                  added: {
                    background: "#dcfce7",
                  },
                  removed: {
                    background: "#fee2e2",
                  },
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* STATUS ICON                                        */
/* -------------------------------------------------- */

function StatusIcon({ status, isActive }) {
  if (status === "completed") {
    return (
      <span className="h-5 w-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
        ✓
      </span>
    );
  }

  if (status === "running" || isActive) {
    return (
      <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs animate-pulse">
        ⏳
      </span>
    );
  }

  return (
    <span className="h-5 w-5 rounded-full border text-gray-400 flex items-center justify-center text-xs">
      ○
    </span>
  );
}

/* -------------------------------------------------- */
/* HELPERS                                            */
/* -------------------------------------------------- */

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
