import React, { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const Project = ({ resumeData, setResumeData }) => {
  const [projectBulletState, setProjectBulletState] = useState({});
  const [projectTechState, setProjectTechState] = useState({});
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: [],
          technologies: [],
          link: "",
        },
      ],
    }));
  };

  const deleteProject = (projIndex) => {
    const updated = resumeData.projects.filter(
      (_, index) => index !== projIndex
    );

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const updateProject = (projIndex, field, value) => {
    const updated = [...resumeData.projects];

    updated[projIndex] = {
      ...updated[projIndex],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const addProjectBullet = (projIndex) => {
    const bullet = projectBulletState[projIndex]?.trim();
    if (!bullet) return;

    const updated = [...resumeData.projects];

    updated[projIndex] = {
      ...updated[projIndex],
      description: [...updated[projIndex].description, bullet],
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));

    setProjectBulletState((prev) => ({
      ...prev,
      [projIndex]: "",
    }));
  };

  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    const updated = [...resumeData.projects];
    const bullets = [...updated[projIndex].description];

    bullets[bulletIndex] = value;

    updated[projIndex] = {
      ...updated[projIndex],
      description: bullets,
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const deleteProjectBullet = (projIndex, bulletIndex) => {
    const updated = [...resumeData.projects];
    const bullets = updated[projIndex].description.filter(
      (_, i) => i !== bulletIndex
    );

    updated[projIndex] = {
      ...updated[projIndex],
      description: bullets,
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const addProjectTech = (projIndex) => {
    const tech = projectTechState[projIndex]?.trim();
    if (!tech) return;

    const updated = [...resumeData.projects];

    updated[projIndex] = {
      ...updated[projIndex],
      technologies: [...updated[projIndex].technologies, tech],
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));

    setProjectTechState((prev) => ({
      ...prev,
      [projIndex]: "",
    }));
  };

  const deleteProjectTech = (projIndex, techIndex) => {
    const updated = [...resumeData.projects];
    const techs = updated[projIndex].technologies.filter(
      (_, i) => i !== techIndex
    );

    updated[projIndex] = {
      ...updated[projIndex],
      technologies: techs,
    };

    setResumeData((prev) => ({
      ...prev,
      projects: updated,
    }));
  };
  return (
    <div className="space-y-5">
      {/* ===== EMPTY STATE ===== */}
      {resumeData.projects.length === 0 && (
        <div
          className="rounded-xl border border-dashed border-[#d1d5db]
                      bg-[#fafafa] p-6 text-center space-y-3"
        >
          <p className="text-sm font-medium text-[#1f2430]">
            No projects added yet
          </p>
          <p className="text-xs text-[#6b6b6b]">
            Add projects to showcase your work
          </p>

          <button
            onClick={addProject}
            className="inline-flex items-center gap-2 px-4 py-2
                     rounded-lg bg-[#025149] text-white
                     text-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      )}

      {/* ===== PROJECT LIST ===== */}
      {resumeData.projects.map((proj, projIndex) => (
        <div
          key={projIndex}
          className="rounded-xl border border-[#e6e6e6]
                   bg-white p-5 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1f2430]">
              Project {projIndex + 1}
            </h3>

            <button
              onClick={() => deleteProject(projIndex)}
              className="p-1.5 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Project Title
            </label>
            <input
              className="auth-input"
              value={proj.title}
              onChange={(e) =>
                updateProject(projIndex, "title", e.target.value)
              }
              placeholder="AI Resume Analyzer"
            />
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Project Link
            </label>
            <input
              className="auth-input"
              value={proj.link}
              onChange={(e) => updateProject(projIndex, "link", e.target.value)}
              placeholder="https://github.com/username/project"
            />
          </div>

          {/* Bullets */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Key Highlights
            </label>

            {proj.description.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex gap-2 items-center">
                <input
                  className="auth-input flex-1"
                  value={bullet}
                  onChange={(e) =>
                    updateProjectBullet(projIndex, bulletIndex, e.target.value)
                  }
                  placeholder={`Highlight ${bulletIndex + 1}`}
                />

                <button
                  onClick={() => deleteProjectBullet(projIndex, bulletIndex)}
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
              placeholder="Add a project highlight"
              value={projectBulletState[projIndex] || ""}
              onChange={(e) =>
                setProjectBulletState((prev) => ({
                  ...prev,
                  [projIndex]: e.target.value,
                }))
              }
            />

            <button
              onClick={() => addProjectBullet(projIndex)}
              className="h-10 px-4 rounded-lg bg-[#025149]
                       text-white text-sm font-medium
                       hover:opacity-90 transition"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#6b6b6b]">
              Technologies Used
            </label>

            <div className="flex flex-wrap gap-2">
              {proj.technologies.map((tech, techIndex) => (
                <div
                  key={techIndex}
                  className="flex items-center gap-2 px-3 py-1.5
                           rounded-full border border-[#e5e7eb]
                           bg-white text-sm"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => deleteProjectTech(projIndex, techIndex)}
                    className="p-0.5 rounded hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Tech */}
            <div className="flex gap-2">
              <input
                className="auth-input flex-1"
                placeholder="Add technology (e.g. React)"
                value={projectTechState[projIndex] || ""}
                onChange={(e) =>
                  setProjectTechState((prev) => ({
                    ...prev,
                    [projIndex]: e.target.value,
                  }))
                }
              />

              <button
                onClick={() => addProjectTech(projIndex)}
                className="h-10 px-4 rounded-lg bg-[#025149]
                         text-white text-sm font-medium
                         hover:opacity-90 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* ===== ADD PROJECT BUTTON ===== */}
      {resumeData.projects.length > 0 && (
        <button
          onClick={addProject}
          className="w-full py-2 flex items-center justify-center gap-2
                   rounded-lg border border-dashed border-[#cbd5e1]
                   text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
        >
          <Plus className="w-4 h-4" />
          Add another project
        </button>
      )}
    </div>
  );
};

export default Project;
