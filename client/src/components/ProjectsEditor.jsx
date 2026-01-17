import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const ProjectsEditor = ({ data, onChange }) => {
  const [newBullet, setNewBullet] = useState({});
  const [newTech, setNewTech] = useState({});

  /* ---------------- BASIC FIELD ---------------- */

  const updateField = (projIndex, field, value) => {
    const updated = data.map((p, i) =>
      i === projIndex ? { ...p, [field]: value } : p
    );
    onChange(updated);
  };

  /* ---------------- LINKS ---------------- */

  const updateLink = (projIndex, linkIndex, field, value) => {
    const updated = data.map((p, i) => {
      if (i !== projIndex) return p;

      const links = p.link.map((l, j) =>
        j === linkIndex ? { ...l, [field]: value } : l
      );

      return { ...p, link: links };
    });

    onChange(updated);
  };

  const addLink = (projIndex) => {
    const updated = data.map((p, i) =>
      i === projIndex
        ? {
            ...p,
            link: [...p.link, { title: "", url: null }],
          }
        : p
    );

    onChange(updated);
  };

  const deleteLink = (projIndex, linkIndex) => {
    const updated = data.map((p, i) =>
      i === projIndex
        ? {
            ...p,
            link: p.link.filter((_, j) => j !== linkIndex),
          }
        : p
    );

    onChange(updated);
  };

  /* ---------------- BULLETS ---------------- */

  const addBullet = (projIndex) => {
    const value = newBullet[projIndex]?.trim();
    if (!value) return;

    const updated = data.map((p, i) =>
      i === projIndex
        ? { ...p, description: [...p.description, value] }
        : p
    );

    onChange(updated);
    setNewBullet((p) => ({ ...p, [projIndex]: "" }));
  };

  const updateBullet = (projIndex, bulletIndex, value) => {
    const updated = data.map((p, i) =>
      i === projIndex
        ? {
            ...p,
            description: p.description.map((b, j) =>
              j === bulletIndex ? value : b
            ),
          }
        : p
    );

    onChange(updated);
  };

  const deleteBullet = (projIndex, bulletIndex) => {
    const updated = data.map((p, i) =>
      i === projIndex
        ? {
            ...p,
            description: p.description.filter((_, j) => j !== bulletIndex),
          }
        : p
    );

    onChange(updated);
  };

  /* ---------------- TECHNOLOGIES ---------------- */

  const addTech = (projIndex) => {
    const value = newTech[projIndex]?.trim();
    if (!value) return;

    const updated = data.map((p, i) =>
      i === projIndex
        ? { ...p, technologies: [...p.technologies, value] }
        : p
    );

    onChange(updated);
    setNewTech((p) => ({ ...p, [projIndex]: "" }));
  };

  const deleteTech = (projIndex, techIndex) => {
    const updated = data.map((p, i) =>
      i === projIndex
        ? {
            ...p,
            technologies: p.technologies.filter((_, j) => j !== techIndex),
          }
        : p
    );

    onChange(updated);
  };

  /* ---------------- PROJECT ---------------- */

  const addProject = () => {
    onChange([
      ...data,
      {
        title: "",
        description: [],
        technologies: [],
        link: [{ title: "", url: null }],
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
          className="rounded-2xl border p-6 bg-white space-y-5"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Project {projIndex + 1}</h3>
            <button onClick={() => deleteProject(projIndex)}>
              <Trash2 className="text-red-500" size={18} />
            </button>
          </div>

          {/* TITLE */}
          <input
            className="auth-input"
            placeholder="Project Title"
            value={proj.title}
            onChange={(e) =>
              updateField(projIndex, "title", e.target.value)
            }
          />

          {/* LINKS */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Project Links</label>

            {proj.link.map((l, linkIndex) => (
              <div key={linkIndex} className="flex gap-2">
                <input
                  className="auth-input flex-1"
                  placeholder="Link title"
                  value={l.title}
                  onChange={(e) =>
                    updateLink(
                      projIndex,
                      linkIndex,
                      "title",
                      e.target.value
                    )
                  }
                />
                <input
                  className="auth-input flex-1"
                  placeholder="https://example.com"
                  value={l.url ?? ""}
                  onChange={(e) =>
                    updateLink(
                      projIndex,
                      linkIndex,
                      "url",
                      e.target.value
                    )
                  }
                />
                <button
                  onClick={() => deleteLink(projIndex, linkIndex)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}

            <button
              onClick={() => addLink(projIndex)}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              <Plus size={14} /> Add link
            </button>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Key Highlights</label>

            {proj.description.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="auth-input flex-1"
                  value={b}
                  onChange={(e) =>
                    updateBullet(projIndex, i, e.target.value)
                  }
                />
                <button onClick={() => deleteBullet(projIndex, i)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <textarea
                rows={2}
                className="w-full border rounded p-2"
                value={newBullet[projIndex] || ""}
                onChange={(e) =>
                  setNewBullet((p) => ({
                    ...p,
                    [projIndex]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => addBullet(projIndex)}
                className="bg-black text-white px-3 rounded"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* TECHNOLOGIES */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">Technologies</label>

            <div className="flex flex-wrap gap-2">
              {proj.technologies.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border rounded-full flex items-center gap-1"
                >
                  {t}
                  <button onClick={() => deleteTech(projIndex, i)}>
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                className="auth-input flex-1"
                value={newTech[projIndex] || ""}
                onChange={(e) =>
                  setNewTech((p) => ({
                    ...p,
                    [projIndex]: e.target.value,
                  }))
                }
              />
              <button
                onClick={() => addTech(projIndex)}
                className="bg-black text-white px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="flex items-center gap-2 border rounded-full px-5 py-2"
      >
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
};

export default ProjectsEditor;
