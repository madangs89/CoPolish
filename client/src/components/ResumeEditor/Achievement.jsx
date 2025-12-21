import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const Achievement = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
}) => {
  const [input, setInput] = useState("");

  /* ---------- ADD ACHIEVEMENT ---------- */
  const addAchievement = () => {
    const value = input.trim();
    if (!value) return;

    setResumeData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, value],
    }));

    setInput("");
  };

  /* ---------- UPDATE ACHIEVEMENT ---------- */
  const updateAchievement = (index, value) => {
    const updated = [...resumeData.achievements];
    updated[index] = value;

    setResumeData((prev) => ({
      ...prev,
      achievements: updated,
    }));
  };

  /* ---------- DELETE ACHIEVEMENT ---------- */
  const deleteAchievement = (index) => {
    const updated = resumeData.achievements.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      achievements: updated,
    }));
  };

  /* ---------- UI ---------- */
  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
    ${
      selectedSection.includes("achievements")
        ? "bg-white border  rounded-t-xl"
        : "bg-white border border-gray-200 rounded-xl"
    }
    hover:bg-zinc-100 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("achievements")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "achievements"]);
              } else {
                setCheckedFields((prev) =>
                  prev.filter((f) => f !== "achievements")
                );
              }
            }}
            className="w-3.5 h-3.5 accent-[#374151] "
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("achievements")
                  ? prev.filter((s) => s !== "achievements")
                  : [...prev, "achievements"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Achievements Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("achievements")
                ? prev.filter((s) => s !== "achievements")
                : [...prev, "achievements"]
            );
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <span className="text-xs font-medium text-[#374151] bg-[#F3F4F6] px-2 py-0.5 rounded-full">
            Completed
          </span>
          {selectedSection.includes("achievements") ? (
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
      selectedSection.includes("achievements")
        ? "md:max-h-[600px] h-fit p-4  opacity-100"
        : "max-h-0 opacity-0"
    }`}
      >
        {" "}
        <div className="space-y-5">
          {/* HEADER */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f2430]">
              Achievements
            </h3>
            <p className="text-xs text-[#6b6b6b] mt-1">
              Highlight awards, recognitions, or measurable accomplishments.
            </p>
          </div>

          {/* EMPTY STATE */}
          {resumeData.achievements.length === 0 && (
            <div
              className="rounded-xl border border-dashed border-[#d1d5db]
                     bg-[#fafafa] p-5 text-center space-y-3"
            >
              <p className="text-sm font-medium text-[#1f2430]">
                No achievements added yet
              </p>
              <p className="text-xs text-[#6b6b6b]">
                Add achievements to strengthen your profile
              </p>
            </div>
          )}

          {/* ACHIEVEMENT LIST */}
          <div className="space-y-3">
            {resumeData.achievements.map((achievement, index) => (
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
                  className="p-1.5 rounded hover:bg-red-50 transition"
                  title="Delete achievement"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            ))}
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
              disabled={!input.trim()}
              className={`h-10 px-4 rounded-lg text-sm font-medium
            flex items-center gap-1 transition
            ${
              input.trim()
                ? "bg-[#025149] text-white hover:opacity-90"
                : "bg-[#e5e7eb] text-[#9aa0aa] cursor-not-allowed"
            }`}
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;
