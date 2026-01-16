import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, CheckCircle, ChessKing } from "lucide-react";
import renderSection from "../components/renderSection";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import BlackLoader from "../components/Loaders/BlackLoader";
import {
  setCurrentResume,
  setCurrentResumeId,
  setIsChanged,
} from "../redux/slice/resumeSlice";

/* -------------------- CONFIG -------------------- */

const sectionsOrder = [
  "personal",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "achievements",
  "hobbies",
  "extracurricular",
  "preview",
];

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
  preview: "Preview",
};

/* -------------------- PAGE -------------------- */

const ApprovePage = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [approved, setApproved] = useState({});
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(
    useSelector((state) => state.resume.currentResume)
  );

  const resumeSliceData = useSelector((state) => state.resume);
  const userSliceData = useSelector((state) => state.auth);
  const handleApprove = () => {
    setApproved((prev) => ({ ...prev, [activeSection]: true }));

    const idx = sectionsOrder.indexOf(activeSection);
    if (idx < sectionsOrder.length - 1) {
      setActiveSection(sectionsOrder[idx + 1]);
    }
  };

  const handleGoBack = () => {
    const index = sectionsOrder.indexOf(activeSection);
    if (index >= 1) {
      setActiveSection(sectionsOrder[index - 1]);
    }
  };

  const handleApproveAndUpdate = async () => {
    try {
      setButtonLoading(true);
      if (params.id === "default") {
        const d = { ...resumeData, userId: userSliceData.user._id };
        const response = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/resume/v1/mark-approved-create-new`,
          { resumeData: d },
          { withCredentials: true }
        );
        if (response.data.success) {
          navigate("/dashboard");
          toast.success("Resume approved. Redirecting to dashboard");
        }
      } else {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/mark-approved`,
          { resumeId: params.id, resumeData },
          { withCredentials: true }
        );
        if (response.data.success) {
          navigate("/dashboard");
          toast.success("Resume approved. Redirecting to dashboard");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve resume.");
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchResume = async () => {
      if (!params?.id || params.id === "default") {
        return;
      }

      setLoading(true);

      try {
        console.log("Fetching resume data for id:", params.id);

        const resumeInfo = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/${params.id}`,
          { withCredentials: true }
        );

        if (!mounted) return;

        if (resumeInfo.data.success) {
          toast.success("Resume data loaded successfully.");
          setResumeData(resumeInfo.data.resume);
          dispatch(setCurrentResume(resumeInfo.data.resume));
          dispatch(setCurrentResumeId(resumeInfo.data.resume._id));
        }
      } catch (error) {
        if (!mounted) return;

        console.log("Error fetching resume data:", error);
        // toast.error("Failed to load resume data. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResume();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeSection]);

  useEffect(() => {
    if (resumeSliceData.isChanged === false) {
      dispatch(setIsChanged(true));
    }
    dispatch(setCurrentResume(resumeData));
  }, [resumeData, dispatch]);

  return (
    <div ref={sectionRef} className="h-screen header  bg-[#f8f9fb] mt-8 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-10 flex justify-between items-start">
          <div className="">
            <h1 className="text-3xl font-bold text-[#1f2430]">
              {params.id === "default"
                ? "Approve Your New Resume"
                : "Approve Your Updated Resume"}
            </h1>
            <p className="text-sm text-[#6b6b6b] mt-2">
              Review each section. You stay in full control.
            </p>
          </div>

          <button
            onClick={() => {
              setApproved((prev) => {
                let all = {
                  personal: true,
                  education: true,
                  experience: true,
                  skills: true,
                  projects: true,
                  certifications: true,
                  achievements: true,
                  hobbies: true,
                  extracurricular: true,
                  preview: true,
                };
                return { ...all, ...prev };
              });

              setActiveSection("preview");
            }}
            className=" inline-flex items-center gap-2 rounded-full
                 bg-black text-white
                 px-6 py-2 text-sm font-medium
                 transition"
          >
            <CheckCircle size={16} />
            Skip & Go to Preview
          </button>
        </div>

        {/* SECTION CONTAINER */}
        <div className="bg-white rounded-3xl  border md:p-8 py-2 px-3 shadow-sm">
          {loading ? (
            <div className="text-center flex flex-col gap-1 py-20 text-gray-500">
              <BlackLoader />{" "}
              <p className="animate-pulse">Loading resume data</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6 ml-2 mt-2">
                {sectionTitles[activeSection]}
              </h2>

              {renderSection(activeSection, resumeData, setResumeData)}

              <div
                className={`w-full flex gap-3 mt-2 md:mt-6 md:flex-row flex-col  py-2 md:border-none ${
                  sectionsOrder.indexOf(activeSection) >= 1
                    ? "justify-between"
                    : "justify-end"
                }`}
              >
                {/* GO BACK */}
                {activeSection && sectionsOrder.indexOf(activeSection) >= 1 && (
                  <button
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 rounded-full
                   border border-slate-300 bg-white text-slate-700
                   px-6 py-2 text-sm font-medium
                   hover:bg-slate-50 transition"
                  >
                    <ArrowLeft size={16} />
                    Go Back
                  </button>
                )}

                {/* APPROVE / FINAL CTA */}
                {activeSection !== "preview" ? (
                  <button
                    onClick={handleApprove}
                    className=" inline-flex items-center gap-2 rounded-full
                 bg-black text-white
                 px-6 py-2 text-sm font-medium
                 transition"
                  >
                    <CheckCircle size={16} />
                    Approve & Continue
                  </button>
                ) : buttonLoading ? (
                  <button
                    className=" inline-flex items-center gap-2 rounded-full
                 bg-gradient-to-r bg-white
                 text-white px-7 py-2.5 text-sm font-semibold
                 shadow-md hover:shadow-lg transition"
                  >
                    <BlackLoader />
                  </button>
                ) : (
                  <button
                    onClick={handleApproveAndUpdate}
                    className=" inline-flex items-center gap-2 rounded-full
                 bg-gradient-to-r from-indigo-600 to-violet-600
                 text-white px-7 py-2.5 text-sm font-semibold
                 shadow-md hover:shadow-lg transition"
                  >
                    <CheckCircle size={16} />
                    Enhance Your Chances
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovePage;
