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
}) => {
  const [editorState, setEditorState] = useState("editor");
  const [selectedSection, setSelectedSection] = useState([]);

  const dispatch = useDispatch();
  const currentResume = useSelector((state) => state.resume.currentResume);

  useEffect(() => {
    dispatch(setCurrentResumeConfig(resumeConfig));
  }, [resumeConfig, setResumeConfig]);

  const handleIsAllFieldsFilled = (section) => {
    const isObj = (val) =>
      val && typeof val === "object" && !Array.isArray(val);
    const isArray = (val) => Array.isArray(val);

    if (isObj(section)) {
      return Object.values(section).every((value) => {
        if (isArray(value)) {
          return value.length > 0;
        } else if (isObj(value)) {
          return handleIsAllFieldsFilled(value);
        } else {
          return value !== "" && value !== null && value !== undefined;
        }
      });
    }

    if (isArray(section)) {
      return section.length > 0;
    }

    return section !== "" && section !== null && section !== undefined;
  };

  return (
    <div className="h-full w-full relative flex scrollbar-minimal flex-col bg-white border-l pt-1.5 overflow-y-auto">
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
        <ResumeConfigEditor
          config={resumeConfig}
          resumeData={currentResume}
          setConfig={setResumeConfig}
        />
      )}
      {editorState === "template" && <TemplateShower />}
    </div>
  );
};

export default Editor;
