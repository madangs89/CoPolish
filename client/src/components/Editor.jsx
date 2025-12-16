import React, { useState } from "react";
import EditorToolSwitcher from "./EditorToolSwitcher";
import Personal from "./ResumeEditor/Personal";
import Education from "./ResumeEditor/Education";
import Experience from "./ResumeEditor/Experience";
import Skill from "./ResumeEditor/Skill";
import Project from "./ResumeEditor/Project";
import Certification from "./ResumeEditor/Certification";
import Achievement from "./ResumeEditor/Achievement";
import Hobbies from "./ResumeEditor/Hobbies";
import Extracurricular from "./ResumeEditor/Extracurricular";

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

const Editor = ({ resumeData, setResumeData }) => {
  const [editorState, setEditorState] = useState("editor");
  const [selectedSection, setSelectedSection] = useState("personal");
  return (
    <div className="h-full w-[30%] flex scrollbar-minimal flex-col bg-white border-l pt-3 overflow-y-auto">
      {/* ================= TOOL SWITCHER ================= */}
      <EditorToolSwitcher
        editorState={editorState}
        setEditorState={setEditorState}
      />

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
              <Personal resumeData={resumeData} setResumeData={setResumeData} />
            )}

            {selectedSection === "education" && (
              <Education
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}

            {selectedSection === "experience" && (
              <Experience
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
            {selectedSection === "skills" && (
              <Skill resumeData={resumeData} setResumeData={setResumeData} />
            )}

            {selectedSection === "projects" && (
              <Project resumeData={resumeData} setResumeData={setResumeData} />
            )}
            {selectedSection === "certifications" && (
              <Certification
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
            {selectedSection === "achievements" && (
              <Achievement
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
            {selectedSection === "hobbies" && (
              <Hobbies resumeData={resumeData} setResumeData={setResumeData} />
            )}
            {selectedSection === "extracurricular" && (
              <Extracurricular
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
