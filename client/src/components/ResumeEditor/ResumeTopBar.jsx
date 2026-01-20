import { Pencil, Zap } from "lucide-react";
import { useState } from "react";

export default function ResumeTopBar({
  title = "Backend Developer Resume",
  credits = 9,
  versions = ["Version 1", "Version 2"],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeTitle, setResumeTitle] = useState(title);
  const [selectedVersion, setSelectedVersion] = useState(versions[1]);

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
            onChange={(e) => setResumeTitle(e.target.value)}
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
      <div className="flex items-center gap-2 sm:gap-4 text-sm flex-shrink-0">
        {/* Version dropdown (hide on small screens) */}
        <div className="hidden sm:flex items-center">
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="
        h-8 px-2 rounded-md
        border border-gray-200
        bg-gray-50 text-gray-700
        text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500
      "
          >
            {versions.map((v) => (
              <option key={v} value={v}>
                {v}
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
    </div>
  );
}
