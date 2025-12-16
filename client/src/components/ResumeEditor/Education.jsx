import React from "react";
import { Trash2, Plus } from "lucide-react";


const Education = ({ resumeData, setResumeData }) => {
  const updateEducation = (idx, f, value) => {
    const updated = [...resumeData.education];

    updated[idx] = {
      ...updated[idx],
      [f]: value, 
    };

    setResumeData((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  return (
    <div className="space-y-5">
      {/* ===== EMPTY STATE ===== */}
      {resumeData.education.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#fafafa] p-6 text-center space-y-3">
          <p className="text-sm font-medium text-[#1f2430]">
            No education added yet
          </p>
          <p className="text-xs text-[#6b6b6b]">
            Add your educational background to strengthen your resume
          </p>

          <button
            onClick={() => {
              setResumeData((prev) => ({
                ...prev,
                education: [
                  ...prev.education,
                  {
                    degree: "",
                    institute: "",
                    from: "",
                    to: "",
                  },
                ],
              }));
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                     bg-[#025149] text-white hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>
      )}

      {/* ===== EDUCATION LIST ===== */}
      {resumeData.education.map((edu, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-[#e6e6e6] bg-white p-5 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1f2430]">
              Education {idx + 1}
            </p>

            <button
              onClick={() => {
                const copy = resumeData.education.filter(
                  (_, index) => index !== idx
                );

                setResumeData((prev) => ({
                  ...prev,
                  education: copy,
                }));
              }}
              className="p-1 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* DEGREE & INSTITUTE */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">
                Degree
              </label>
              <input
                className="auth-input"
                value={edu.degree}
                onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                placeholder="B.Tech Computer Science"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">
                Institute
              </label>
              <input
                className="auth-input"
                value={edu.institute}
                onChange={(e) =>
                  updateEducation(idx, "institute", e.target.value)
                }
                placeholder="ABC University"
              />
            </div>
          </div>

          {/* FROM & TO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">From</label>
              <input
                className="auth-input"
                value={edu.from}
                onChange={(e) => updateEducation(idx, "from", e.target.value)}
                placeholder="2020"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">To</label>
              <input
                className="auth-input"
                value={edu.to}
                onChange={(e) => updateEducation(idx, "to", e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>
        </div>
      ))}

      {/* ===== ADD BUTTON (WHEN LIST EXISTS) ===== */}
      {resumeData.education.length > 0 && (
        <button
          onClick={() => {
            setResumeData((prev) => ({
              ...prev,
              education: [
                ...prev.education,
                {
                  degree: "",
                  institute: "",
                  from: "",
                  to: "",
                },
              ],
            }));
          }}
          className="flex items-center justify-center gap-2 w-full py-2
                   rounded-lg border border-dashed border-[#cbd5e1]
                   text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
        >
          <Plus className="w-4 h-4" />
          Add another education
        </button>
      )}
    </div>
  );
};

export default Education;
