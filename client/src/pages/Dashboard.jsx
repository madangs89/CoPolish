import { useEffect, useEffectEvent, useState } from "react";
import { Linkedin, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import {
  setBaseScore,
  setCurrentResume,
  setCurrentResumeConfig,
  setCurrentResumeId,
} from "../redux/slice/resumeSlice";
import SkeletonLoader from "../components/Loaders/SkeletonLoader";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthFalse, setUser } from "../redux/slice/authSlice";
import UploadBox from "../components/UploadBox";
import ResumeProgress from "../components/StatusShower/ResumeProgress";
import toast from "react-hot-toast";
import { setCurrentLinkedInData } from "../redux/slice/linkedInSlice";

let nowTime = new Date();

const returnProperData = (data) => {
  const { currentTone, options } = data || {};

  const currentOption = options?.find((option) => option.tone === currentTone);

  if (currentOption && currentOption?.text?.length > 0) {
    return currentOption.text;
  } else {
    return "Your LinkedIn headline is not set. Set it to get a better score.";
  }
};

const Dashboard = () => {
  const userDetails = useSelector((state) => state.auth.user);
  const resumeSlice = useSelector((state) => state.resume);
  const linkedInSlice = useSelector((state) => state.linkedin);
  const location = useLocation();

  const [status, setstatus] = useState([]);
  const [isStatusTrue, setIsStatusTrue] = useState(false);

  const [errorStates, setErrorStates] = useState([]);

  const [resumeLoader, setResumeLoader] = useState(false);
  const [linkedInLoader, setLinkedInLoader] = useState(false);

  const [linkedInUploadModalShow, setLinkedInUploadModalShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resumeScore] = useState(0);
  const [linkedinScore] = useState(0);

  const [resumeUpdated] = useState("");
  const [linkedinChecked] = useState("");

  const [portfolioStatus] = useState(true);
  const [portfolioUpdated] = useState("4 days ago");

  const [prepProgress, setPrepProgress] = useState({
    dsa: {
      totalQuestions: 0,
      solvedQuestions: 0,
    },
    oops: {
      totalQuestions: 0,
      solvedQuestions: 0,
    },
    dbms: {
      totalQuestions: 0,
      solvedQuestions: 0,
    },
    os: {
      totalQuestions: 0,
      solvedQuestions: 0,
    },
  });

  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/v1/is-auth`,
          {
            withCredentials: true,
          },
        );
        console.log(data);

        if (data.success) {
          console.log("calling setUser");
          data.isAuth = true;
          dispatch(setUser(data));
          if (
            data?.user?.currentResumeId == "" ||
            data?.user?.currentResumeId == undefined
          ) {
            navigate("/onboarding");
          } else if (
            data?.user?.currentResumeId.length > 0 &&
            !data?.user?.isApproved
          ) {
            navigate(`/approve/${data?.user?.currentResumeId}`);
          } else {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.log(error);
        let data = {
          user: {},
          isAuth: false,
        };
        dispatch(setAuthFalse(false));
        dispatch(setUser(data));
      }
    })();
  }, []);

  const updateModalState = useEffectEvent(() => {
    setLinkedInUploadModalShow(false);
  });

  useEffect(() => {
    if (isStatusTrue) {
      updateModalState();
    }
  }, [isStatusTrue]);

  // this for fetching question count for progress bar, can be removed later
  useEffect(() => {
    (async () => {
      try {
        setProgressLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/question/v1/count/all`,
          {
            withCredentials: true,
          },
        );
        console.log(data);

        if (data.success) {
          setPrepProgress((prev) => {
            let oldProgres = { ...prev };
            for (const subject in data.counts) {
              if (oldProgres[subject.toLowerCase()]) {
                oldProgres[subject.toLowerCase()].totalQuestions =
                  data.counts[subject];
              }
            }
            return oldProgres;
          });
        }

        const userSolvedProgressResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/progress/v1/count/all`,
          {
            withCredentials: true,
          },
        );

        console.log(userSolvedProgressResponse.data);

        if (userSolvedProgressResponse.data.success) {
          let c = userSolvedProgressResponse.data.counts;

          setPrepProgress((prev) => {
            let oldProgres = { ...prev };
            for (const subject in c) {
              if (oldProgres[subject.toLowerCase()]) {
                oldProgres[subject.toLowerCase()].solvedQuestions = c[subject];
              }
            }
            return oldProgres;
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to fetch question counts for progress. Please try again.",
        );
      } finally {
        setProgressLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Get Resume Data
    (async () => {
      setResumeLoader(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/${location.state?.id || userDetails?.currentResumeId}`,
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
        dispatch(
          setBaseScore(
            Math.max(
              data?.resume?.scoreBefore || 0,
              data?.resume?.scoreAfter || 0,
            ),
          ),
        );
      }
      setResumeLoader(false);
    })();
  }, [userDetails?.currentResumeId, location.state?.id, dispatch]);

  useEffect(() => {
    (async () => {
      if (userDetails?.currentLinkedInId.length > 0) {
        try {
          setLinkedInLoader(true);
          const linkedinData = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/linkedin/v1/linkedin/${userDetails?.currentLinkedInId}`,
            {
              withCredentials: true,
            },
          );

          console.log(linkedinData.data);

          if (linkedinData.data.success) {
            dispatch(setCurrentLinkedInData(linkedinData.data.data));
          }
        } catch (error) {
          toast.error("Failed to fetch LinkedIn data. Please try again.");
          console.log("Error fetching LinkedIn data:", error);
        } finally {
          setLinkedInLoader(false);
        }
      }
    })();
  }, [userDetails?.currentLinkedInId]);

  return (
    <div className="h-screen mt-10 bg-[#f7f7f7] relative px-6 overflow-y-scroll md:px-14 py-10">
      {/* ================= TOP MESSAGE ================= */}
      <div className="bg-[#eaf2ff] rounded-2xl px-6 py-4 flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          ✓
        </div>
        <p className="text-sm md:text-base">
          <span
            onClick={() => navigate("/question/sub")}
            className="font-medium"
          >
            Nice progress,{" "}
            {userDetails?.userName && userDetails?.userName.split(" ")[0]} 👋
          </span>{" "}
          Your resume improved by{" "}
          <span className="font-semibold">+6 points</span>
        </p>
      </div>

      {/* ================= MAIN CARDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= RESUME CARD ================= */}

        {resumeLoader ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Resume</p>

            <div className="flex items-end gap-1">
              <span className="text-5xl font-semibold">
                {resumeSlice?.currentResume?.scoreAfter
                  ? resumeSlice?.currentResume?.scoreAfter
                  : resumeSlice?.currentResume?.scoreBefore}
              </span>
              <span className="text-gray-400">/100</span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Last optimized:{" "}
              {formatDistanceToNow(
                new Date(resumeSlice?.currentResume?.updatedAt || nowTime),
                {
                  addSuffix: true,
                },
              )}
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  navigate(`/editor/resume/${resumeSlice?.currentResume?._id}`)
                }
                className="px-5 py-2 rounded-full border text-sm font-medium hover:bg-gray-50"
              >
                View Resume
              </button>
              <button className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:opacity-90">
                Review Resume
              </button>
            </div>
          </div>
        )}

        {/* ================= LINKEDIN CARD ================= */}

        {linkedInLoader ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium">LinkedIn</p>
            </div>

            {userDetails?.currentLinkedInId ? (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  {returnProperData(
                    linkedInSlice?.currentLinkedInData?.headline,
                  ).slice(0, 70)}
                </p>

                <div className="flex items-end gap-1">
                  <span className="text-5xl font-semibold">
                    {linkedInSlice?.currentLinkedInData?.score?.currentScore ||
                      0}
                  </span>
                  <span className="text-gray-400">/100</span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Last checked:{" "}
                  {formatDistanceToNow(
                    new Date(
                      linkedInSlice?.currentLinkedInData?.updatedAt || nowTime,
                    ),
                    { addSuffix: true },
                  )}
                </p>

                <div className="flex gap-3 mt-6">
                  <button className="px-5 py-2 rounded-full border text-sm font-medium hover:bg-gray-50">
                    View Suggestions
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/editor/linkedin/${linkedInSlice?.currentLinkedInData?._id}`,
                      )
                    }
                    className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:opacity-90"
                  >
                    Improve LinkedIn →
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Status */}
                <div className="flex items-center  gap-2 mt-4 mb-4">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500"></span>
                  <p className="text-sm text-gray-700 font-medium">
                    LinkedIn data not connected
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Import from Resume
                  </button>

                  <button
                    onClick={() => {
                      setLinkedInUploadModalShow(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg bg-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Upload LinkedIn Data
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ================= PORTFOLIO CARD ================= */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <p className="text-sm font-medium mb-3">Portfolio</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-sm">
              {portfolioStatus ? "Published online" : "Not published"}
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Updated: {portfolioUpdated}
          </p>

          <button className="w-full px-5 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-90">
            View Portfolio
          </button>
        </div>
      </div>

      {/* ================= INTERVIEW PREP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* ================= PROGRESS ================= */}

        {progressLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm">
            <p className="text-lg font-medium mb-6">Interview Preparation</p>

            {/* DSA */}
            <Progress label="DSA" value={prepProgress.dsa} />

            {/* OOPS */}
            <Progress label="OOPS" value={prepProgress.oops} />

            {/* DBMS */}
            <Progress label="DBMS" value={prepProgress.dbms} />
            <Progress label="OS" value={prepProgress.os} />
          </div>
        )}

        {/* ================= CTA ================= */}
        <div className="bg-[#fff7e6] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm mb-3">
              Your LinkedIn profile still needs optimization to match recruiter
              searches.
            </p>
          </div>

          <button className="w-full mt-6 px-6 py-3 rounded-full bg-blue-600 text-white text-sm font-medium hover:opacity-90">
            Optimize LinkedIn →
          </button>
        </div>
      </div>

      {linkedInUploadModalShow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999]">
          <UploadBox
            setIsStatusTrue={setIsStatusTrue}
            status={status}
            setstatus={setstatus}
            errorStates={errorStates}
            setErrorStates={setErrorStates}
            title="Upload your resume"
            subtitle="Supported formats: PDF, DOCX"
            operation="linkedin"
          />
        </div>
      )}

      {isStatusTrue && (
        <div className="fixed z-[999999] inset-0 w-full h-full overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
          <ResumeProgress
            status={status}
            setIsStatusTrue={setIsStatusTrue}
            setstatus={setstatus}
            errorStates={errorStates}
            setErrorStates={setErrorStates}
            operation="linkedIn"
          />
        </div>
      )}
    </div>
  );
};

const Progress = ({ label, value }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/question/?subject=${label}`)}
      className="mb-7 cursor-pointer last:mb-0"
    >
      <div className="flex justify-between  items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value.solvedQuestions}/{value.totalQuestions}
        </span>
      </div>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{
            width: `${value.totalQuestions > 0 ? ((value.solvedQuestions / value.totalQuestions) * 100).toFixed(2) : 0}%`,
          }}
        />
      </div>
    </div>
  );
};
export default Dashboard;
