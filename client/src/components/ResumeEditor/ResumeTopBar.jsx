import { Pencil, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import BlackLoader from "../Loaders/BlackLoader";
import {
  setCurrentResume,
  setCurrentResumeConfig,
  setCurrentResumeId,
  setResumeIdTrigger,
} from "../../redux/slice/resumeSlice";

export default function ResumeTopBar({ title = "Backend Developer Resume" }) {
  title = useSelector((state) => state.resume.currentResume.title);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(title);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();
  4;
  let resumeSlice = useSelector((state) => state.resume);

  const [loading, setLoading] = useState(true);
  let credits = useSelector((state) => state.auth.user?.totalCredits || 0);
  const timer = useRef(null);

  const dispatch = useDispatch();

  const latestResumeRef = useSelector((state) => state.resume.currentResume);

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

  const handleUpdateTitle = async (newTitle) => {
    try {
      clearTimeout(timer.current);
      setResumeTitle(newTitle);
      timer.current = setTimeout(async () => {
        await updateDbAFterDebounce({
          ...latestResumeRef,
          title: newTitle,
        });
      }, 1000);
    } catch (error) {
      console.error("Error updating resume title:", error);
    }
  };

  const handleUpdateVersion = async (newVersion) => {
    try {
      console.log("Selected version:", newVersion);
      setSelectedVersion(newVersion);
      dispatch(setResumeIdTrigger(true));
      const data = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/${newVersion}`,
        {
          withCredentials: true,
        },
      );
      if (data.data.success) {
        dispatch(setCurrentResume(data?.data?.resume));

        const configData = {
          ...data?.data?.resume?.config,
          content: {
            ...(data?.data?.resume?.config?.content || {}),
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
        dispatch(setCurrentResumeConfig(data.data.resume.config || configData));
        dispatch(setCurrentResumeId(data?.data?.resume?._id));
      }
    } catch (error) {
      console.error("Error updating resume version:", error);
    } finally {
      setTimeout(() => {
        dispatch(setResumeIdTrigger(false));
      }, 600);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/all/versions`,
          {
            withCredentials: true,
          },
        );

        console.log("Resume versions fetched:", res.data);
        if (res.data.success) {
          setSelectedVersion(resumeSlice.currentResumeId);
          setVersions(res.data.resumes);
        }
      } catch (error) {
        console.error("Error fetching resume versions:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex items-center justify-between  md:px-0 w-full h-10 bg-white px-3 border-b ">
      {/* LEFT — Resume title */}
      <div className="flex items-center gap-1.5 min-w-0">
        {!isEditing ? (
          <>
            <h1 className="text-sm sm:text-base font-medium text-gray-900 truncate max-w-[180px] sm:max-w-none">
              {resumeTitle}
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <input
            autoFocus
            value={resumeTitle}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
            className="
              h-8 px-2 text-sm border rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500
              max-w-[180px] sm:max-w-none
            "
          />
        )}
      </div>

      {/* RIGHT — Version + credits */}
      {loading ? (
        <div className="flex items-center gap-2 sm:gap-4 text-sm flex-shrink-0">
          <BlackLoader />
        </div>
      ) : (
        versions.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-4 text-sm flex-shrink-0">
            {/* Version dropdown (hide on small screens) */}
            <div className="hidden sm:flex items-center">
              <select
                value={selectedVersion}
                onChange={(e) => handleUpdateVersion(e.target.value)}
                className="
        h-8 px-2 rounded-md
        border border-gray-200
        bg-gray-50 text-gray-700
        text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
              >
                {versions.map((v, i) => (
                  <option key={v._id} value={v._id}>
                    {v?.title || "Untitled Resume"}
                  </option>
                ))}
              </select>
            </div>

            {/* Credits badge */}
            <div
              className="
    flex items-center gap-1.5
    text-sm font-medium text-gray-800
    cursor-pointer border bg-gray-100 rounded-md p-1
    group
  "
            >
              <Zap className="w-4 h-4 text-[#F5C56B] transition-transform group-hover:scale-110" />
              <span className="tabular-nums">{credits}</span>credits
            </div>
          </div>
        )
      )}
    </div>
  );
}
