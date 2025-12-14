import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const SkillsEditor = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  /* ---------- HELPERS ---------- */

  const addSkill = () => {
    const skill = input.trim();
    if (!skill) return;

    // prevent duplicates (case-insensitive)
    const exists = data.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );
    if (exists) {
      setInput("");
      return;
    }

    onChange([...data, skill]);
    setInput("");
  };

  const removeSkill = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-4">
      {/* LABEL */}
      <div>
        <label className="text-sm font-medium text-[#1f2430]">
          Skills
        </label>
        <p className="text-xs text-[#6b6b6b] mt-1">
          Add relevant technical or professional skills.
        </p>
      </div>

      {/* EXISTING SKILLS */}
      <div className="flex flex-wrap gap-2">
        {data.length > 0 ? (
          data.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-sm"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-red-500 hover:text-red-600"
                title="Remove skill"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#9ca3af]">
            No skills added yet
          </p>
        )}
      </div>

      {/* ADD NEW SKILL */}
      <div className="flex gap-2">
        <input
          type="text"
          className="auth-input flex-1"
          placeholder="Add a skill (e.g. React, Node.js)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-4 rounded-md bg-black text-white flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
};

export default SkillsEditor;
