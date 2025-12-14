import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const HobbiesEditor = ({ data, onChange }) => {
  const [input, setInput] = useState("");

  const addHobby = () => {
    const value = input.trim();
    if (!value) return;

    // prevent duplicates
    if (data.some((h) => h.toLowerCase() === value.toLowerCase())) {
      setInput("");
      return;
    }

    onChange([...data, value]);
    setInput("");
  };

  const deleteHobby = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-[#1f2430]">
          Hobbies & Interests
        </h3>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Add interests that reflect personality or relevant soft skills.
        </p>
      </div>

      {/* LIST */}
      <div className="flex flex-wrap gap-2">
        {data.length > 0 ? (
          data.map((hobby, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-sm"
            >
              <span>{hobby}</span>
              <button
                type="button"
                onClick={() => deleteHobby(index)}
                className="text-red-500 hover:text-red-600"
                title="Remove hobby"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#9ca3af]">No hobbies added yet</p>
        )}
      </div>

      {/* ADD */}
      <div className="flex gap-2">
        <input
          type="text"
          className="auth-input flex-1"
          placeholder="Add a hobby (e.g. Photography)"
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
          className="px-4 rounded-md bg-black text-white flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
};

export default HobbiesEditor;
