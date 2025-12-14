import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const ProjectsEditor = ({ data, onChange }) => {
  const [newBullet, setNewBullet] = useState({});
  const [newTech, setNewTech] = useState({});

  /* ---------------- HELPERS ---------------- */

  const updateField = (projIndex, field, value) => {
    const updated = [...data];
    updated[projIndex] = {
      ...updated[projIndex],
      [field]: value,
    };
    onChange(updated);
  };

  const addBullet = (projIndex) => {
    const value = newBullet[projIndex]?.trim();
    if (!value) return;

    const updated = [...data];
    const bullets = [
      ...updated[projIndex].description,
      value,
    ];

    updated[projIndex] = {
      ...updated[projIndex],
      description: bullets,
    };

    onChange(updated);
    setNewBullet((p) => ({ ...p, [projIndex]: "" }));
  };

  const updateBullet = (projIndex, bulletIndex, value) => {
    const updated = [...data];
    const bullets = [...updated[projIndex].description];

    bullets[bulletIndex] = value;

    updated[projIndex] = {
      ...updated[projIndex],
      description: bullets,
    };

    onChange(updated);
  };

  const deleteBullet = (projIndex, bulletIndex) => {
    const updated = [...data];
    const bullets = updated[projIndex].description.filter(
      (_, i) => i !== bulletIndex
    );

    updated[projIndex] = {
      ...updated[projIndex],
      description: bullets,
    };

    onChange(updated);
  };

  const addTech = (projIndex) => {
    const value = newTech[projIndex]?.trim();
    if (!value) return;

    const updated = [...data];
    const techs = [
      ...updated[projIndex].technologies,
      value,
    ];

    updated[projIndex] = {
      ...updated[projIndex],
      technologies: techs,
    };

    onChange(updated);
    setNewTech((p) => ({ ...p, [projIndex]: "" }));
  };

  const deleteTech = (projIndex, techIndex) => {
    const updated = [...data];
    const techs = updated[projIndex].technologies.filter(
      (_, i) => i !== techIndex
    );

    updated[projIndex] = {
      ...updated[projIndex],
      technologies: techs,
    };

    onChange(updated);
  };

  const addProject = () => {
    onChange([
      ...data,
      {
        title: "",
        description: [],
        technologies: [],
        link: "",
      },
    ]);
  };

  const deleteProject = (projIndex) => {
    onChange(data.filter((_, i) => i !== projIndex));
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {data.map((proj, projIndex) => (
        <div
          key={projIndex}
          className="rounded-2xl border border-[#e6e6e6] p-6 bg-white space-y-5"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1f2430]">
              Project {projIndex + 1}
            </h3>
            <button
              type="button"
              onClick={() => deleteProject(projIndex)}
              className="text-red-500 hover:text-red-600"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* TITLE */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">Project Title</label>
            <input
              className="auth-input"
              value={proj.title}
              onChange={(e) =>
                updateField(projIndex, "title", e.target.value)
              }
              placeholder="AI Resume Analyzer"
            />
          </div>

          {/* LINK */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">
              Project Link (GitHub / Live)
            </label>
            <input
              className="auth-input"
              value={proj.link}
              onChange={(e) =>
                updateField(projIndex, "link", e.target.value)
              }
              placeholder="https://github.com/username/project"
            />
          </div>

          {/* DESCRIPTION BULLETS */}
          <div className="space-y-3">
            <label className="text-xs text-[#6b6b6b]">
              Key Highlights
            </label>

            {proj.description.map((bullet, bulletIndex) => (
              <div
                key={bulletIndex}
                className="flex items-center gap-2"
              >
                <input
                  className="auth-input flex-1"
                  value={bullet}
                  onChange={(e) =>
                    updateBullet(
                      projIndex,
                      bulletIndex,
                      e.target.value
                    )
                  }
                  placeholder={`Achievement ${bulletIndex + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    deleteBullet(projIndex, bulletIndex)
                  }
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* ADD BULLET */}
            <div className="flex gap-2">
              <textarea
                rows={2}
                className="w-full p-2 rounded-md border outline-none text-sm"
                placeholder="Add project highlight"
                value={newBullet[projIndex] || ""}
                onChange={(e) =>
                  setNewBullet((p) => ({
                    ...p,
                    [projIndex]: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() => addBullet(projIndex)}
                className="px-3 rounded-md bg-black text-white"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* TECHNOLOGIES */}
          <div className="space-y-2">
            <label className="text-xs text-[#6b6b6b]">
              Technologies Used
            </label>

            <div className="flex flex-wrap gap-2">
              {proj.technologies.map((tech, techIndex) => (
                <div
                  key={techIndex}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full border bg-white text-sm"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() =>
                      deleteTech(projIndex, techIndex)
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD TECH */}
            <div className="flex gap-2">
              <input
                className="auth-input flex-1"
                placeholder="Add technology (e.g. React)"
                value={newTech[projIndex] || ""}
                onChange={(e) =>
                  setNewTech((p) => ({
                    ...p,
                    [projIndex]: e.target.value,
                  }))
                }
              />
              <button
                type="button"
                onClick={() => addTech(projIndex)}
                className="px-4 rounded-md bg-black text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ADD PROJECT */}
      <button
        type="button"
        onClick={addProject}
        className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-50"
      >
        <Plus size={16} />
        Add Project
      </button>
    </div>
  );
};

export default ProjectsEditor;
