import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setGlobalLoaderForStatus,
  setStatusHelper,
} from "../../redux/slice/resumeSlice";
import DiffViewer from "react-diff-viewer";
import BlackLoader from "../Loaders/BlackLoader";
import { ArrowDown, ArrowUp } from "lucide-react";

const ORDER = [
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "achievements",
  "extracurricular",
  "hobbies",
  "personal",
];

export default function OptimizationPanel() {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const STATIC_DATA = useSelector((state) => state.resume.statusHelper);

  useEffect(() => {
    if (!socket) return;

    socket.on("job:update", (val) => {
      val = JSON.parse(val);

      let {
        userId,
        resumeId,
        data: {
          status,
          error,
          optimizedSections,
          startedAt,
          updatedAt,
          completedAt,
          currentOperation,
          errorTask,
        },
      } = val;

      optimizedSections = JSON.parse(optimizedSections || "{}");
      errorTask = JSON.parse(errorTask || "{}");

      const currentIndex = ORDER.indexOf(currentOperation);

      if (
        currentIndex !== -1 &&
        currentIndex < ORDER.length - 1 &&
        optimizedSections[currentOperation]?.status === "completed"
      ) {
        currentOperation = ORDER[currentIndex + 1];
      }

      dispatch(
        setStatusHelper({
          resumeId,
          userId,
          error,
          optimizedSections,
          errorTask,
          completedAt,
          startedAt,
          updatedAt,
          currentOperation,
          status,
        }),
      );
    });

    return () => socket.off("job:update");
  }, [socket, dispatch]);

  return (
    <aside className="w-[400px] h-screen flex flex-col bg-[#F8F9FB] border-l shadow-sm">
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
      <div className="px-4 py-3 pb-10 flex-1 space-y-3 overflow-y-auto">
        {STATIC_DATA.operation === "all" ? (
          ORDER.map((key) => {
            const section = STATIC_DATA.optimizedSections?.[key];
            return (
              <SectionRow
                key={key}
                label={capitalize(key)}
                {...section}
                isActive={STATIC_DATA.currentOperation === key}
              />
            );
          })
        ) : (
          <SingleOptimizationView data={STATIC_DATA} />
        )}
      </div>
    </aside>
  );
}

/* -------------------------------------------------- */
/* SINGLE OPTIMIZATION VIEW                            */
/* -------------------------------------------------- */

function SingleOptimizationView({ data }) {
  const sectionKey = data.operation;
  const section = data.optimizedSections?.[sectionKey];

  const isLoading = data.isOptimizing || !section;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-md border bg-white p-3 text-sm">
        <p className="font-medium text-gray-900">
          Optimizing {capitalize(sectionKey)}
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Only this section is being optimized to keep changes focused and
          accurate.
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="rounded-md border bg-white p-4 text-sm text-gray-600 flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          Preparing optimization…
        </div>
      ) : (
        <SectionRow
          label={capitalize(sectionKey)}
          {...section}
          isActive={true}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* SECTION ROW                                        */
/* -------------------------------------------------- */

function SectionRow({ label, status, changes = [], isActive }) {
  const [openViewer, setOpenViewer] = useState(true);

  return (
    <div
      className={`text-sm border bg-white p-2 rounded ${isActive && status !== "completed" ? "loader" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2">
          <StatusIcon status={status} isActive={isActive} />

          <div className="flex-1">
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-gray-500">{status ? status : "Pending"}</p>
          </div>
        </div>

        {changes.length > 0 ? (
          <button onClick={() => setOpenViewer(!openViewer)}>
            {openViewer ? (
              <ArrowUp className="text-gray-600 w-5 h-5" />
            ) : (
              <ArrowDown className="text-gray-600 w-5 h-5" />
            )}
          </button>
        ) : (
          <p className="text-xs text-gray-700">No changes</p>
        )}
      </div>

      {changes.length > 0 && (
        <ul
          className={`
            mt-2  list-disc pl-1
            grid overflow-hidden
            transition-[grid-template-rows] duration-300 ease-out
            ${openViewer ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
          `}
        >
          <div className="min-h-0">
            <div className="space-y-2">
              {changes.map((c, i) => (
                <li
                  key={i}
                  className="rounded-md border border-gray-200 bg-white"
                >
                  <DiffViewer
                    oldValue={c.before || ""}
                    newValue={c.after || ""}
                    splitView={false}
                    showDiffOnly
                    hideLineNumbers
                    styles={{
                      diffContainer: {
                        background: "transparent",
                        fontSize: "13px",
                        lineHeight: "1.6",
                      },
                      added: { background: "#dcfce7" },
                      removed: { background: "#fee2e2" },
                    }}
                  />
                </li>
              ))}
            </div>
          </div>
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
        <BlackLoader />
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

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
