import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import DiffViewer from "react-diff-viewer";

const JobMatch = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const currentResumeData = useSelector((state) => state.resume.currentResume);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/v1/job-match`,
        { jobDescription, resumeData: currentResumeData },
        { withCredentials: true },
      );

      if (!data?.success || !data?.result) {
        throw new Error("Invalid AI response");
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      setError("AI evaluation failed. Please try again.");
    }

    setLoading(false);
  };

  const r = result; // alias

  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white p-4 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-[#1f2430]">AI Job Match</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Compare your resume with a job description
        </p>
      </div>

      {/* Input */}
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        className="w-full h-36 rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm focus:border-black outline-none resize-none"
      />

      {/* Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className={`w-full text-sm py-2 rounded-lg transition ${
          loading
            ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
            : "bg-black text-white hover:bg-zinc-800"
        }`}
      >
        {loading ? "Analyzing…" : "Analyze Match"}
      </button>

      {/* Loader */}
      {loading && (
        <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-md text-xs animate-pulse">
          AI is reasoning about skills, experience, and role fit…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded-md">
          {error}
        </div>
      )}

      {/* Empty */}
      {!result && !loading && (
        <div className="text-xs text-zinc-400 border border-dashed border-zinc-200 p-3 rounded-md">
          Paste a job description to evaluate compatibility
        </div>
      )}

      {/* Result */}
      {r && (
        <div className="border border-zinc-200 rounded-xl p-5 space-y-5 bg-white shadow-sm">
          {/* HERO SCORE */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500">Overall Compatibility</p>
              <h2 className="text-2xl font-bold">
                🔥 {r.matchScore}%
                <span className="text-sm font-medium text-zinc-500 ml-2">
                  ({r.fitLevel})
                </span>
              </h2>
            </div>

            {/* Score Circle */}
            <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center text-sm font-semibold">
              {r.matchScore}
            </div>
          </div>

          {/* DIMENSION GRID */}
          {r.dimensionScores && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(r.dimensionScores).map(([k, v]) => (
                <div
                  key={k}
                  className="bg-zinc-50 border rounded-lg p-3 text-xs"
                >
                  <p className="text-zinc-500 capitalize">{k}</p>
                  <p className="font-semibold text-sm">{v}</p>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS */}
          <div>
            <p className="text-xs font-semibold mb-2">Matched Skills</p>
            <div className="flex flex-wrap gap-2">
              {r.matchedSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold mb-2">Missing Skills</p>
            <div className="flex flex-wrap gap-2">
              {r.missingSkills?.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* IMPROVEMENTS */}
          {r.improvements && (
            <div>
              <p className="text-xs font-semibold mb-2">
                Improvement Suggestions
              </p>
              <div className="space-y-2 text-sm text-zinc-700">
                {r.improvements.map((imp, i) => (
                  <div key={i} className="bg-zinc-50 border p-2 rounded-md">
                    {imp}
                  </div>
                ))}
              </div>
            </div>
          )}

         
        </div>
      )}
    </div>
  );
};

export default JobMatch;
