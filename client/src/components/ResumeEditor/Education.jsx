import React from "react";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

const Education = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
}) => {
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
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
    ${
      selectedSection.includes("education")
        ? "bg-green-50 border border-green-200 rounded-t-xl"
        : "bg-white border border-gray-200 rounded-xl"
    }
    hover:bg-green-50 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("education")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "education"]);
              } else {
                setCheckedFields((prev) =>
                  prev.filter((f) => f !== "education")
                );
              }
            }}
            className="w-3.5 h-3.5 accent-green-600 "
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("education")
                  ? prev.filter((s) => s !== "education")
                  : [...prev, "education"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Education Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("education")
                ? prev.filter((s) => s !== "education")
                : [...prev, "education"]
            );
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            Completed
          </span>
          {selectedSection.includes("education") ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className={`grid overflow-hidden w-full grid-cols-1 gap-4
    transition-all duration-300 ease-in-out
    ${
      selectedSection.includes("education")
        ? "md:max-h-[600px] h-fit p-4  opacity-100"
        : "max-h-0 opacity-0"
    }`}
      >
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
            className="rounded-xl  border-[#e6e6e6] bg-white space-y-4"
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
                  onChange={(e) =>
                    updateEducation(idx, "degree", e.target.value)
                  }
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
                <label className="text-xs font-medium text-[#6b6b6b]">
                  From
                </label>
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
    </div>
  );
};

export default Education;
