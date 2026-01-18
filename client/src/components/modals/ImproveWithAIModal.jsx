import React, { useState, useMemo } from "react";

const OPTIMIZATIONS = [
  {
    id: "ats",
    title: "ATS Keywords",
    desc: "Adds missing role-based keywords",
    credits: 2,
  },
  {
    id: "impact",
    title: "Experience Impact",
    desc: "Rewrites weak bullet points",
    credits: 2,
  },
  {
    id: "structure",
    title: "Resume Structure",
    desc: "Improves section order & spacing",
    credits: 1,
  },
  {
    id: "clarity",
    title: "Content Clarity",
    desc: "Removes repetition & fluff",
    credits: 0,
  },
];

const SECTIONS = [
  "Personal Details",
  "Education",
  "Experience",
  "Projects",
  "Skills",
  "Certifications",
];

const ImproveWithAIModal = ({
  isOpen,
  onClose,
  onConfirm,
  userCredits = 8,
  currentScore = 40,
  expectedScore = 70,
}) => {
  if (!isOpen) return null;

  const [selectedOptimizations, setSelectedOptimizations] = useState(
    OPTIMIZATIONS.map((o) => o.id)
  );
  const [selectedSections, setSelectedSections] = useState(SECTIONS);

  const totalCredits = useMemo(() => {
    return OPTIMIZATIONS.filter((o) =>
      selectedOptimizations.includes(o.id)
    ).reduce((sum, o) => sum + o.credits, 0);
  }, [selectedOptimizations]);

  const hasCredits = userCredits >= totalCredits;

  const toggleOptimization = (id) => {
    setSelectedOptimizations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((x) => x !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-3">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Improve Resume with AI</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Score */}
          <div className="rounded-xl bg-gray-50 border p-4">
            <p className="text-sm font-medium mb-2">Expected Score Boost</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Current</p>
                <p className="text-xl font-semibold text-red-500">
                  {currentScore}%
                </p>
              </div>

              <div className="flex-1 h-1 bg-gray-200 rounded">
                <div
                  className="h-1 bg-black rounded"
                  style={{ width: `${expectedScore}%` }}
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">After AI</p>
                <p className="text-xl font-semibold text-green-600">
                  {expectedScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Optimization Options */}
          <div>
            <p className="text-sm font-medium mb-3">Optimization Type</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {OPTIMIZATIONS.map((o) => {
                const active = selectedOptimizations.includes(o.id);
                return (
                  <div
                    key={o.id}
                    onClick={() => toggleOptimization(o.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition ${
                      active
                        ? "border-black bg-black/5"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm">{o.title}</p>
                      <span className="text-xs text-gray-500">
                        {o.credits > 0 ? `${o.credits} credits` : "Included"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{o.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Selection */}
          <div>
            <p className="text-sm font-medium mb-3">Apply To Sections</p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => {
                const active = selectedSections.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSection(s)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credits */}
          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span>Total Credits</span>
              <span className="font-semibold">{totalCredits}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>Your Credits</span>
              <span
                className={`font-semibold ${
                  hasCredits ? "text-green-600" : "text-red-600"
                }`}
              >
                {userCredits}
              </span>
            </div>

            {!hasCredits && (
              <p className="text-xs text-red-600 mt-2">
                Not enough credits to proceed
              </p>
            )}
          </div>

          {/* Safety */}
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-lg">
            🔒 Original resume is always saved. You can revert anytime.
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={!hasCredits || selectedSections.length === 0}
            onClick={() =>
              onConfirm({
                optimizations: selectedOptimizations,
                sections: selectedSections,
                credits: totalCredits,
              })
            }
            className={`px-5 py-2 rounded-lg text-sm font-medium text-white ${
              hasCredits
                ? "bg-black hover:bg-gray-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Improve Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImproveWithAIModal;
