import React, { useState } from "react";
import EditorScoreBox from "../components/EditorScoreBox";
import { Trash2, Plus } from "lucide-react";
const ResumeEditor = () => {
  const progress = 70; // 0 - 100
  const [newBullet, setNewBullet] = useState({});
  const [editorState, setEditorState] = useState("editor");
  const [selectedSection, setSelectedSection] = useState("personal");
  const [skillInput, setSkillInput] = useState("");
  const [projectBulletState, setProjectBulletState] = useState({});
  const [projectTechState, setProjectTechState] = useState({});

  const sectionTitles = {
    personal: "Personal Details",
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    achievements: "Achievements",
    hobbies: "Hobbies",
    extracurricular: "Extracurricular",
  };
  const [resumeData, setResumeData] = useState({
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      summary: "",
      github: "",
      linkedin: "",
      address: "",
      avatar: "",
    },
    education: [
      {
        degree: "",
        institute: "",
        from: "",
        to: "",
      },
    ],
    experience: [
      {
        role: "",
        company: "",
        duration: "",
        description: ["", ""],
      },
    ],
    skills: [],
    projects: [
      {
        title: "",
        description: [],
        technologies: [],
        link: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        year: "",
        credentialUrl: "",
      },
    ],
    achievements: ["", ""],
    hobbies: [],
    extracurricular: [
      {
        role: "",
        activity: "",
        year: "",
        description: "",
      },
    ],
  });

  const updateEducation = (idx, f, value) => {
    const updated = [...resumeData.education];

    updated[idx] = {
      ...updated[idx],
      [f]: value, // ✅ FIX HERE
    };

    setResumeData((prev) => ({
      ...prev,
      education: updated,
    }));
  };

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

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    // prevent duplicates (case-insensitive)
    const exists = resumeData.skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );
    if (exists) {
      setSkillInput("");
      return;
    }

    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));

    setSkillInput("");
  };

  const deleteSkill = (index) => {
    const updated = resumeData.skills.filter((_, i) => i !== index);

    setResumeData((prev) => ({
      ...prev,
      skills: updated,
    }));
  };

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
    <div className="w-full overflow-hidden flex items-center justify-center gap-3 h-screen p-6 md:p-4 bg-white">
      <EditorScoreBox />

      {/* Next Section */}
      <div className="h-full w-[50%] "></div>
      <div className="h-full w-[30%] flex flex-col bg-white border-l pt-3 overflow-y-auto">
        {/* ================= TOOL SWITCHER ================= */}
        <div className="mx-3 mb-4 rounded-xl bg-[#f1f3f5] p-1 flex gap-2">
          {[
            { key: "editor", label: "Editor" },
            { key: "designer", label: "Designer" },
            { key: "job match", label: "Job Match" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setEditorState(item.key)}
              className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-all duration-200
          ${
            editorState === item.key
              ? "bg-[#215049] text-white shadow-sm"
              : "text-[#6b6b6b] hover:bg-white/70"
          }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* ================= EDITOR ================= */}
        {editorState === "editor" && (
          <>
            <div className="flex w-full px-3 flex-col gap-4">
              <p className="text-lg text-[#6b6b6b]">Select a section to edit</p>

              {/* ================= SECTIONS ================= */}
              <div className="w-full flex flex-wrap gap-2">
                {Object.entries(sectionTitles).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSection(key)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
              ${
                selectedSection === key
                  ? "bg-[#e8f2f2] border-[#025149] text-[#025149]"
                  : "bg-white border-[#e5e7eb] text-[#4e5566] hover:bg-[#f8f9fb]"
              }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex w-full px-3 my-4 flex-col gap-5">
              {/* Section Header */}
              <div>
                <p className="text-lg font-medium text-[#6b6b6b]">
                  Fill {sectionTitles[selectedSection]}
                </p>
                <p className="text-[11px] text-[#9aa0aa]">
                  Update your basic personal information
                </p>
              </div>

              {selectedSection === "personal" && (
                <div className="rounded-xl border border-[#e6e6e6] bg-white p-4">
                  <div className="grid w-full grid-cols-1 gap-4">
                    {Object.entries(resumeData.personal).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-1.5">
                        {/* Label – softer, not shouting */}
                        <label className="text-xs font-medium text-[#6b6b6b] capitalize">
                          {key.replace(/_/g, " ")}
                        </label>

                        {/* Input – same, just slightly refined */}
                        <input
                          value={value}
                          onChange={(e) => {
                            setResumeData((prev) => ({
                              ...prev,
                              personal: {
                                ...prev.personal,
                                [key]: e.target.value,
                              },
                            }));
                          }}
                          className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm
                       bg-white
                       focus:border-black transition-all duration-200 outline-none"
                          placeholder={`Enter ${key.replace(/_/g, " ")}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedSection === "education" && (
                <div className="space-y-5">
                  {/* ===== EMPTY STATE ===== */}
                  {resumeData.education.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#fafafa] p-6 text-center space-y-3">
                      <p className="text-sm font-medium text-[#1f2430]">
                        No education added yet
                      </p>
                      <p className="text-xs text-[#6b6b6b]">
                        Add your educational background to strengthen your
                        resume
                      </p>

                      <button
                        onClick={() => {
                          setResumeData((prev) => ({
                            ...prev,
                            education: [
                              ...prev.education,
                              {
                                degree: "",
                                institute: "",
                                from: "",
                                to: "",
                              },
                            ],
                          }));
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg
                     bg-[#025149] text-white hover:opacity-90 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </button>
                    </div>
                  )}

                  {/* ===== EDUCATION LIST ===== */}
                  {resumeData.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#e6e6e6] bg-white p-5 space-y-4"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#1f2430]">
                          Education {idx + 1}
                        </p>

                        <button
                          onClick={() => {
                            const copy = resumeData.education.filter(
                              (_, index) => index !== idx
                            );

                            setResumeData((prev) => ({
                              ...prev,
                              education: copy,
                            }));
                          }}
                          className="p-1 rounded hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      {/* DEGREE & INSTITUTE */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-[#6b6b6b]">
                            Degree
                          </label>
                          <input
                            className="auth-input"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(idx, "degree", e.target.value)
                            }
                            placeholder="B.Tech Computer Science"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-[#6b6b6b]">
                            Institute
                          </label>
                          <input
                            className="auth-input"
                            value={edu.institute}
                            onChange={(e) =>
                              updateEducation(idx, "institute", e.target.value)
                            }
                            placeholder="ABC University"
                          />
                        </div>
                      </div>

                      {/* FROM & TO */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-[#6b6b6b]">
                            From
                          </label>
                          <input
                            className="auth-input"
                            value={edu.from}
                            onChange={(e) =>
                              updateEducation(idx, "from", e.target.value)
                            }
                            placeholder="2020"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-[#6b6b6b]">
                            To
                          </label>
                          <input
                            className="auth-input"
                            value={edu.to}
                            onChange={(e) =>
                              updateEducation(idx, "to", e.target.value)
                            }
                            placeholder="2024"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ===== ADD BUTTON (WHEN LIST EXISTS) ===== */}
                  {resumeData.education.length > 0 && (
                    <button
                      onClick={() => {
                        setResumeData((prev) => ({
                          ...prev,
                          education: [
                            ...prev.education,
                            {
                              degree: "",
                              institute: "",
                              from: "",
                              to: "",
                            },
                          ],
                        }));
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2
                   rounded-lg border border-dashed border-[#cbd5e1]
                   text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add another education
                    </button>
                  )}
                </div>
              )}

              {selectedSection === "experience" && (
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
                          <label className="text-xs font-medium text-[#6b6b6b]">
                            Role
                          </label>
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
                              updateExperience(
                                expIndex,
                                "company",
                                e.target.value
                              )
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
                            updateExperience(
                              expIndex,
                              "duration",
                              e.target.value
                            )
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
                          <div
                            key={bulletIndex}
                            className="flex gap-2 items-center"
                          >
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
                              onClick={() =>
                                deleteExperienceBullet(expIndex, bulletIndex)
                              }
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
              )}
              {selectedSection === "skills" && (
                <div className="space-y-5">
                  {/* ===== EMPTY STATE ===== */}
                  {resumeData.skills.length === 0 && (
                    <div
                      className="rounded-xl border border-dashed border-[#d1d5db]
                   bg-[#fafafa] p-6 text-center space-y-3"
                    >
                      <p className="text-sm font-medium text-[#1f2430]">
                        No skills added yet
                      </p>
                      <p className="text-xs text-[#6b6b6b]">
                        Add relevant technical or professional skills
                      </p>

                      {resumeData.skills.length == 0 && (
                        <input
                          type="text"
                          className="auth-input flex-1"
                          placeholder="Add a skill (e.g. React, Node.js)"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                      )}

                      <button
                        onClick={addSkill}
                        disabled={!skillInput.trim()}
                        className={`inline-flex items-center gap-2 px-4 py-2
            rounded-lg text-sm font-medium transition
            ${
              skillInput.trim()
                ? "bg-[#025149] text-white hover:opacity-90"
                : "bg-[#e5e7eb] text-[#9aa0aa]"
            }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    </div>
                  )}

                  {/* ===== SKILLS LIST ===== */}
                  {resumeData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#e6e6e6]
                   bg-white p-4 flex items-center justify-between"
                    >
                      <p className="text-sm text-[#1f2430]">{skill}</p>

                      <button
                        onClick={() => deleteSkill(index)}
                        className="p-1.5 rounded hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}

                  {/* ===== ADD SKILL INPUT ===== */}
                  {resumeData.skills.length > 0 && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="auth-input flex-1"
                        placeholder="Add a skill (e.g. React, Node.js)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />

                      <button
                        onClick={addSkill}
                        disabled={!skillInput.trim()}
                        className={`h-10 px-4 rounded-lg text-sm font-medium
            flex items-center gap-1 transition
            ${
              skillInput.trim()
                ? "bg-[#025149] text-white hover:opacity-90"
                : "bg-[#e5e7eb] text-[#9aa0aa] cursor-not-allowed"
            }`}
                      >
                        <Plus size={14} />
                        Add
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedSection === "projects" && (
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
                          onChange={(e) =>
                            updateProject(projIndex, "link", e.target.value)
                          }
                          placeholder="https://github.com/username/project"
                        />
                      </div>

                      {/* Bullets */}
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-medium text-[#6b6b6b]">
                          Key Highlights
                        </label>

                        {proj.description.map((bullet, bulletIndex) => (
                          <div
                            key={bulletIndex}
                            className="flex gap-2 items-center"
                          >
                            <input
                              className="auth-input flex-1"
                              value={bullet}
                              onChange={(e) =>
                                updateProjectBullet(
                                  projIndex,
                                  bulletIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Highlight ${bulletIndex + 1}`}
                            />

                            <button
                              onClick={() =>
                                deleteProjectBullet(projIndex, bulletIndex)
                              }
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
                                onClick={() =>
                                  deleteProjectTech(projIndex, techIndex)
                                }
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
