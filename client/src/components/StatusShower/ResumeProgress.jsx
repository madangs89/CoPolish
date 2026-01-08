import { Check, Loader2 } from "lucide-react";
import BlackLoader from "../Loaders/BlackLoader";

export default function ResumeProgress({ status }) {
  const isUploaded = status.includes("uploaded");
  const isParsed = status.includes("parsed");
  const isAnalyzing = status.includes("analysis");

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* ================= TITLE ================= */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Resume Analysis Progress
        </h2>

        {/* ================= UPLOADED ================= */}
        <div className="flex gap-4 mt-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isUploaded ? "bg-green-500" : "bg-gray-300"}`}
          >
            {!isUploaded ? (
              <BlackLoader size={20} color="black" />
            ) : isUploaded ? (
              <Check className="text-white" size={20} />
            ) : (
              <Check className="text-white opacity-40" size={20} />
            )}
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                isUploaded ? "text-green-600" : "text-gray-500"
              }`}
            >
              Uploaded
            </h3>
            <p className="text-gray-600 text-sm">
              Your resume has been received.
            </p>
          </div>
        </div>

        {/* ================= PARSED ================= */}
        <div className="flex gap-4 mt-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isParsed ? "bg-green-500" : "bg-gray-300"}`}
          >
            {isUploaded && !isParsed ? (
              <BlackLoader size={20} color="black" />
            ) : isParsed ? (
              <Check className="text-white" size={20} />
            ) : (
              <Check className="text-white opacity-40" size={20} />
            )}
          </div>

          <div>
            <h3
              className={`text-lg font-semibold ${
                isParsed ? "text-green-600" : "text-gray-500"
              }`}
            >
              Parsed
            </h3>
            <p className="text-gray-600 text-sm">
              Resume text has been extracted.
            </p>
          </div>
        </div>

        {/* ================= AI ANALYSIS ================= */}
        <div className="flex gap-4 mt-6">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center
              ${isAnalyzing ? "bg-blue-600" : "bg-gray-300"}`}
          >
            {isUploaded && isParsed && !isAnalyzing ? (
              <BlackLoader size={20} color="black" />
            ) : isAnalyzing ? (
              <Check className="text-white" size={20} />
            ) : (
              <Check className="text-white opacity-40" size={20} />
            )}
          </div>

          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                isAnalyzing ? "text-blue-600" : "text-gray-500"
              }`}
            >
              AI Analysis
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Analyzing your resume with AI...
            </p>

          
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <p className="text-gray-500 text-sm mt-6 text-center">
          Please wait while we analyze your resume...
        </p>
      </div>
    </div>
  );
}
