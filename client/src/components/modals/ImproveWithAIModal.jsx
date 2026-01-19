import React, { useState } from "react";
import { Check } from "lucide-react";

const CREDIT_COST = {
  FULL_RESUME: 10,
  PERSONAL: 1,
  EXPERIENCE: 1,
  PROJECTS: 1,
  SKILLS: 1,
  EDUCATION: 1,
  CERTIFICATIONS: 1,
  ACHIEVEMENTS: 1,
  EXTRACURRICULAR: 1,
  HOBBIES: 1,
};

const OPTIONS = [
  {
    key: "FULL_RESUME",
    label: "Full resume (recommended)",
    desc: "Improve structure, clarity, and ATS readability across all sections.",
  },
  {
    key: "PERSONAL",
    label: "Personal summary",
    desc: "Rewrite summary with clear role focus, skills, and experience.",
  },
  {
    key: "EXPERIENCE",
    label: "Experience",
    desc: "Convert vague roles into clear, ATS-friendly responsibilities.",
  },
  {
    key: "PROJECTS",
    label: "Projects",
    desc: "Explain projects with clear system behavior and technologies used.",
  },
  {
    key: "SKILLS",
    label: "Skills",
    desc: "Align skills based on experience and ATS keyword relevance.",
  },
  {
    key: "EDUCATION",
    label: "Education",
    desc: "Ensure clean, consistent, ATS-friendly education formatting.",
  },
  {
    key: "CERTIFICATIONS",
    label: "Certifications",
    desc: "Clean and standardize certification entries for ATS parsing.",
  },
  {
    key: "ACHIEVEMENTS",
    label: "Achievements",
    desc: "Rewrite achievements clearly without exaggeration or fake impact.",
  },
  {
    key: "EXTRACURRICULAR",
    label: "Extracurricular",
    desc: "Clarify roles and activities without inflating responsibility.",
  },
  {
    key: "HOBBIES",
    label: "Hobbies",
    desc: "Format hobbies cleanly without professionalizing them.",
  },
];

const ImproveWithAIModal = ({ isOpen, onClose, userCredits = 52 }) => {
  const [selected, setSelected] = useState("FULL_RESUME");

  if (!isOpen) return null;

  const requiredCredits = CREDIT_COST[selected];
  const hasEnoughCredits = userCredits >= requiredCredits;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">

        {/* Header */}
        <h2 className="text-lg font-semibold mb-1">
          Improve resume with AI
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          ATS-focused, honest improvements only
        </p>

        {/* Score preview */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Current</span>
            <span className="text-gray-500">After AI</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded">
            <div className="absolute left-0 top-0 h-2 bg-black rounded w-[70%]" />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="font-medium">40%</span>
            <span className="font-medium">70%</span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`w-full rounded-lg border px-4 py-3 text-left
                ${
                  selected === opt.key
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div
                    className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center
                      ${
                        selected === opt.key
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                  >
                    {selected === opt.key && (
                      <Check size={12} className="text-black" />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {CREDIT_COST[opt.key]} credit
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Credit summary */}
        <div className="flex justify-between text-sm mt-5">
          <span>Credits available</span>
          <span className="font-medium">{userCredits}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>This will use</span>
          <span className="font-medium">{requiredCredits}</span>
        </div>

        {!hasEnoughCredits && (
          <p className="text-xs text-red-500 mt-2">
            Not enough credits. Please recharge.
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={!hasEnoughCredits}
            className={`flex-1 rounded-lg py-2 text-sm text-white
              ${
                hasEnoughCredits
                  ? "bg-black"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Improve
          </button>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-gray-400 mt-4">
          ATS-optimized • No fake content • Credits never expire
        </p>
      </div>
    </div>
  );
};

export default ImproveWithAIModal;
