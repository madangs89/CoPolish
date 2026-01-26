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
      {
        withCredentials: true,
      },
    );

    if (res.data.success) {
      dispatch(setCredits(res.data.totalCredits));
    }
  } catch (e) {
    console.error("Failed to refresh credits", e);
  }
};

/* ---------------- MAIN ---------------- */

export default function OptimizationPanel() {
  const dispatch = useDispatch();
  const socket = useSelector((s) => s.socket.socket);
  const STATUS = useSelector((s) => s.resume.statusHelper);

  const [finalScore, setFinalScore] = useState(null);
  const [showCommitModal, setShowCommitModal] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

  /* ---------------- SOCKET ---------------- */

  useEffect(() => {
    if (!socket) return;

    const onUpdate = (raw) => {
      const payload = JSON.parse(raw);
      const { data } = payload;

      dispatch(
        setStatusHelper({
          ...data,
          optimizedSections: JSON.parse(data.optimizedSections || "{}"),
          errorTask: JSON.parse(data.errorTask || "{}"),
        }),
      );
    };

    const onFinish = async (raw) => {
      if (!raw) return;

      const payload = JSON.parse(raw);

      // ✅ success path
      setFinalScore(payload.scoreAfter ?? null);
      setIsFinalized(true);
      setShowCommitModal(true);
      await refreshCredits(dispatch);
      setTimeout(() => {
        dispatch(setCurrentResumeId(payload._id));
        dispatch(setCurrentResume(payload));
        dispatch(setStatusHelperLoader(false));
        setShowCommitModal(false);
        toast.success("Optimized changes applied");
      }, 800);
    };

    socket.on("job:update", onUpdate);
    socket.on("job:update-finish", onFinish);

    return () => {
      socket.off("job:update", onUpdate);
      socket.off("job:update-finish", onFinish);
    };
  }, [socket, dispatch]);

  /* ---------------- DERIVED ---------------- */

  const sectionOrder =
    STATUS.operation === "all" ? BASE_ORDER : [STATUS.operation];

  const sections = sectionOrder.map((key) => {
    const s = STATUS.optimizedSections?.[key];
    // if (s.status == "failed") {
    //   // here can i credit back user credits
    // }
    return {
      key,
      label: capitalize(key),
      status: s?.status || "pending",
      changes: s?.changes || [],
      isActive: STATUS.currentOperation === key,
    };
  });

  // ✅ derived success count
  const successCount = useMemo(() => {
    return sections.filter((s) => s.status === "completed").length;
  }, [sections]);

  /* ---------------- FORCE COMPLETE (ALL FAILED) ---------------- */

  useEffect(() => {
    if (STATUS.status === "completed" && successCount === 0 && !isFinalized) {
      setIsFinalized(true);
      setFinalScore(null);

      (async () => {
        await refreshCredits(dispatch);
      })();
      dispatch(setStatusHelper(false));
    }
  }, [STATUS.status, successCount, isFinalized, dispatch]);

  /* ---------------- SCORE ROW ---------------- */

  // 🟡 CASE 1: waiting for backend score (some success)
  if (!isFinalized && successCount > 0) {
    sections.push({
      key: "score",
      label: "Score",
      status: "running",
      changes: [],
      isActive: true,
    });
  }

  // 🟢 CASE 2: finalized (success or all-failed)
  if (isFinalized) {
    sections.push({
      key: "score",
      label: "Score",
      status: "completed",
      changes: [
        {
          before: "",
          after:
            finalScore == null
              ? "Score unchanged (all sections failed)"
              : `Final Resume Score: ${finalScore}`,
        },
      ],
    });
  }

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <aside className="w-[400px] h-screen flex flex-col bg-[#F8F9FB] border-l">
        <div className="flex justify-between px-4 py-3 border-b">
          <h3 className="font-medium">
            {isFinalized ? "Optimization Complete" : "Optimizing Resume"}
          </h3>
          <button onClick={() => dispatch(setGlobalLoaderForStatus(false))}>
            ✕
          </button>
        </div>

        <div className="px-4 py-3 space-y-3 overflow-y-auto">
          {sections.map((s) => (
            <SectionRow key={s.key} {...s} />
          ))}
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

        {changes.length > 0 && (
          <button onClick={() => setOpen(!open)}>
            {open ? <ArrowUp /> : <ArrowDown />}
          </button>
        )}
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
  if (status === "completed") return <Dot color="green" text="✓" />;
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
