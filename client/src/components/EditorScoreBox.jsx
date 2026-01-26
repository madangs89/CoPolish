import { ArrowRight, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, useMotionValue, useSpring } from "framer-motion";

const EditorScoreBox = ({
  mobileModalState,
  setMobileModalState,
  setOpen,
  open,
}) => {
  const currentResumeData = useSelector((state) => state.resume.currentResume);
  const resumeSlice = useSelector((state) => state.resume);

  /* ---------------- EXISTING STATE (UNCHANGED IDEA) ---------------- */

  const scoreBefore = currentResumeData?.scoreBefore || 0;
  const scoreAfter = currentResumeData?.scoreAfter || 0;

  const targetScore = Math.max(scoreBefore, scoreAfter);

  /* ---------------- ANIMATION STATE (SAFE) ---------------- */

  const motionProgress = useMotionValue(0);
  const smoothProgress = useSpring(motionProgress, {
    stiffness: 90,
    damping: 20,
  });

  const [displayScore, setDisplayScore] = useState(85);

  useEffect(() => {
    motionProgress.set(targetScore);
  }, [targetScore, motionProgress]);

  /* 🔑 Convert MotionValue → normal number */
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      setDisplayScore(Math.round(v));
    });
    return unsubscribe;
  }, [smoothProgress]);

  /* ---------------- EXISTING DATA ---------------- */

  const issuesData = [
    {
      label: "Resume Structure",
      issues: currentResumeData?.structureScore || 0,
    },
    {
      label: "Content Clarity",
      issues: currentResumeData?.contentClarityScore || 0,
    },
    {
      label: "ATS Keywords",
      issues: currentResumeData?.atsScore || 0,
    },
  ];

  const aiSuggestions = currentResumeData?.suggestions || [];

  const returnOptimzerValue = () => {
    if (displayScore >= 90) return 95;
    if (displayScore >= 80) return 95;
    if (displayScore >= 70) return 85;
    if (displayScore >= 60) return 75;
    return 75;
  };

  /* ---------------- RENDER ---------------- */

  return (
    <aside className="h-full w-full bg-[#f8f9fb] relative border-r flex flex-col">
      {mobileModalState === "score" && (
        <div
          onClick={() => setMobileModalState("")}
          className="absolute md:hidden top-2 left-3 p-2 rounded-full bg-gray-300 hover:bg-black transition z-10"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      )}

      {/* ================= TOP ================= */}
      <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3">
          {/* Animated ring */}
          <motion.div
            className="w-28 h-28 p-1 rounded-full flex items-center justify-center"
            style={{
              background: smoothProgress
                ? smoothProgress.get() >= 0
                  ? `conic-gradient(#3B82F6 ${
                      smoothProgress.get() * 3.6
                    }deg, #E5E7EB 0deg)`
                  : undefined
                : undefined,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
              <p className="text-xl font-semibold text-[#111111]">
                {displayScore}%
              </p>
              <p className="text-[11px] text-[#6B7280]">Overall Score</p>
            </div>
          </motion.div>

          <div className="text-center">
            <p className="text-sm font-medium text-[#374151]">
              {aiSuggestions.length || 5} issues blocking ATS shortlisting
            </p>
            <p className="text-xs text-[#6B7280]">
              Focus on these to boost your score
            </p>
          </div>
        </div>

        {/* Issue bars */}
        <div className="flex flex-col gap-3">
          {issuesData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span>{item.label}</span>
                <span className="text-[#6B7280]">{item.issues}</span>
              </div>

              <div className="w-full h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.issues}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    item.issues >= 90
                      ? "bg-green-500"
                      : item.issues >= 80
                        ? "bg-blue-500"
                        : item.issues >= 70
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MIDDLE ================= */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-1">AI Suggestions</h3>
        <p className="text-xs text-gray-500 mb-3">
          Targeted improvements based on your resume
        </p>

        <div className="flex flex-col gap-2">
          {aiSuggestions.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex justify-between bg-white border rounded-lg px-3 py-2"
            >
              <span className="text-xs">{item.suggestion}</span>
              <span
                className={`text-[10px] h-6 px-2 py-0.5 rounded-full ${
                  item.impact === "High"
                    ? "bg-red-100 text-red-700"
                    : item.impact === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.impact}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-4 py-4 flex flex-col items-center justify-center border-t bg-gray-100">
        <button
          onClick={() => {
            if (resumeSlice.statusHelper.loading) return;
            setOpen(true);
          }}
          disabled={resumeSlice.statusHelper.loading}
          className={`${
            resumeSlice.statusHelper.loading
              ? "cursor-not-allowed"
              : "cursor-pointer"
          } ${
            !open && !resumeSlice.statusHelper.loading && "optimize"
          } flex items-center gap-2 px-8 py-2 rounded-full bg-blue-600 text-white shadow-md`}
        >
          <Sparkles
            className={`w-4 h-4 ${
              resumeSlice.statusHelper.loading && "animate-pulse"
            }`}
          />
          <span className="text-sm font-semibold">
            {resumeSlice.statusHelper.loading
              ? "Optimizing..."
              : `Optimize to ${returnOptimzerValue()}%`}
          </span>
        </button>

        <p className="text-[11px] mt-2 text-center text-[#6B7280]">
          Uses 5 credits • Creates a new version
        </p>
      </div>
    </aside>
  );
};

export default EditorScoreBox;
