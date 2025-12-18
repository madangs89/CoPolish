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
import { ArrowRight } from "lucide-react";

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

const Editor = ({
  resumeData,
  setResumeData,
  checkedFields,
  setCheckedFields,
  setMobileModalState,
  mobileModalState,
}) => {
  const [editorState, setEditorState] = useState("editor");
  const [selectedSection, setSelectedSection] = useState([]);
  return (
    <div className="h-full w-full relative flex scrollbar-minimal flex-col bg-white border-l md:pt-3 pt-1.5 overflow-y-auto">
      {mobileModalState == "editor" && (
        <div
          onClick={() => setMobileModalState("")}
          className="absolute md:hidden flex items-center justify-center top-2 left-0 p-2 rounded-full bg-gray-300 active:bg-black transition-all duration-150 hover:bg-black  z-10"
        >
          <ArrowRight className="w-3 h-3 text-white" />
        </div>
      )}

      {/* ================= TOOL SWITCHER ================= */}
      <EditorToolSwitcher
        editorState={editorState}
        setEditorState={setEditorState}
      />

      {/* ================= EDITOR ================= */}
      {editorState === "editor" && (
        <>
   
          <div className="flex w-full px-3 md:my-4 my-1 flex-col gap-3">
        
            <Personal
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Education
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Experience
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Skill
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Project
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Certification
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Achievement
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Hobbies
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />

            <Extracurricular
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
