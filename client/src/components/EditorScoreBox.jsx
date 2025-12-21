import { ArrowRight } from "lucide-react";
import React from "react";

const EditorScoreBox = ({
  progress = 40,
  mobileModalState,
  setMobileModalState,
}) => {
  const issuesData = [
    { label: "Resume Structure", issues: 5, color: "#ef4444" },
    { label: "Content Clarity", issues: 2, color: "#f59e0b" },
    { label: "ATS Keywords", issues: 1, color: "#3b82f6" },
  ];

  const aiSuggestions = [
    { title: "Weak impact in experience", impact: "High" },
    { title: "ATS keywords missing", impact: "Medium" },
    { title: "Resume structure can be improved", impact: "Medium" },
    { title: "Summary lacks role focus", impact: "Low" },
  ];

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
              8 improvement areas
            </p>
            <p className="text-xs text-[#6B7280]">
              Focus on these to boost your score
            </p>
          </div>
        </div>

        {/* Issue breakdown */}
        <div className="flex flex-col gap-3">
          {issuesData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                {/* Label */}
                <span className="text-[#111111]">{item.label}</span>

                {/* Count (can later color by severity if you want) */}
                <span className="text-[#6B7280]">{item.issues}</span>
              </div>

              {/* Progress bar (NEUTRAL ONLY) */}
              <div className="w-full h-1 rounded-full bg-[#E5E7EB] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#D1D5DB]"
                  style={{
                    width: `${item.issues * 20}%`,
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
                <span className="text-xs text-[#111111]">{item.title}</span>

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
        <p className="text-[11px] mt-2 text-center text-[#6B7280]">
          Uses 5 credits • Creates a new version
        </p>
        <button
          className="px-3 mx-auto mt-2 py-2.5 rounded-lg text-sm font-medium 
bg-black text-white hover:bg-zinc-900 
transition-all duration-200 ease-linear"
        >
          Improve Resume with AI
        </button>
      </div>
    </aside>
  );
};

export default EditorScoreBox;
