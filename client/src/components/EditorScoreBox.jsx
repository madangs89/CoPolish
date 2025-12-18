import React from "react";

const EditorScoreBox = ({ progress = 40 }) => {
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
    <aside className="h-full w-full bg-[#f8f9fb] border-r flex flex-col">
      {/* ================= TOP (FIXED) ================= */}
      <div className="px-4 pt-6 pb-4 flex flex-col gap-5">
        {/* Score */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-28 h-28 p-1 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(
                #025149 ${progress * 3.6}deg,
                #e5e7eb 0deg
              )`,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center shadow-sm">
              <p className="text-xl font-semibold text-[#1f2430]">
                {progress}%
              </p>
              <p className="text-[11px] text-[#6b6b6b]">Overall Score</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-[#1f2430]">
              8 improvement areas
            </p>
            <p className="text-xs text-[#6b6b6b]">
              Focus on these to boost your score
            </p>
          </div>
        </div>

        {/* Issue breakdown */}
        <div className="flex flex-col gap-3">
          {issuesData.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#1f2430]">{item.label}</span>
                <span className="text-[#6b6b6b]">{item.issues}</span>
              </div>

              <div className="w-full h-1 rounded-full bg-[#e5e7eb] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.issues * 20}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MIDDLE (SCROLLABLE) ================= */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-minimal">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2430]">
              AI Suggestions
            </h3>
            <p className="text-xs text-[#6b6b6b]">
              Targeted improvements based on your resume
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {aiSuggestions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-[#e6e6e6]"
              >
                <span className="text-xs text-[#1f2430]">{item.title}</span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    item.impact === "High"
                      ? "bg-red-50 text-red-600"
                      : item.impact === "Medium"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-gray-100 text-gray-600"
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
      <div className="px-4 py-4 border-t bg-gray-100">
        <p className="text-[11px] mt-2 text-center text-[#6b6b6b]">
          Uses 5 credits • Creates a new version
        </p>
        <button className="w-full mt-2 py-2.5 rounded-lg text-sm font-medium bg-[#025149] text-white hover:opacity-90 transition">
          Improve Resume with AI
        </button>
      </div>
    </aside>
  );
};

export default EditorScoreBox;
