import React from "react";

const EditorScoreBox = ({progress = 40}) => {
  return (
    <div className="h-full scrollbar-minimal overflow-y-auto pt-5 px-4 w-[20%] flex flex-col gap-6 bg-[#f8f9fb] border-r">
      {/* ================= SCORE ================= */}
      <div className="flex flex-col items-center">
        <div
          className="w-32 h-32 p-1 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(
          #025149 ${progress * 3.6}deg,
          #e5e7eb 0deg
        )`,
          }}
        >
          <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-[#1f2430]">{progress}%</p>
            <p className="text-xs text-[#6b6b6b]">Overall Score</p>
          </div>
        </div>
      </div>

      {/* ================= ISSUE SUMMARY ================= */}
      <div className="text-center">
        <h2 className="text-sm font-semibold text-[#1f2430]">8 Issues Found</h2>
        <p className="text-xs text-[#6b6b6b]">Areas needing attention</p>
      </div>

      {/* ================= ISSUE BREAKDOWN ================= */}
      <div className="flex flex-col gap-4">
        {[
          { label: "Resume Structure", issues: 5 },
          { label: "Content Clarity", issues: 2 },
          { label: "ATS Keywords", issues: 1 },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#1f2430]">{item.label}</span>
              <span className="text-[#6b6b6b]">{item.issues}</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-[#e5e7eb]">
              <div
                className="h-full rounded-full bg-[#dc2626]"
                style={{ width: `${item.issues * 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ================= DIVIDER ================= */}
      <div className="h-px bg-[#e6e6e6]" />

      {/* ================= AI SUGGESTIONS ================= */}
      {/* ================= AI SUGGESTIONS ================= */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <h3 className="text-sm font-semibold text-[#1f2430]">
            AI Suggestions
          </h3>
          <p className="text-xs text-[#6b6b6b]">
            Detected improvement opportunities
          </p>
        </div>

        {/* Action Tiles */}
        <div className="flex flex-col gap-2">
          {[
            { title: "Weak impact in experience", impact: "High" },
            { title: "ATS keywords missing", impact: "Medium" },
            { title: "Resume structure can be improved", impact: "Medium" },
            { title: "Summary lacks role focus", impact: "Low" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 border border-[#e6e6e6]"
            >
              <span className="text-xs text-[#1f2430]">{item.title}</span>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  item.impact === "High"
                    ? "bg-red-100 text-red-600"
                    : item.impact === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item.impact}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="mt-2 w-full py-2 rounded-lg text-sm font-medium bg-[#025149] text-white hover:opacity-90 transition">
          Update Resume with AI
        </button>

        <p className="text-[11px] text-center text-[#6b6b6b]">
          Uses 5 credits • Creates a new resume version
        </p>
      </div>
    </div>
  );
};

export default EditorScoreBox;
