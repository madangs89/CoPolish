import React, { useEffect, useState } from "react";
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
import ResumeConfigEditor from "./ResumeConfigEditor";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentResumeConfig } from "../redux/slice/resumeSlice";
import TemplateShower from "./TemplateShower";
import JobMatch from "./JobMatch";

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
  resumeConfig,
  setResumeConfig,
  setResumeTemplate,
}) => {
  const [editorState, setEditorState] = useState("editor");
  const [selectedSection, setSelectedSection] = useState([]);

  const dispatch = useDispatch();
  const currentResume = useSelector((state) => state.resume.currentResume);

  useEffect(() => {
    dispatch(setCurrentResumeConfig(resumeConfig));
  }, [resumeConfig, setResumeConfig]);

  const handleIsAllFieldsFilled = (section) => {
    if (section === null || section === undefined) return false;

    // string
    if (typeof section === "string") {
      return section.trim() !== "";
    }

    // number / boolean
    if (typeof section === "number" || typeof section === "boolean") {
      return true;
    }

    // array
    if (Array.isArray(section)) {
      if (section.length === 0) return false;

      return section.every((item) => handleIsAllFieldsFilled(item));
    }

    // object
    if (typeof section === "object") {
      // 🔹 SPECIAL CASE: PROJECT
      if (
        "title" in section &&
        "description" in section &&
        "technologies" in section
      ) {
        // title is mandatory
        if (!section.title || section.title.trim() === "") {
          return false;
        }

        // links: validate ONLY if user added them
        if (Array.isArray(section.link) && section.link.length > 0) {
          const validLinks = section.link.every(
            (l) => l.title?.trim() && l.url?.trim(),
          );
          if (!validLinks) return false;
        }

        return true;
      }

      // 🔹 DEFAULT OBJECT CHECK
      return Object.values(section).every((value) =>
        handleIsAllFieldsFilled(value),
      );
    }

    return false;
  };

  return (
    <div className="h-full w-full relative flex scrollbar-minimal flex-col bg-white border-l  overflow-y-auto">
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
          <div className="flex w-full px-3 md:my-2 flex-col gap-3">
            <Personal
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Education
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Experience
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Skill
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Project
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Certification
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />

            <Achievement
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
              setCheckedFields={setCheckedFields}
            />

            <Hobbies
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
              setCheckedFields={setCheckedFields}
            />

            <Extracurricular
              resumeData={resumeData}
              setResumeData={setResumeData}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
              handleIsAllFieldsFilled={handleIsAllFieldsFilled}
            />
          </div>
        </>
      )}

      {editorState === "designer" && (
        <div className="p-3">
          <ResumeConfigEditor
            config={resumeConfig}
            resumeData={currentResume}
            setConfig={setResumeConfig}
          />
        </div>
      )}
      {editorState === "template" && (
        <TemplateShower setResumeTemplate={setResumeTemplate} />
      )}
      {editorState === "job match" && (
        <JobMatch selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
      )}
    </div>
  );
};

export default Editor;
