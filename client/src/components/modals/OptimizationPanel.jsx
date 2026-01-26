import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentResume,
  setCurrentResumeId,
  setGlobalLoaderForStatus,
  setStatusHelper,
  setStatusHelperLoader,
} from "../../redux/slice/resumeSlice";
import DiffViewer from "react-diff-viewer";
import BlackLoader from "../Loaders/BlackLoader";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { createPortal } from "react-dom";
import axios from "axios";
import { setCredits } from "../../redux/slice/authSlice";

/* ---------------- CONSTANTS ---------------- */

const BASE_ORDER = [
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

const refreshCredits = async (dispatch) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/v1/credits`,
      { withCredentials: true },
    );
    if (res.data.success) {
      dispatch(setCredits(res.data.totalCredits));
    }
  } catch (e) {
    console.error("Credit refresh failed", e);
  }
};

/* ---------------- MAIN ---------------- */

export default function OptimizationPanel() {
  const dispatch = useDispatch();
  const socket = useSelector((s) => s.socket.socket);
  const STATUS = useSelector((s) => s.resume.statusHelper);

  const [scoreStatus, setScoreStatus] = useState({
    isScoreFound: false,
    score: null,
    isCompleted: false,
  });

  const [toastMessage, setToastMessage] = useState({
    toastMessage: "",
    toastType: "", // 'success' | 'error' | ''
  });

  const [showCommitModal, setShowCommitModal] = useState(false);

  /* ---------------- SOCKET ---------------- */

  useEffect(() => {
    if (!socket) return;

    const onJobUpdate = async (raw) => {
      const payload = JSON.parse(raw);

      console.log("Job update received:", payload);
      // 🔒 Backend is the source of truth
      dispatch(setStatusHelper(payload));

      const isFinal =
        payload.status === "completed" ||
        payload.status === "partial" ||
        payload.status === "failed";

      // 🟡 Final resume arrived → show applying modal
      if (isFinal && payload.fullResumeVersion) {
        setShowCommitModal(true);
        await refreshCredits(dispatch);
        setTimeout(() => {
          let fullRes = JSON.parse(payload.fullResumeVersion);
          dispatch(setCurrentResumeId(fullRes._id));
          dispatch(setCurrentResume(fullRes));
          dispatch(setStatusHelperLoader(false));
          setShowCommitModal(false);
          if (payload.status === "completed") {
            toast.success("Optimized resume applied successfully");
          } else if (payload.status === "partial") {
            toast.error(
              "Optimization partially completed. Some sections may have failed.",
            );
          } else {
            toast.error(
              "All sections failed to optimize.and credits refunded.",
            );
          }
        }, 800);
      }

      if (isFinal) {
        if (payload.isScoreFound && payload.score) {
          const parsedScore = JSON.parse(payload.score);

          setScoreStatus({
            isCompleted: true,
            isScoreFound: true,
            score: parsedScore,
          });
        } else {
          setScoreStatus({
            isCompleted: true,
            isScoreFound: false,
            score: null,
          });
        }
      }

      // 🟥 Final but no resume (all failed case)
      if (isFinal && !payload.fullResumeVersion) {
        await refreshCredits(dispatch);
        dispatch(setStatusHelperLoader(false));
        toast.error("Optimization failed");
      }
    };

    socket.on("job:update", onJobUpdate);

    return () => {
      socket.off("job:update", onJobUpdate);
    };
  }, [socket, dispatch]);

  /* ---------------- SECTIONS ---------------- */

  const sectionKeys =
    STATUS.operation === "all"
      ? BASE_ORDER
      : STATUS.operation
        ? [STATUS.operation]
        : [];

  const sections = sectionKeys.map((key) => {
    const s = STATUS.sections?.find((x) => x.name === key);
    return {
      key,
      label: capitalize(key),
      status: s?.status || "pending",
      changes: s?.changedData || [],
      isActive: s?.status === "running",
    };
  });

  /* ---------------- SCORE ROW ---------------- */

  const scoreRow = {
    key: "score",
    label: "Score",

    status: !scoreStatus.isCompleted
      ? "running"
      : scoreStatus.isScoreFound && scoreStatus.score
        ? "completed"
        : "failed",

    changes:
      scoreStatus.isScoreFound && scoreStatus.score
        ? [
            {
              before: `Initial Resume Score: ${scoreStatus.score.scoreBefore ?? 0}`,
              after: `Final Resume Score: ${scoreStatus.score.scoreAfter ?? 0}`,
            },
          ]
        : [],

    isActive: !scoreStatus.isCompleted,
  };

  useEffect(() => {
    dispatch(
      setStatusHelper({
        operation: "",
        status: "",
        loading: false,
        error: null,
        jobId: null,
        userId: null,
        section: null,
        sections: null,
        sectionStatus: null,
        fullResumeVersion: null,
        score: null,
        isScoreFound: false,
      }),
    );
    dispatch(setGlobalLoaderForStatus(false));
  }, []);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <aside className="w-[400px] h-screen flex flex-col bg-[#F8F9FB] border-l">
        <div className="flex justify-between px-4 py-3 border-b">
          <h3 className="font-medium">
            {scoreStatus.isCompleted
              ? "Optimization Complete"
              : "Optimizing Resume"}
          </h3>
          <button
            onClick={() => {
              setScoreStatus({
                isScoreFound: false,
                score: null,
                isCompleted: false,
              });
              dispatch(setGlobalLoaderForStatus(false));
            }}
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-3 space-y-3 overflow-y-auto">
          {sections.map((s) => (
            <SectionRow key={s.key} {...s} />
          ))}
          <SectionRow
            key="score"
            {...(() => {
              const { key, ...rest } = scoreRow;
              return rest;
            })()}
          />
        </div>
      </aside>

      {showCommitModal && <ApplyCommitModal />}
    </>
  );
}

/* ---------------- SECTION ROW ---------------- */

function SectionRow({ label, status, changes, isActive }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border bg-white p-2 rounded">
      <div className="flex justify-between">
        <div className="flex gap-2 items-start">
          <StatusIcon status={status} isActive={isActive} />
          <div>
            <p className="font-medium">{label}</p>
            <p className="text-xs text-gray-500">{status}</p>
          </div>
        </div>

        {changes.length > 0 ? (
          <button onClick={() => setOpen(!open)}>
            {open ? <ArrowUp /> : <ArrowDown />}
          </button>
        ) : changes.length == 0 && status == "completed" ? (
          <span className="text-green-500 font-semibold">No Changes</span>
        ) : null}
      </div>

      {open &&
        changes.map((c, i) => (
          <DiffViewer
            key={i}
            oldValue={c.before || ""}
            newValue={c.after || ""}
            splitView={false}
            showDiffOnly
            hideLineNumbers
          />
        ))}
    </div>
  );
}

/* ---------------- STATUS ICON ---------------- */

function StatusIcon({ status, isActive }) {
  if (status === "success" || status === "completed")
    return <Dot color="green" text="✓" />;
  if (status === "failed") return <Dot color="red" text="!" />;
  if (status === "running" || isActive)
    return (
      <span className="h-5 w-5 flex items-center justify-center">
        <BlackLoader />
      </span>
    );
  return <Dot color="gray" text="○" />;
}

const Dot = ({ color, text }) => {
  const map = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-200 text-gray-500",
  };

  return (
    <span
      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs ${map[color]}`}
    >
      {text}
    </span>
  );
};

/* ---------------- MODAL ---------------- */

function ApplyCommitModal() {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <BlackLoader />
        <p className="mt-2 text-sm">Applying optimized changes…</p>
      </div>
    </div>,
    document.body,
  );
}

function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
