import { Check, X } from "lucide-react";
import BlackLoader from "../Loaders/BlackLoader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setCurrentResume,
  setCurrentResumeId,
} from "../../redux/slice/resumeSlice";
import toast from "react-hot-toast";
import { setJobSeenJobs } from "../../redux/slice/jobSlice";
import { useRef } from "react";
import { setCurrentLinkedInData } from "../../redux/slice/linkedInSlice";

export default function ResumeProgress({
  status,
  setstatus,
  errorStates,
  setErrorStates,
  setIsStatusTrue,
}) {
  const isUploaded = status.includes("uploaded");
  const isParsed = status.includes("parsed");
  const isAnalyzing = status.includes("analysis");

  const hasError = errorStates.length > 0;

  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);
  const jobs = useSelector((state) => state.job.seenJobs);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seenRef = useRef(new Set());

  useEffect(() => {
    if (!socket || !user?._id) return;

    const onParsed = (data) => {
      const { userId, event, jobId, isError } = JSON.parse(data);
      const newId = `${event}:${jobId}:${userId}`;

      if (seenRef.current.has(newId)) return;
      if (jobs[newId] == true) {
        return;
      }

      if (userId !== user._id) return;
      seenRef.current.add(newId);

      if (
        event === "RESUME_PARSE_COMPLETED" &&
        userId === user._id &&
        (jobs[newId] == undefined ||
          jobs[newId] == null ||
          jobs[newId] == false)
      ) {
        dispatch(setJobSeenJobs({ id: newId, data: isError }));
        setstatus((prev) =>
          prev.includes("parsed") ? prev : [...prev, "parsed"],
        );
      }
    };

    const onAIParsed = (data) => {
      const { userId, event, parsedNewResume, isError, jobId, operation } =
        JSON.parse(data);

      console.log("RESUME_PARSE_AI_COMPLETED");

      const newId = `${event}:${jobId}:${userId}`;

      if (seenRef.current.has(newId)) return;

      if (jobs[newId] == true) {
        return;
      }

      if (userId !== user._id) return;
      seenRef.current.add(newId);

      if (
        event === "RESUME_PARSE_AI_COMPLETED" &&
        userId === user._id &&
        (jobs[newId] == undefined ||
          jobs[newId] == null ||
          jobs[newId] == false)
      ) {
        setstatus((prev) => {
          let newStatus = [...prev];
          if (!newStatus.includes("parsed")) newStatus.push("parsed");
          if (!newStatus.includes("analysis")) newStatus.push("analysis");
          return newStatus;
        });

        console.log(parsedNewResume);

        if (parsedNewResume) {
          dispatch(setCurrentResumeId(parsedNewResume?._id));

          dispatch(setCurrentResume(parsedNewResume));
        }
        dispatch(setJobSeenJobs({ id: newId, data: isError }));

        console.log({ operation });
        if (operation == "resume") {
          dispatch(setCurrentResume(parsedNewResume));
          navigate(`/approve/${parsedNewResume?._id}`, {
            state: {
              resume: parsedNewResume,
            },
          });
        } else if (operation == "linkedin") {
          dispatch(setCurrentLinkedInData(parsedNewResume));
          navigate(`/editor/linkedin/${parsedNewResume?._id}`, {
            state: {
              linkedin: parsedNewResume,
            },
          });
        }
      }
    };

    const onParsedError = (data) => {
      const { userId, isError, error, event, jobId } = JSON.parse(data);

      const newId = `${event}:${jobId}:${userId}`;

      if (seenRef.current.has(newId)) return;

      if (jobs[newId] == true) {
        return;
      }
      if (userId !== user._id || !isError) return;
      seenRef.current.add(newId);
      if (
        userId === user._id &&
        isError &&
        (jobs[newId] == undefined ||
          jobs[newId] == null ||
          jobs[newId] == false)
      ) {
        const safeMessage =
          typeof error === "string"
            ? error
            : error?.message
              ? error.message
              : JSON.stringify(error);
        setErrorStates((prev) => [
          ...prev,
          { type: "parsing", message: safeMessage },
        ]);

        console.log("PARSE ERROR:", error);
        toast.error(
          safeMessage ||
            "There was an error parsing your resume. Please try again.",
        );
      }
    };

    const onAIParsedError = (data) => {
      const { userId, isError, error, event, jobId } = JSON.parse(data);

      const newId = `${event}:${jobId}:${userId}`;
      console.log("got error", newId, jobs, jobs[newId]);

      if (seenRef.current.has(newId)) return;

      if (jobs[newId] == true) {
        return;
      }

      if (userId !== user._id || !isError) return;
      seenRef.current.add(newId);
      if (
        userId === user._id &&
        isError &&
        (jobs[newId] == undefined ||
          jobs[newId] == null ||
          jobs[newId] == false)
      ) {
        const safeMessage =
          typeof error === "string"
            ? error
            : error?.message
              ? error.message
              : JSON.stringify(error);
        setErrorStates((prev) => [
          ...prev,
          { type: "analysis", message: safeMessage },
        ]);

        toast.error(
          safeMessage ||
            "There was an error analyzing your resume. Please try again.",
        );
      }
    };

    socket.on("resume:parsed", onParsed);
    socket.on("resume:ai:parsed", onAIParsed);
    socket.on("resume:parsed:error", onParsedError);
    socket.on("resume:ai:parsed:error", onAIParsedError);

    return () => {
      socket.off("resume:parsed", onParsed);
      socket.off("resume:ai:parsed", onAIParsed);
      socket.off("resume:parsed:error", onParsedError);
      socket.off("resume:ai:parsed:error", onAIParsedError);
    };
  }, [socket, user?._id, dispatch, navigate, setstatus, setErrorStates]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={() => {
            setIsStatusTrue(false);
            setstatus([]);
            setErrorStates([]);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Resume Analysis Progress
        </h2>

        <ProgressStep
          active={isUploaded}
          loading={!isUploaded && !hasError}
          title="Uploaded"
          description="Your resume has been received."
          color="green"
          hasError={hasError}
        />

        <ProgressStep
          active={isParsed}
          loading={isUploaded && !isParsed && !hasError}
          title="Parsed"
          description="Resume text has been extracted."
          color="green"
          hasError={hasError}
        />

        <ProgressStep
          active={isAnalyzing}
          loading={isUploaded && isParsed && !isAnalyzing && !hasError}
          title="AI Analysis"
          description="Analyzing your resume with AI..."
          color="blue"
          hasError={hasError}
        />

        {hasError && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-600 font-semibold mb-2">
              Something went wrong
            </h4>
            <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
              {errorStates.map((err, index) => {
                const message =
                  typeof err.message === "string"
                    ? err.message
                    : JSON.stringify(err.message);

                return (
                  <li key={index}>
                    <strong>{err.type}:</strong> {message}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-6 text-center">
          Please wait while we analyze your resume...
        </p>
      </div>
    </div>
  );
}

/* ================= STEP ================= */

function ProgressStep({
  active,
  loading,
  title,
  description,
  color,
  hasError,
}) {
  return (
    <div className="flex gap-4 mt-6">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          hasError
            ? "bg-red-500"
            : active
              ? color === "blue"
                ? "bg-blue-600"
                : "bg-green-500"
              : "bg-gray-300"
        }`}
      >
        {hasError ? (
          <X className="text-white" size={20} />
        ) : loading ? (
          <BlackLoader size={20} color="black" />
        ) : active ? (
          <Check className="text-white" size={20} />
        ) : (
          <Check className="text-white opacity-40" size={20} />
        )}
      </div>

      <div>
        <h3
          className={`text-lg font-semibold ${
            hasError
              ? "text-red-600"
              : active
                ? color === "blue"
                  ? "text-blue-600"
                  : "text-green-600"
                : "text-gray-500"
          }`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
