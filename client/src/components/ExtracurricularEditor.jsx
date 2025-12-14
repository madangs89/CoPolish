import { Plus, Trash2 } from "lucide-react";

const ExtracurricularEditor = ({ data, onChange }) => {
  const updateField = (idx, field, value) => {
    const updated = [...data];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    onChange(updated);
  };

  const addActivity = () => {
    onChange([
      ...data,
      {
        role: "",
        activity: "",
        year: "",
        description: "",
      },
    ]);
  };

  const deleteActivity = (idx) => {
    onChange(data.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-[#1f2430]">
          Extra-Curricular Activities
        </h3>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Highlight leadership, teamwork, or community involvement.
        </p>
      </div>

      {data.map((item, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-[#e6e6e6] p-6 bg-white space-y-4"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[#1f2430]">Activity {idx + 1}</h4>
            <button
              type="button"
              onClick={() => deleteActivity(idx)}
              className="text-red-500 hover:text-red-600"
              title="Delete activity"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* ROLE & ACTIVITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Role</label>
              <input
                className="auth-input"
                value={item.role}
                onChange={(e) => updateField(idx, "role", e.target.value)}
                placeholder="Team Lead"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">
                Activity / Organization
              </label>
              <input
                className="auth-input"
                value={item.activity}
                onChange={(e) => updateField(idx, "activity", e.target.value)}
                placeholder="Coding Club"
              />
            </div>
          </div>

          {/* YEAR */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">Year</label>
            <input
              className="auth-input"
              value={item.year}
              onChange={(e) => updateField(idx, "year", e.target.value)}
              placeholder="2022 – 2023"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">Description</label>
            <textarea
              rows={3}
              className="auth-input"
              value={item.description}
              onChange={(e) => updateField(idx, "description", e.target.value)}
              placeholder="What you did, impact, responsibilities"
            />
          </div>
        </div>
      ))}

      {/* ADD ACTIVITY */}
      <button
        type="button"
        onClick={addActivity}
        className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-50"
      >
        <Plus size={16} />
        Add Activity
      </button>
    </div>
  );
};

export default ExtracurricularEditor;
