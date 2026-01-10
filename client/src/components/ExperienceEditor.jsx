import { useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const ExperienceEditor = ({ data, onChange }) => {
  // temp input for new bullets (keyed by experience index)
  const [newBullet, setNewBullet] = useState({});

  /* ---------------- HELPERS ---------------- */

  const updateField = (expIndex, field, value) => {
    const updated = [...data];
    updated[expIndex] = {
      ...updated[expIndex],
      [field]: value,
    };
    onChange(updated);
  };

  const updateBullet = (expIndex, bulletIndex, value) => {
    const updated = [...data];
    const bullets = [...updated[expIndex].description];

    bullets[bulletIndex] = value;

    updated[expIndex] = {
      ...updated[expIndex],
      description: bullets,
    };

    onChange(updated);
  };

  const deleteBullet = (expIndex, bulletIndex) => {
    const updated = [...data];
    const bullets = updated[expIndex].description.filter(
      (_, i) => i !== bulletIndex
    );

    updated[expIndex] = {
      ...updated[expIndex],
      description: bullets,
    };

    onChange(updated);
  };

  const addBullet = (expIndex) => {
    const value = newBullet[expIndex]?.trim();
    if (!value) return;

    const updated = [...data];
    const bullets = [...updated[expIndex].description, value];

    updated[expIndex] = {
      ...updated[expIndex],
      description: bullets,
    };

    onChange(updated);
    setNewBullet((p) => ({ ...p, [expIndex]: "" }));
  };

  /* 🆕 ADD EXPERIENCE */
  const addExperience = () => {
    onChange([
      ...data,
      {
        role: "",
        company: "",
        from: "",
        to: "",
        duration: "",
        description: [],
      },
    ]);
  };

  /* 🆕 DELETE EXPERIENCE */
  const deleteExperience = (expIndex) => {
    onChange(data.filter((_, i) => i !== expIndex));
  };

  /* ---------------- UI ---------------- */

  useEffect(() => {
    if (data.length === 0) {
      onChange([
        {
          role: "",
          company: "",
          from: "",
          to: "",
          duration: "",
          description: [],
        },
      ]);
    }
  }, []);

  return (
    <div className="space-y-8">
      {data.map((exp, expIndex) => (
        <div
          key={expIndex}
          className="rounded-2xl border border-[#e6e6e6] p-6 bg-white space-y-5"
        >
          {/* ---------- HEADER ---------- */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1f2430]">
              Experience {expIndex + 1}
            </h3>

            {/* 🆕 DELETE EXPERIENCE */}
            <button
              type="button"
              onClick={() => deleteExperience(expIndex)}
              className="text-red-500 hover:text-red-600"
              title="Delete experience"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* ---------- ROLE & COMPANY ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Role</label>
              <input
                className="auth-input"
                value={exp.role}
                onChange={(e) =>
                  updateField(expIndex, "role", e.target.value)
                }
                placeholder="Frontend Developer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Company</label>
              <input
                className="auth-input"
                value={exp.company}
                onChange={(e) =>
                  updateField(expIndex, "company", e.target.value)
                }
                placeholder="XYZ Corp"
              />
            </div>
          </div>

          {/* ---------- DURATION ---------- */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">Duration</label>
            <input
              className="auth-input"
              value={exp.duration}
              onChange={(e) =>
                updateField(expIndex, "duration", e.target.value)
              }
              placeholder="2 years 3 months"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">From</label>
              <input
                className="auth-input"
                value={exp.from}
                type="number"
                onChange={(e) =>
                  updateField(expIndex, "from", e.target.value)
                }
                placeholder="From"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">To</label>
              <input
                className="auth-input"
                value={exp.to}
                type="number"
                onChange={(e) =>
                  updateField(expIndex, "to", e.target.value)
                }
                placeholder="To"
              />
            </div>
          </div>

          {/* ---------- DESCRIPTION BULLETS ---------- */}
          <div className="flex flex-col gap-3">
            <label className="text-xs text-[#6b6b6b]">
              Key Contributions / Achievements
            </label>

            {exp.description.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-center gap-2">
                <input
                  className="auth-input flex-1"
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(
                      expIndex,
                      bulletIndex,
                      e.target.value
                    )
                  }
                  placeholder={`Achievement ${bulletIndex + 1}`}
                />

                <button
                  type="button"
                  onClick={() =>
                    deleteBullet(expIndex, bulletIndex)
                  }
                  className="p-2 rounded-md border hover:bg-red-50 text-red-500"
                  title="Delete bullet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* ---------- ADD NEW BULLET ---------- */}
          <div className="flex gap-2 items-start">
            <textarea
              rows={2}
              className="w-full p-2 rounded-md border outline-none text-sm"
              placeholder="Add a new achievement bullet"
              value={newBullet[expIndex] || ""}
              onChange={(e) =>
                setNewBullet((p) => ({
                  ...p,
                  [expIndex]: e.target.value,
                }))
              }
            />

            <button
              type="button"
              onClick={() => addBullet(expIndex)}
              className="h-10 px-3 rounded-md bg-black text-white flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
      ))}

      {/* 🆕 ADD EXPERIENCE */}
      <button
        type="button"
        onClick={addExperience}
        className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-50"
      >
        <Plus size={16} />
        Add Experience
      </button>
    </div>
  );
};

export default ExperienceEditor;
