import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const EditorScoreBox = ({
  progress = 40,
  mobileModalState,
  setMobileModalState,
  setOpen,
}) => {
  let currentResumeData = useSelector((state) => state.resume.currentResume);

  const issuesData = [
    {
      label: "Resume Structure",
      issues: currentResumeData?.structureScore || 0,
      color: "#ef4444",
    },
    {
      label: "Content Clarity",
      issues: currentResumeData?.contentClarityScore || 0,
      color: "#f59e0b",
    },
    {
      label: "ATS Keywords",
      issues: currentResumeData?.atsScore || 0,
      color: "#3b82f6",
    },
  ];

  const aiSuggestions = currentResumeData?.suggestions || [];

  let scoreBefore = useSelector(
    (state) => state.resume.currentResume.scoreBefore,
  );
  let scoreAfter = useSelector(
    (state) => state.resume.currentResume.scoreAfter,
  );

  progress = Math.max(scoreBefore, scoreAfter);

  const returnOptimzerValue = () => {
    if (progress >= 90) {
      return 95;
    } else if (progress >= 80) {
      return 95;
    } else if (progress >= 70) {
      return 85;
    } else if (progress >= 60) {
      return 75;
    } else {
      return 75;
    }
  };
  return (
    <aside className="h-full w-full bg-[#f8f9fb] relative border-r flex flex-col">
      {mobileModalState == "score" && (
        <div
          onClick={() => setMobileModalState("")}
          className="absolute md:hidden flex items-center justify-center top-2 left-3 p-2 rounded-full bg-gray-300 active:bg-black transition-all duration-150 hover:bg-black  z-10"
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      )}
      {/* ================= TOP (FIXED) ================= */}
      <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
        {/* Score */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-28 h-28 p-1 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(
                #3B82F6 ${progress * 3.6}deg,
                #E5E7EB 0deg
              )`,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
              <p className="text-xl font-semibold text-[#111111]">
                {progress}%
              </p>
              <p className="text-[11px] text-[#6B7280]">Overall Score</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-[#374151]">
              {aiSuggestions.length || 5} issues blocking ATS shortlisting
            </p>
            <p className="text-xs text-[#6B7280]">
              Focus on these to boost your score
            </p>
          </div>
        </div>

        {/* Issue breakdown */}
        <div className="flex flex-col gap-3">
          {issuesData.map((item, idx) => (
            <div
              key={idx}
              className="flex group cursor-pointer relative flex-col gap-1.5"
            >
              <div className="flex justify-between text-xs">
                {/* Label */}
                <span className="text-[#111111]">{item.label}</span>

                <span className="text-[#111111] opacity-0 transition-all duration-150 group-hover:opacity-100">
                  {item.issues >= 90
                    ? "Good"
                    : item.issues >= 80
                      ? "Neutral"
                      : item.issues >= 70
                        ? "Bad"
                        : "Very Bad"}
                </span>

                {/* Count (can later color by severity if you want) */}
                <span className="text-[#6B7280]">{item.issues}</span>
              </div>

              {/* Progress bar (NEUTRAL ONLY) */}
              <div className="w-full h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.issues >= 90 ? "bg-green-500" : item.issues >= 80 ? "bg-blue-500" : item.issues >= 70 ? "bg-yellow-500" : "bg-red-500"} `}
                  style={{
                    width: `${item.issues}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MIDDLE (SCROLLABLE) ================= */}
      {/* ================= MIDDLE (SCROLLABLE) ================= */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-minimal">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">
              AI Suggestions
            </h3>
            <p className="text-xs text-[#6B7280]">
              Targeted improvements based on your resume
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {aiSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-[#E5E7EB]"
              >
                {/* Suggestion title */}
                <span className="text-xs text-[#111111]">
                  {item?.suggestion}
                </span>

                {/* Impact pill — ONLY place with color */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.impact === "High"
                      ? "bg-[#FEE2E2] text-[#991B1B]"
                      : item.impact === "Medium"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#EFF6FF] text-[#1D4ED8]"
                  }`}
                >
                  {item.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= FOOTER (FIXED CTA) ================= */}
      <div className="px-4 py-4 flex flex-col items-center justify-center border-t bg-gray-100">
        <button
          onClick={() => setOpen(true)}
          className="flex optimize items-center cursor-pointer gap-2 px-8 py-2 rounded-full bg-blue-600 text-white shadow-md"
        >
          <Sparkles className="w-4 h-4 " />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">
              Optimize to {returnOptimzerValue()}+
            </span>
            {/* <span className="text-[10px] opacity-80">9 credits</span> */}
          </div>
        </button>

        <p className="text-[11px] mt-2 text-center text-[#6B7280]">
          Uses 5 credits • Creates a new version
        </p>
      </div>
    </aside>
  );
};

export default EditorScoreBox;
