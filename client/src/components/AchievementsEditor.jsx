import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const AchievementsEditor = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  /* ---------- HELPERS ---------- */

  const addAchievement = () => {
    const value = input.trim();
    if (!value) return;

    onChange([...data, value]);
    setInput("");
  };

  const updateAchievement = (index, value) => {
    const updated = [...data];
    updated[index] = value;
    onChange(updated);
  };

  const deleteAchievement = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-[#1f2430]">Achievements</h3>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Highlight awards, recognitions, or measurable accomplishments.
        </p>
      </div>

      {/* ACHIEVEMENT LIST */}
      <div className="space-y-3">
        {data.length > 0 ? (
          data.map((achievement, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                className="auth-input flex-1"
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                placeholder={`Achievement ${index + 1}`}
              />

              <button
                type="button"
                onClick={() => deleteAchievement(index)}
                className="p-2 rounded-md border hover:bg-red-50 text-red-500"
                title="Delete achievement"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#9ca3af]">No achievements added yet</p>
        )}
      </div>

      {/* ADD NEW ACHIEVEMENT */}
      <div className="flex gap-2">
        <input
          type="text"
          className="auth-input flex-1"
          placeholder="Add a new achievement"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addAchievement();
            }
          }}
        />

        <button
          type="button"
          onClick={addAchievement}
          className="px-4 rounded-md bg-black text-white flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
};

export default AchievementsEditor;
