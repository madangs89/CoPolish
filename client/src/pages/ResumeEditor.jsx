import React, { useState } from "react";
import EditorScoreBox from "../components/EditorScoreBox";

const ResumeEditor = () => {
  const progress = 70; // 0 - 100

  const [editorState, setEditorState] = useState("editor");

  return (
    <div className="w-full overflow-hidden flex items-center justify-center gap-3 h-screen p-6 md:p-4 bg-white">
      <EditorScoreBox />

      {/* Next Section */}
      <div className="h-full w-[50%] bg-red-300"></div>
      <div className="h-full w-[30%] flex flex-col bg-white border-l pt-2">
        {/* ================= TOOL SWITCHER ================= */}
        <div className="mx-3 mb-3 rounded-xl bg-[#ffff] p-2 flex gap-3 items-center justify-between">
          <button
            onClick={() => setEditorState("editor")}
            className={`flex-1 py-1.5 text-sm rounded-lg ${
              editorState === "editor"
                ? "bg-[#025149] text-white"
                : "hover:bg-white/70 "
            } shadow-sm font-medium text-[#1f2430] transition-all duration-200 ease-in-out`}
          >
            Editor
          </button>

          <button
            onClick={() => setEditorState("designer")}
            className={`flex-1 py-1.5 text-sm rounded-lg ${
              editorState === "designer"
                ? "bg-[#025149] text-white"
                : "hover:bg-white/70 "
            } shadow-sm font-medium text-[#1f2430] transition-all duration-200 ease-in-out`}
          >
            Designer
          </button>

          <button
            onClick={() => setEditorState("job match")}
            className={`flex-1 py-1.5 text-sm rounded-lg ${
              editorState === "job match"
                ? "bg-[#025149] text-white"
                : "hover:bg-white/70"
            } shadow-sm font-medium text-[#1f2430] transition-all duration-200 ease-in-out`}
          >
            Job Match
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
