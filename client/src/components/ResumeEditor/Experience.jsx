import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const Experience = ({ resumeData, setResumeData }) => {
  const [newBullet, setNewBullet] = useState({});

  const updateExperienceBullet = (expIndex, bulletIndex, value) => {
    const updated = [...resumeData.experience];
    const bullets = [...updated[expIndex].description];

    bullets[bulletIndex] = value;

    updated[expIndex] = {
      ...updated[expIndex],
      description: bullets,
    };

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const deleteExperienceBullet = (expIndex, bulletIndex) => {
    const updated = [...resumeData.experience];
    const bullets = updated[expIndex].description.filter(
      (_, i) => i !== bulletIndex
    );

    updated[expIndex] = {
      ...updated[expIndex],
      description: bullets,
    };

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const addExperienceBullet = (expIndex) => {
    if (!newBullet[expIndex]?.trim()) return;

    const updated = [...resumeData.experience];

    updated[expIndex] = {
      ...updated[expIndex],
      description: [...updated[expIndex].description, newBullet[expIndex]],
    };

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));

    setNewBullet((prev) => ({
      ...prev,
      [expIndex]: "",
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          role: "",
          company: "",
          duration: "",
          description: [""],
        },
      ],
    }));
  };

  const updateExperience = (expIndex, field, value) => {
    const updated = [...resumeData.experience];

    updated[expIndex] = {
      ...updated[expIndex],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const deleteExperience = (expIndex) => {
    const updated = resumeData.experience.filter(
      (_, index) => index !== expIndex
    );

    setResumeData((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  return (
    <div className="space-y-5">
      {/* ===== EMPTY STATE ===== */}
      {resumeData.experience.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-[#d1d5db]
                      bg-[#fafafa] p-6 text-center space-y-3"
        >
          <p className="text-sm font-medium text-[#1f2430]">
            No experience added yet
          </p>
          <p className="text-xs text-[#6b6b6b]">
            Add your work experience to strengthen your resume
          </p>

          <button
            onClick={addExperience}
            className="inline-flex items-center gap-2 px-4 py-2
                     rounded-lg bg-[#025149] text-white
                     text-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
      )}

      {/* ===== EXPERIENCE LIST ===== */}
      {resumeData.experience.map((exp, expIndex) => (
        <div
          key={expIndex}
          className="rounded-xl border border-[#e6e6e6] bg-white p-5 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1f2430]">
              Experience {expIndex + 1}
            </h3>

            <button
              onClick={() => deleteExperience(expIndex)}
              className="p-1.5 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* Role & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">Role</label>
              <input
                className="auth-input"
                value={exp.role}
                onChange={(e) =>
                  updateExperience(expIndex, "role", e.target.value)
                }
                placeholder="Frontend Developer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#6b6b6b]">
                Company
              </label>
              <input
                className="auth-input"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(expIndex, "company", e.target.value)
                }
                placeholder="XYZ Corp"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Duration
            </label>
            <input
              className="auth-input"
              value={exp.duration}
              onChange={(e) =>
                updateExperience(expIndex, "duration", e.target.value)
              }
              placeholder="Jan 2023 – Dec 2023"
            />
          </div>

          {/* Bullets */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Key Contributions / Achievements
            </label>

            {exp.description.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex gap-2 items-center">
                <input
                  className="auth-input flex-1"
                  value={bullet}
                  onChange={(e) =>
                    updateExperienceBullet(
                      expIndex,
                      bulletIndex,
                      e.target.value
                    )
                  }
                  placeholder={`Achievement ${bulletIndex + 1}`}
                />

                <button
                  onClick={() => deleteExperienceBullet(expIndex, bulletIndex)}
                  className="p-1.5 rounded hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Bullet */}
          <div className="flex gap-2">
            <textarea
              rows={2}
              className="w-full rounded-lg border border-[#e5e7eb]
                       px-3 py-2 text-sm focus:outline-none
                       focus:ring-2 focus:ring-[#025149]/20"
              placeholder="Add a new achievement"
              value={newBullet[expIndex] || ""}
              onChange={(e) =>
                setNewBullet((prev) => ({
                  ...prev,
                  [expIndex]: e.target.value,
                }))
              }
            />

            <button
              onClick={() => addExperienceBullet(expIndex)}
              className="h-10 px-4 rounded-lg bg-[#025149]
                       text-white text-sm font-medium
                       hover:opacity-90 transition"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      ))}

      {/* ===== ADD EXPERIENCE BUTTON ===== */}
      {resumeData.experience.length > 0 && (
        <button
          onClick={addExperience}
          className="w-full py-2 flex items-center justify-center gap-2
                   rounded-lg border border-dashed border-[#cbd5e1]
                   text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
        >
          <Plus className="w-4 h-4" />
          Add another experience
        </button>
      )}
    </div>
  );
};

export default Experience;
