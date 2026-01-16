import { Check } from "lucide-react";
import BlackLoader from "../Loaders/BlackLoader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentResume } from "../../redux/slice/resumeSlice";
import toast from "react-hot-toast";

export default function ResumeProgress({ status, setstatus }) {
  const isUploaded = status.includes("uploaded");
  const isParsed = status.includes("parsed");
  const isAnalyzing = status.includes("analysis");

  const [errorStates, setErrorStates] = useState([]);

  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket || !user?._id) return;

    /* ================= PARSE SUCCESS ================= */
    const onParsed = (data) => {
      const { userId, event } = JSON.parse(data);

      if (event === "RESUME_PARSE_COMPLETED" && userId === user._id) {
        setstatus((prev) =>
          prev.includes("parsed") ? prev : [...prev, "parsed"]
        );
      }
    };

    /* ================= AI PARSE SUCCESS ================= */
    const onAIParsed = (data) => {
      const { userId, event, parsedNewResume } = JSON.parse(data);

      if (event === "RESUME_PARSE_AI_COMPLETED" && userId === user._id) {
        setstatus((prev) => {
          let isParseIncluded = prev.includes("parsed");
          let isAnalysisIncluded = prev.includes("analysis");

          let newStatus = [...prev];
          if (!isParseIncluded) newStatus.push("parsed");
          if (!isAnalysisIncluded) newStatus.push("analysis");

          return newStatus;
        });

        dispatch(setCurrentResume(parsedNewResume));
        navigate(`/approve/${userId}`);
      }
    };

    /* ================= PARSE ERROR ================= */
    const onParsedError = (data) => {
      const { userId, isError, error } = JSON.parse(data);

      if (userId === user._id && isError) {
        setErrorStates((prev) => [
          ...prev,
          { type: "parsing", message: error },
        ]);

        toast.error(
          error || "There was an error parsing your resume. Please try again."
        );
      }
    };

    /* ================= AI PARSE ERROR ================= */
    const onAIParsedError = (data) => {
      const { userId, isError, error } = JSON.parse(data);

      if (userId === user._id && isError) {
        setErrorStates((prev) => [
          ...prev,
          { type: "analysis", message: error },
        ]);

        toast.error(
          error || "There was an error analyzing your resume. Please try again."
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
  }, [socket, user?._id, dispatch, navigate, setstatus]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Resume Analysis Progress
        </h2>

        {/* ================= UPLOADED ================= */}
        <ProgressStep
          active={isUploaded}
          loading={!isUploaded}
          title="Uploaded"
          description="Your resume has been received."
          color="green"
        />

        {/* ================= PARSED ================= */}
        <ProgressStep
          active={isParsed}
          loading={isUploaded && !isParsed}
          title="Parsed"
          description="Resume text has been extracted."
          color="green"
        />

        {/* ================= AI ANALYSIS ================= */}
        <ProgressStep
          active={isAnalyzing}
          loading={isUploaded && isParsed && !isAnalyzing}
          title="AI Analysis"
          description="Analyzing your resume with AI..."
          color="blue"
        />

        {/* ================= ERRORS ================= */}
        {errorStates.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-600 font-semibold mb-2">
              Something went wrong
            </h4>
            <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
              {errorStates.map((err, index) => (
                <li key={index}>
                  <strong>{err.type}:</strong> {err.message}
                </li>
              ))}
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

/* ================= REUSABLE STEP ================= */

function ProgressStep({ active, loading, title, description, color }) {
  return (
    <div className="flex gap-4 mt-6">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          active
            ? color === "blue"
              ? "bg-blue-600"
              : "bg-green-500"
            : "bg-gray-300"
        }`}
      >
        {loading ? (
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
            active
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
