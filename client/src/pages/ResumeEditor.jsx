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

  return (
    <div className="w-full overflow-hidden flex md:flex-row flex-col items-center justify-center gap-3 h-screen p-6 md:p-4 bg-white">
      <EditorScoreBox />

      {/* Next Section */}
      <div className="h-full scrollbar-minimal w-[50%] overflow-y-scroll ">
        <div className="flex justify-between items-center w-[100%] ">
          <h2>Resume</h2>
          <button>Enhance With Ai</button>
        </div>
        <ResumeClassicV1></ResumeClassicV1>
      </div>
      <Editor resumeData={resumeData} setResumeData={setResumeData} />
    </div>
  );
};

export default ResumeEditor;
