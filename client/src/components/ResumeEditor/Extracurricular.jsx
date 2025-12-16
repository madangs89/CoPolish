import { Plus, Trash2 } from "lucide-react";

const Extracurricular = ({ resumeData, setResumeData }) => {
  /* ---------- ADD ACTIVITY ---------- */
  const addActivity = () => {
    setResumeData((prev) => ({
      ...prev,
      extracurricular: [
        ...prev.extracurricular,
        {
          role: "",
          activity: "",
          year: "",
          description: "",
        },
      ],
    }));
  };

  /* ---------- UPDATE ACTIVITY ---------- */
  const updateActivity = (index, field, value) => {
    const updated = [...resumeData.extracurricular];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      extracurricular: updated,
    }));
  };

  /* ---------- DELETE ACTIVITY ---------- */
  const deleteActivity = (index) => {
    const updated = resumeData.extracurricular.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      extracurricular: updated,
    }));
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div>
        <h3 className="text-sm font-semibold text-[#1f2430]">
          Extracurricular Activities
        </h3>
        <p className="text-xs text-[#6b6b6b] mt-1">
          Leadership roles, clubs, volunteering, or non-academic activities.
        </p>
      </div>

      {/* EMPTY STATE */}
      {resumeData.extracurricular.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-[#d1d5db]
                     bg-[#fafafa] p-5 text-center space-y-3"
        >
          <p className="text-sm font-medium text-[#1f2430]">
            No extracurricular activities added
          </p>
          <p className="text-xs text-[#6b6b6b]">
            Add activities that show leadership or initiative
          </p>

          <button
            onClick={addActivity}
            className="inline-flex items-center gap-2 px-4 py-2
                       rounded-lg bg-[#025149] text-white
                       text-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      )}

      {/* ACTIVITY LIST */}
      {resumeData.extracurricular.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#e6e6e6]
                     bg-white p-5 space-y-4"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#1f2430]">
              Activity {index + 1}
            </h4>

            <button
              onClick={() => deleteActivity(index)}
              className="p-1.5 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* ROLE & ACTIVITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">Role</label>
              <input
                className="auth-input"
                value={item.role}
                onChange={(e) => updateActivity(index, "role", e.target.value)}
                placeholder="Team Lead / Volunteer / Member"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">
                Activity / Organization
              </label>
              <input
                className="auth-input"
                value={item.activity}
                onChange={(e) =>
                  updateActivity(index, "activity", e.target.value)
                }
                placeholder="Coding Club / NSS / Sports Team"
              />
            </div>
          </div>

          {/* YEAR */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Year / Duration
            </label>
            <input
              className="auth-input"
              value={item.year}
              onChange={(e) => updateActivity(index, "year", e.target.value)}
              placeholder="2022 – 2024"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Description
            </label>
            <textarea
              rows={2}
              className="w-full rounded-lg border border-[#e5e7eb]
                         px-3 py-2 text-sm focus:outline-none
                         focus:ring-2 focus:ring-[#025149]/20"
              value={item.description}
              onChange={(e) =>
                updateActivity(index, "description", e.target.value)
              }
              placeholder="Briefly describe your contribution or impact"
            />
          </div>
        </div>
      ))}

      {/* ADD ANOTHER */}
      {resumeData.extracurricular.length > 0 && (
        <button
          onClick={addActivity}
          className="w-full py-2 flex items-center justify-center gap-2
                     rounded-lg border border-dashed border-[#cbd5e1]
                     text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
        >
          <Plus className="w-4 h-4" />
          Add another activity
        </button>
      )}
    </div>
  );
};

export default Extracurricular;
