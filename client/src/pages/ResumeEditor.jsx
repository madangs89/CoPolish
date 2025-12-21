import React, { useState } from "react";
import EditorScoreBox from "../components/EditorScoreBox";
import Editor from "../components/Editor";
import ResumePreview from "../components/ResumePreview/ResumePreview";
import ResumeClassicV1 from "../components/ResumeTemplates/ResumeClassicV1";
import { GrScorecard } from "react-icons/gr";
import { Brush } from "lucide-react";
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

  const [mobileModalState, setMobileModalState] = useState("");

  return (
    <div className="w-full relative overflow-hidden flex md:flex-row flex-col items-center justify-center gap-3 h-screen py-2 md:p-4 bg-white">
      <div className="w-[20%] min-w-[260px] hidden md:flex h-full">
        <EditorScoreBox
          mobileModalState={mobileModalState}
          setMobileModalState={setMobileModalState}
        />
      </div>

      <div
        className={`absolute w-full z-[10] overflow-hidden md:hidden h-full bg-red-400 transition-all duration-200 ease-in-out ${
          mobileModalState == "score" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <EditorScoreBox
          mobileModalState={mobileModalState}
          setMobileModalState={setMobileModalState}
        />
      </div>

      {/* Next Section */}
      <div className="h-full   px-3 md:w-[50%] w-full overflow-hidden ">
        {/* <div className="flex mb-4 justify-between items-center w-[100%] ">
          <h2 className="text-xl">Resume</h2>
          <div className="flex md:hidden justify-center items-center gap-4">
            <div
              onClick={() => setMobileModalState("score")}
              className="w-5 h-5"
            >
              <GrScorecard
                className={`w-full h-full ${
                  mobileModalState == "score" && "text-green-500"
                }`}
              />
            </div>
            <div
              className="w-5 h-5"
              onClick={() => setMobileModalState("editor")}
            >
              <Brush
                className={`w-full h-full ${
                  mobileModalState == "editor" && "text-green-500"
                }`}
              />
            </div>
            <button className="w-fit px-2 mt-2 py-2.5 rounded-lg text-sm font-medium bg-[#025149] text-white hover:opacity-90 transition">
              Improve with AI
            </button>
          </div>
        </div> */}
        <div className="shadow-xl h-[80%] flex items-center justify-center md:h-full bg-white relative overflow-hidden">
          <ResumePreview />
        </div>
      </div>

      <div className="h-full w-[30%] hidden md:flex ">
        <Editor
          resumeData={resumeData}
          setResumeData={setResumeData}
          checkedFields={checkedFields}
          setCheckedFields={setCheckedFields}
        />
      </div>

      <div
        className={`absolute w-full z-[10] overflow-hidden md:hidden h-full bg-red-400 transition-all duration-200 ease-in-out ${
          mobileModalState == "editor" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Editor
          resumeData={resumeData}
          mobileModalState={mobileModalState}
          setMobileModalState={setMobileModalState}
          setResumeData={setResumeData}
          checkedFields={checkedFields}
          setCheckedFields={setCheckedFields}
        />
      </div>
    </div>
  );
};

export default ResumeEditor;
