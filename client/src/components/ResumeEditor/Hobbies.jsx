import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const Hobbies = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
  handleIsAllFieldsFilled,
}) => {
  const [input, setInput] = useState("");

  const isCompleted = handleIsAllFieldsFilled(resumeData.hobbies);

  /* ---------- ADD HOBBY ---------- */
  const addHobby = () => {
    const value = input.trim();
    if (!value) return;

    setResumeData((prev) => ({
      ...prev,
      hobbies: [...prev.hobbies, value],
    }));

    setInput("");
  };

  /* ---------- UPDATE HOBBY ---------- */
  const updateHobby = (index, value) => {
    const updated = [...resumeData.hobbies];
    updated[index] = value;

    setResumeData((prev) => ({
      ...prev,
      hobbies: updated,
    }));
  };

  /* ---------- DELETE HOBBY ---------- */
  const deleteHobby = (index) => {
    const updated = resumeData.hobbies.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      hobbies: updated,
    }));
  };

  /* ---------- UI ---------- */
  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
    ${
      selectedSection.includes("hobbies")
        ? "bg-white border  rounded-t-xl"
        : "bg-white border border-gray-200 rounded-xl"
    }
    hover:bg-zinc-100 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("hobbies")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "hobbies"]);
              } else {
                setCheckedFields((prev) => prev.filter((f) => f !== "hobbies"));
              }
            }}
            className="w-3.5 h-3.5 accent-[#374151] "
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("hobbies")
                  ? prev.filter((s) => s !== "hobbies")
                  : [...prev, "hobbies"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Hobbies Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("hobbies")
                ? prev.filter((s) => s !== "hobbies")
                : [...prev, "hobbies"]
            );
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isCompleted
                ? "text-blue-500 bg-blue-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {isCompleted ? "Completed" : "Incomplete"}
          </span>
          {selectedSection.includes("hobbies") ? (
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
      selectedSection.includes("hobbies")
        ? " h-fit p-4  opacity-100"
        : "max-h-0 opacity-0"
    }`}
      >
        {" "}
        <div className="space-y-5">
          {/* HEADER */}
          <div>
            <h3 className="text-sm font-semibold text-[#1f2430]">Hobbies</h3>
            <p className="text-xs text-[#6b6b6b] mt-1">
              Add hobbies or interests that reflect your personality.
            </p>
          </div>

          {/* EMPTY STATE */}
          {resumeData.hobbies.length === 0 && (
            <div
              className="rounded-xl border border-dashed border-[#d1d5db]
                     bg-[#fafafa] p-5 text-center space-y-3"
            >
              <p className="text-sm font-medium text-[#1f2430]">
                No hobbies added yet
              </p>
              <p className="text-xs text-[#6b6b6b]">
                Adding hobbies can make your profile more human
              </p>
            </div>
          )}

          {/* HOBBIES LIST */}
          <div className="space-y-3">
            {resumeData.hobbies.map((hobby, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="auth-input flex-1"
                  value={hobby}
                  onChange={(e) => updateHobby(index, e.target.value)}
                  placeholder={`Hobby ${index + 1}`}
                />

                <button
                  type="button"
                  onClick={() => deleteHobby(index)}
                  className="p-1.5 rounded hover:bg-red-50 transition"
                  title="Delete hobby"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* ADD NEW HOBBY */}
          <div className="flex gap-2">
            <input
              type="text"
              className="auth-input flex-1"
              placeholder="Add a new hobby (e.g. Photography)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addHobby();
                }
              }}
            />

            <button
              type="button"
              onClick={addHobby}
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

export default Hobbies;
