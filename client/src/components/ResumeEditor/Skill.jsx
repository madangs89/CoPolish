import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";


const Skill = ({ resumeData, setResumeData }) => {
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
    <div className="space-y-5">
      {/* ===== EMPTY STATE ===== */}
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
  );
};

export default Skill;
