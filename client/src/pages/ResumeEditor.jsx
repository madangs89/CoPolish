import React, { useState } from "react";
import EditorScoreBox from "../components/EditorScoreBox";
import Editor from "../components/Editor";
import ResumePreview from "../components/ResumePreview/ResumePreview";
import ResumeClassicV1 from "../components/ResumeTemplates/ResumeClassicV1";
const ResumeEditor = () => {
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

  const [checkedFields, setCheckedFields] = useState([]);

  return (
    <div className="w-full overflow-hidden flex md:flex-row flex-col items-center justify-center gap-3 h-screen p-6 md:p-4 bg-white">
      <EditorScoreBox />

      {/* Next Section */}
      <div className="h-full  scrollbar-minimal px-3 w-[50%] overflow-y-scroll ">
        <div className="flex mb-4 justify-between items-center w-[100%] ">
          <h2>Resume</h2>
        </div>
        <div className="shadow-xl relative bg-white">
          <h2 className="absolute top-[-9px] left-3  bg-green-300 px-2 py-1 text-sm rounded-md">Recommended</h2>
          <ResumeClassicV1></ResumeClassicV1>
        </div>
      </div>
      <Editor
        resumeData={resumeData}
        setResumeData={setResumeData}
        checkedFields={checkedFields}
        setCheckedFields={setCheckedFields}
      />
    </div>
  );
};

export default ResumeEditor;
