import axios from "axios";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setStatusHelperLoader,
  setGlobalLoaderForStatus,
  setStatusHelper,
} from "../../redux/slice/resumeSlice";
import BlackLoader from "../Loaders/BlackLoader";
import ButtonLoader from "../Loaders/ButtonLoader";
import toast from "react-hot-toast";

const CREDIT_COST = {
  ALL: 10,
  PERSONAL: 1,
  EXPERIENCE: 1,
  PROJECTS: 1,
  SKILLS: 1,
  EDUCATION: 1,
  CERTIFICATIONS: 1,
  ACHIEVEMENTS: 1,
  EXTRACURRICULAR: 1,
  HOBBIES: 1,
};

const OPTIONS = [
  {
    key: "ALL",
    label: "Full resume (recommended)",
    desc: "Improve structure, clarity, and ATS readability across all sections.",
  },
  {
    key: "PERSONAL",
    label: "Personal summary",
    desc: "Rewrite summary with clear role focus, skills, and experience.",
  },
  {
    key: "EXPERIENCE",
    label: "Experience",
    desc: "Convert vague roles into clear, ATS-friendly responsibilities.",
  },
  {
    key: "PROJECTS",
    label: "Projects",
    desc: "Explain projects with clear system behavior and technologies used.",
  },
  {
    key: "SKILLS",
    label: "Skills",
    desc: "Align skills based on experience and ATS keyword relevance.",
  },
  {
    key: "EDUCATION",
    label: "Education",
    desc: "Ensure clean, consistent, ATS-friendly education formatting.",
  },
  {
    key: "CERTIFICATIONS",
    label: "Certifications",
    desc: "Clean and standardize certification entries for ATS parsing.",
  },
  {
    key: "ACHIEVEMENTS",
    label: "Achievements",
    desc: "Rewrite achievements clearly without exaggeration or fake impact.",
  },
  {
    key: "EXTRACURRICULAR",
    label: "Extracurricular",
    desc: "Clarify roles and activities without inflating responsibility.",
  },
  {
    key: "HOBBIES",
    label: "Hobbies",
    desc: "Format hobbies cleanly without professionalizing them.",
  },
];

const ScorePreview = ({ current = 40, after = 70 }) => {
  const improvement = Math.max(after - current, 0);

  return (
    <div className="bg-gray-100/60 rounded-lg p-3 mb-4">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>Current</span>
        <span>After AI</span>
      </div>

      <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gray-600"
          style={{ width: `${current}%` }}
        />
        <div
          className="absolute top-0 h-full bg-blue-600"
          style={{
            left: `${current}%`,
            width: `${improvement}%`,
          }}
        />
      </div>

      <div className="flex justify-between text-sm font-medium mt-2">
        <span className="text-gray-700">{current}%</span>
        <span className="text-blue-600">{after}%</span>
      </div>

      {current < 50 && (
        <p className="mt-2 text-xs text-gray-500">
          Resumes below 50% often receive lower recruiter visibility.
        </p>
      )}
    </div>
  );
};

export default function OptimizeModal({
  creditsLeft = 0,
  selected,
  setSelected,
  onClose,
  open,
  setOpen,
}) {
  const cost = selected ? CREDIT_COST[selected] : 0;
  const hasEnoughCredits = creditsLeft >= cost;
  const missingCredits = Math.max(cost - creditsLeft, 0);
  const currentResumeData = useSelector((state) => state.resume.currentResume);

  let dispatch = useDispatch();

  const [aiLoading, setAiLoading] = useState(false);

  const handleAiOptimize = async () => {
    setAiLoading(true);
    try {
      dispatch(
        setStatusHelper({
          operation: selected.toLowerCase(),
          status: "started",
        }),
      );

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/optimize-resume`,
        {
          resumeId: currentResumeData._id,
          operation: selected.toLowerCase(),
          prompt: "",
        },
        { withCredentials: true },
      );
      console.log(response.data);
      if (response.data.success) {
        dispatch(setGlobalLoaderForStatus(true));
        dispatch(setStatusHelperLoader(true));
        setOpen(false);
        toast.success("Resume optimization started successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to optimize resume. Please try again.",
      );
      dispatch(setGlobalLoaderForStatus(false));
      dispatch(setStatusHelperLoader(false));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center">
      <div className="w-full md:max-w-xl bg-white rounded-t-xl md:rounded-xl px-5 pt-4 pb-5 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Optimize resume
            </h2>
            <p className="text-xs text-gray-500">
              Available credits: {creditsLeft}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Score */}
        <ScorePreview current={40} after={70} />

        {/* Options */}
        <div className="border rounded-lg divide-y overflow-hidden max-h-[45vh] overflow-y-auto">
          {OPTIONS.map((opt) => (
            <div
              key={opt.key}
              onClick={() => setSelected(opt.key)}
              className={`
                flex items-start gap-3 px-4 py-3 cursor-pointer transition
                ${
                  selected === opt.key
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : "hover:bg-gray-50"
                }
              `}
            >
              <Sparkles className="w-4 h-4 mt-0.5 text-gray-400" />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.desc}</p>
              </div>

              <span className="text-xs text-gray-400 whitespace-nowrap">
                {CREDIT_COST[opt.key]} credit
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4">
          {selected && !hasEnoughCredits ? (
            <>
              <button className="w-full h-10 rounded-md bg-gray-900 text-white text-sm font-medium">
                Add {missingCredits} credits
              </button>
              <p className="text-center text-xs text-gray-500 mt-2">
                {cost} credits required • {creditsLeft} available
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleAiOptimize();
                }}
                disabled={!selected}
                className={`
                  
                  w-full h-10 rounded-md
                  bg-blue-600 disabled:bg-gray-300
                  text-white text-sm font-medium

                  ${aiLoading ? "cursor-not-allowed" : "optimize cursor-pointer"}
                  
                  `}
              >
                {aiLoading ? <ButtonLoader /> : <p>Apply optimization</p>}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                Creates a new version
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
