import React, { useState, Suspense, lazy, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
const EditorScoreBox = lazy(() => import("../components/EditorScoreBox"));
const ResumePreview = lazy(
  () => import("../components/ResumePreview/ResumePreview"),
);
const Editor = lazy(() => import("../components/Editor"));

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
  Target,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ResumeConfigEditor from "../components/ResumeConfigEditor";
import TemplateShower from "../components/TemplateShower";
import {
  setCurrentResume,
  setCurrentResumeConfig,
  setCheckedField,
  setGlobalLoaderForStatus,
  setCurrentResumeId,
} from "../redux/slice/resumeSlice";
import { useRef } from "react";
// import ImproveWithAIModal from "../components/modals/ImproveWithAIModal";
import OptimizeModal from "../components/modals/OptimizeModal";
import ResumeTopBar from "../components/ResumeEditor/ResumeTopBar";
import OptimizationPanel from "../components/modals/OptimizationPanel";
import DraggableOptimizerFab from "../components/modals/DraggableOptimizerFab";
const ResumeEditor = () => {
  const dispatch = useDispatch();

  const resumeSlice = useSelector((state) => state.resume);
  const config = useSelector((state) => state.resume.currentResumeConfig);
  const resumeData = useSelector((state) => state.resume.currentResume);
  const resumeConfig = useSelector((state) => state.resume.currentResumeConfig);
  const userSlice = useSelector((state) => state.auth.user);
  const isFirstRender = useRef(true);

  const checkedFields = useSelector(
    (state) => state.resume.currentResume.checkedFields,
  );

  const [mobileModalState, setMobileModalState] = useState("");
  const [mobileEditorState, setMobileEditorState] = useState("preview");
  const [dragDetails, setDragDetails] = useState({
    isDragging: false,
    x: 0,
    y: 0,
  });
  const timer = useRef(null);
  const latestResumeRef = useRef(resumeData);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("ALL");
  const [changeCounter, setChangeCounter] = useState(0);

  const updateDbAFterDebounce = async (latestResumeData) => {
    try {
      console.log("Saving resume:", latestResumeData);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/update/${latestResumeData._id}`,
        { resumeData: latestResumeData },
        { withCredentials: true },
      );

      console.log("Auto saved to db", response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes to the server.");
    }
  };

  const debounceSave = (data, delay = 3000) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      updateDbAFterDebounce(data);
    }, delay);
  };

  const setResumeData = (updater) => {
    const updated =
      typeof updater === "function" ? updater(resumeData) : updater;

    latestResumeRef.current = updated;

    dispatch(setCurrentResume(updated));
    setChangeCounter((prev) => prev + 1);
  };

  const setResumeConfig = (updater) => {
    const updatedConfig =
      typeof updater === "function" ? updater(resumeConfig) : updater;

    latestResumeRef.current = {
      ...latestResumeRef.current,
      resumeConfig: updatedConfig,
    };

    dispatch(setCurrentResumeConfig(updatedConfig));
    setChangeCounter((prev) => prev + 1);
  };

  const setCheckedFields = (updater) => {
    const updatedCheckedFields =
      typeof updater === "function"
        ? updater(resumeData.checkedFields)
        : updater;

    latestResumeRef.current = {
      ...latestResumeRef.current,
      checkedFields: updatedCheckedFields,
    };

    dispatch(setCheckedField(updatedCheckedFields));
    setChangeCounter((prev) => prev + 1);
  };

  const setResumeTemplate = (templateId) => {
    const updated = {
      ...latestResumeRef.current,
      templateId,
    };

    latestResumeRef.current = updated;
    dispatch(setCurrentResume(updated));
    setChangeCounter((prev) => prev + 1);
  };

  useEffect(() => {
    latestResumeRef.current = resumeData;
  }, [resumeData]);

  useEffect(() => {
    if (!resumeData?._id) return;
    if (changeCounter === 0) return;
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      updateDbAFterDebounce(latestResumeRef.current);
      setChangeCounter(0);
    }, 2000);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [changeCounter]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!latestResumeRef.current?._id) return;

      const payload = JSON.stringify({
        resumeId: latestResumeRef.current._id,
        resumeData: latestResumeRef.current,
        userId: userSlice?._id,
      });

      const blob = new Blob([payload], { type: "application/json" });

      navigator.sendBeacon(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/update/${latestResumeRef.current._id}`,
        blob,
      );

      // REQUIRED to show browser warning
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Get Resume Data
    console.log("Fetching resume data for ID:", resumeSlice.currentResume._id);
    (async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/${resumeSlice.currentResume._id}`,
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        dispatch(setCurrentResume(data?.resume));

        const configData = {
          ...data?.resume?.config,
          content: {
            ...(data?.resume?.config?.content || {}),
            order: [
              "skills",
              "projects",
              "experience",
              "education",
              "certifications",
              "achievements",
              "extracurricular",
              "hobbies",
              "personal",
            ],
          },
        };
        dispatch(setCurrentResumeConfig(data.resume.config || configData));
        dispatch(setCurrentResumeId(data?.resume?._id));
      }
    })();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full select-none  relative overflow-hidden flex md:flex-row flex-col items-center justify-center gap-1 h-screen md:py-2 md:px-2 bg-white">
        <div className="w-[20%] min-w-[260px] hidden md:flex h-full">
          <EditorScoreBox
            mobileModalState={mobileModalState}
            setMobileModalState={setMobileModalState}
            setOpen={setOpen}
            open={open}
          />
        </div>

        {/* <OptimizationPanel /> */}

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
        <div className="h-full    md:w-[50%] w-full overflow-hidden ">
          <div className="shadow-xl  md:flex hidden flex-col  items-center h-full bg-gray-200  relative overflow-hidden">
            <ResumeTopBar />
            <ResumePreview
              resumeData={resumeData}
              checkedFields={checkedFields}
            />
          </div>

          {mobileEditorState === "preview" ? (
            <div className="h-full flex md:hidden flex-col items-center shadow-xl  relative overflow-hidden">
              <ResumeTopBar />
              <ResumePreview
                resumeData={resumeData}
                checkedFields={checkedFields}
              />
            </div>
          ) : mobileEditorState === "editor" ? (
            <>
              <Editor
                resumeData={resumeData}
                setResumeTemplate={setResumeTemplate}
                mobileModalState={mobileModalState}
                setMobileModalState={setMobileModalState}
                setResumeData={setResumeData}
                checkedFields={checkedFields}
                setCheckedFields={setCheckedFields}
                resumeConfig={resumeConfig}
                setResumeConfig={setResumeConfig}
              />
            </>
          ) : null}
        </div>

        {/* Big Screen Editor*/}
        <div className="h-full w-[30%] hidden md:flex ">
          <Editor
            resumeData={resumeData}
            setResumeTemplate={setResumeTemplate}
            mobileModalState={mobileModalState}
            setMobileModalState={setMobileModalState}
            setResumeData={setResumeData}
            checkedFields={checkedFields}
            setCheckedFields={setCheckedFields}
            resumeConfig={resumeConfig}
            setResumeConfig={setResumeConfig}
          />
        </div>

        <div
          className={`absolute w-full z-[10] overflow-hidden md:hidden h-full bg-red-400 transition-all duration-200 ease-in-out ${
            mobileModalState == "editor" ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Editor
            resumeData={resumeData}
            setResumeTemplate={setResumeTemplate}
            mobileModalState={mobileModalState}
            setMobileModalState={setMobileModalState}
            setResumeData={setResumeData}
            checkedFields={checkedFields}
            setCheckedFields={setCheckedFields}
            resumeConfig={resumeConfig}
            setResumeConfig={setResumeConfig}
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
            onClick={() => setMobileModalState("config")}
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
              <span className="text-[10px] opacity-80">9 credits left</span>
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
            setOpen={setOpen}
            open={open}
          />
        </div>
        {/* optimize modal */}
        <div
          className={`absolute w-full z-[1000000] overflow-hidden md:hidden h-full bg-black/80 transition-all duration-200 ease-in-out ${
            mobileModalState == "optimize"
              ? "translate-y-0"
              : "translate-y-full"
          }`}
        >
          <OptimizeModal
            selected={selected}
            setSelected={setSelected}
            creditsLeft={userSlice?.user?.totalCredits || 0}
            onClose={() => {
              setMobileModalState(null);
              setOpen(false);
            }}
            open={open}
            setOpen={setOpen}
            setMobileModalState={setMobileModalState}
          />
        </div>

        {/* Modal State configuration */}
        <div
          className={`absolute w-full z-[1000000] overflow-y-auto overflow-x-hidden md:hidden h-full bg-black/80 transition-all duration-200 ease-in-out ${
            mobileModalState == "config" ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            className={` ${mobileModalState == "config" ? "translate-y-20" : "translate-y-full"} relative px-2`}
          >
            <button
              onClick={() => setMobileModalState(null)}
              className="text-gray-400 top-2 right-5 absolute text-xl"
            >
              ✕
            </button>
            <ResumeConfigEditor
              setConfig={setResumeConfig}
              config={resumeConfig}
              resumeData={resumeData}
            />
          </div>
        </div>
        {/* Modal State Template */}
        <div
          className={`absolute w-full z-[1000000] overflow-y-auto overflow-x-hidden md:hidden h-full bg-black/80 transition-all duration-200 ease-in-out ${
            mobileModalState == "template"
              ? "translate-y-0"
              : "translate-y-full"
          }`}
        >
          {/* Sticky header */}
          <div className="sticky top-2 flex justify-end px-5 z-[1000001]">
            <button
              onClick={() => setMobileModalState(null)}
              className="text-gray-400 text-xl"
            >
              ✕
            </button>
          </div>

          <div
            className={`${
              mobileModalState == "template"
                ? "translate-y-20"
                : "translate-y-full"
            } min-h-screen relative px-2`}
          >
            <TemplateShower setResumeTemplate={setResumeTemplate} />
          </div>
        </div>

        {/* Big Screen Modal */}
        {open && (
          <OptimizeModal
            selected={selected}
            setSelected={setSelected}
            creditsLeft={userSlice?.user?.totalCredits || 0}
            onClose={() => setOpen(false)}
            open={open}
            setOpen={setOpen}
            setMobileModalState={setMobileModalState}
          />
        )}
        {/* Big Screen statusHelper */}
        <div
          className={`absolute w-fit z-[1000000] right-0  overflow-hidden  h-full bg-black/80 transition-all duration-200 ease-in-out ${
            resumeSlice.globalLoaderForStatus
              ? "translate-x-0"
              : "translate-x-full"
          }`}
        >
          <OptimizationPanel />
        </div>

        {/* For all both big and small screen modal */}
        <DraggableOptimizerFab
          dragDetails={dragDetails}
          setDragDetails={setDragDetails}
        />
      </div>
    </Suspense>
  );
};

export default ResumeEditor;
