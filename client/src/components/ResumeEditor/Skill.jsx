import React, { useState } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

const Skill = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
}) => {
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    // prevent duplicates (case-insensitive)
    const exists = resumeData.skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );
    if (exists) {
      setSkillInput("");
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkillInput("");
  };

  const deleteSkill = (index) => {
    const updated = resumeData.skills.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      skills: updated,
    }));
  };

  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
    ${
      selectedSection.includes("skills")
        ? "bg-white border rounded-t-xl"
        : "bg-white border border-gray-200 rounded-xl"
    }
    hover:bg-zinc-100 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("skills")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "skills"]);
              } else {
                setCheckedFields((prev) => prev.filter((f) => f !== "skills"));
              }
            }}
            className="w-3.5 h-3.5 accent-[#374151]"
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("skills")
                  ? prev.filter((s) => s !== "skills")
                  : [...prev, "skills"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Skills Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("skills")
                ? prev.filter((s) => s !== "skills")
                : [...prev, "skills"]
            );
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <span className="text-xs font-medium text-[#374151] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
            Completed
          </span>
          {selectedSection.includes("skills") ? (
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
      selectedSection.includes("skills")
        ? "md:max-h-[600px] h-fit p-4  opacity-100"
        : "max-h-0 opacity-0"
    }`}
      >
        <div className="space-y-5">
          {resumeData.skills.length === 0 && (
            <div
              className="rounded-xl border border-dashed border-[#d1d5db]
                   bg-[#fafafa] p-6 text-center space-y-3"
            >
              <p className="text-sm font-medium text-[#1f2430]">
                No skills added yet
              </p>
              <p className="text-xs text-[#6b6b6b]">
                Add relevant technical or professional skills
              </p>

              {resumeData.skills.length == 0 && (
                <input
                  type="text"
                  className="auth-input flex-1"
                  placeholder="Add a skill (e.g. React, Node.js)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
              )}

              <button
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className={`inline-flex items-center gap-2 px-4 py-2
            rounded-lg text-sm font-medium transition
            ${
              skillInput.trim()
                ? "bg-[#025149] text-white hover:opacity-90"
                : "bg-[#e5e7eb] text-[#9aa0aa]"
            }`}
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
          )}

          {/* ===== SKILLS LIST ===== */}
          {resumeData.skills.map((skill, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#e6e6e6]
                   bg-white p-4 flex items-center justify-between"
            >
              <p className="text-sm text-[#1f2430]">{skill}</p>

              <button
                onClick={() => deleteSkill(index)}
                className="p-1.5 rounded hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          ))}

          {/* ===== ADD SKILL INPUT ===== */}
          {resumeData.skills.length > 0 && (
            <div className="flex gap-2">
              <input
                type="text"
                className="auth-input flex-1"
                placeholder="Add a skill (e.g. React, Node.js)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />

              <button
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className={`h-10 px-4 rounded-lg text-sm font-medium
            flex items-center gap-1 transition
            ${
              skillInput.trim()
                ? "bg-[#025149] text-white hover:opacity-90"
                : "bg-[#e5e7eb] text-[#9aa0aa] cursor-not-allowed"
            }`}
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skill;
