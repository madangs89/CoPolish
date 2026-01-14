import React, { useState } from "react";
import EditorScoreBox from "../components/EditorScoreBox";
import Editor from "../components/Editor";
import ResumePreview from "../components/ResumePreview/ResumePreview";
import ResumeClassicV1 from "../components/ResumeTemplates/ResumeClassicV1";
import { GrScorecard } from "react-icons/gr";
import {
  Brush,
  Download,
  LayoutPanelTop,
  LayoutTemplate,
  Settings2,
  SlidersHorizontal,
  Sparkles,
   Rocket,
  Search,
  Target
} from "lucide-react";
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

  const [mobileEditorState, setMobileEditorState] = useState("preview");

  return (
    <div className="w-full  relative overflow-hidden flex md:flex-row flex-col items-center justify-center gap-3 h-screen md:py-2 md:p-4 bg-white">
      <div className="w-[20%] min-w-[260px] hidden md:flex h-full">
        <EditorScoreBox
          mobileModalState={mobileModalState}
          setMobileModalState={setMobileModalState}
        />
      </div>

      {/* This is small screen tab switcher */}
      <div className="md:hidden w-full h-fit mt-3 mb-3 flex gap-2 items-center justify-between px-3 sticky top-0 z-20">
        {[
          { key: "preview", label: "Preview" },
          { key: "editor", label: "Editor" },
          { key: "job match", label: "Job Match" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setMobileEditorState(item.key)}
            className={`flex-1 border py-1.5 text-sm  max-w-[110px] px-2 rounded-lg font-medium transition-all duration-200
          ${
            mobileEditorState === item.key
              ? "bg-black text-white shadow-sm"
              : "text-[#6b6b6b] hover:bg-white/70"
          }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Next Section */}
      {/* Here handles both big and small screen */}
      <div className="h-full   px-3 md:w-[50%] w-full overflow-hidden ">
        <div className="shadow-xl  md:flex hidden items-center justify-center h-full bg-white relative overflow-hidden">
          <ResumePreview />
        </div>

        {mobileEditorState === "preview" ? (
          <div className="h-full flex md:hidden  items-center justify-center shadow-xl bg-white relative overflow-hidden">
            <ResumePreview />
          </div>
        ) : mobileEditorState === "editor" ? (
          <>
            <Editor
              resumeData={resumeData}
              mobileModalState={mobileModalState}
              setMobileModalState={setMobileModalState}
              setResumeData={setResumeData}
              checkedFields={checkedFields}
              setCheckedFields={setCheckedFields}
            />
          </>
        ) : null}
      </div>
      {/* Big Screen Editor*/}
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

      {/* This is small screen bottom tab switcher */}
      {/* Mobile bottom action bar */}
      <div className="md:hidden w-full h-[72px] flex items-center justify-between px-4 fixed bottom-0 left-0 bg-white border-t z-30">
        {/* SCORE */}
        <div
          onClick={() => setMobileModalState("score")}
          className="flex flex-col items-center justify-center gap-1"
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#3B82F6 ${
                40 * 3.6
              }deg, #E5E7EB 0deg)`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-semibold">40</span>
            </div>
          </div>
          <span className="text-[11px] text-gray-500">Score</span>
        </div>

        {/* SETTINGS */}
        <div
          onClick={() => setMobileModalState("settings")}
          className="flex flex-col items-center justify-center gap-1"
        >
          <SlidersHorizontal className="w-6 h-6 text-gray-700" />
          <span className="text-[11px] text-gray-500">Settings</span>
        </div>

        {/* OPTIMIZE WITH AI (PRIMARY) */}
        <div
          onClick={() => setMobileModalState("optimize")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-md"
        >
          <Sparkles className="w-5 h-5" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">Optimize</span>
            <span className="text-[10px] opacity-80">9 credits</span>
          </div>
        </div>

        {/* TEMPLATE */}
        <div
          onClick={() => setMobileModalState("template")}
          className="flex flex-col items-center justify-center gap-1"
        >
          <LayoutTemplate className="w-6 h-6 text-gray-700" />
          <span className="text-[11px] text-gray-500">Template</span>
        </div>

        {/* DOWNLOAD */}
        <div
          onClick={() => setMobileModalState("download")}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Download className="w-6 h-6 text-gray-700" />
          <span className="text-[11px] text-gray-500">Download</span>
        </div>
      </div>

      {/* Below are mobile state modals */}

      {/* Score modal */}
      <div
        className={`absolute w-full z-[1000000] overflow-hidden md:hidden h-full bg-black/80 transition-all duration-200 ease-in-out ${
          mobileModalState == "score" ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <EditorScoreBox
          mobileModalState={mobileModalState}
          setMobileModalState={setMobileModalState}
        />
      </div>
      {/* optimize modal */}
      <div
        className={`absolute w-full z-[1000000] overflow-hidden md:hidden h-full bg-black/80 transition-all duration-200 ease-in-out ${
          mobileModalState == "optimize" ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full h-full z-50 bg-black/40 flex items-end md:hidden">
          <div className="w-full bg-white rounded-t-2xl px-5 pt-4 pb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Optimize with AI
                </h2>
                <p className="text-sm text-gray-500">9 credits left</p>
              </div>
              <button
                onClick={() => setMobileModalState(null)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {/* Option 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Optimize entire resume
                  </p>
                  <p className="text-sm text-gray-500">
                    Improve wording, metrics, and ATS score across all sections.
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 credit</span>
              </div>

              {/* Option 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Improve experience section
                  </p>
                  <p className="text-sm text-gray-500">
                    Rewrite roles with impact, metrics, and clarity.
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 credit</span>
              </div>

              {/* Option 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">ATS keyword boost</p>
                  <p className="text-sm text-gray-500">
                    Add missing keywords recruiters actually scan for.
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 credit</span>
              </div>

              {/* Option 4 */}
              <div className="flex items-start gap-3 p-3 rounded-xl border hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Job-specific optimization
                  </p>
                  <p className="text-sm text-gray-500">
                    Tailor resume to a specific job description.
                  </p>
                </div>
                <span className="text-xs text-gray-400">1 credit</span>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-5">
              <button className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                Use 1 credit (₹30)
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Credits never expire • ₹30 per optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
