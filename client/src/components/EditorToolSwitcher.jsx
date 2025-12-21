import React from "react";

const EditorToolSwitcher = ({ editorState, setEditorState }) => {
  return (
    <div className="mx-3 mb-4 rounded-xl bg-[#f1f3f5] p-1 flex gap-2">
      {[
        { key: "editor", label: "Editor" },
        { key: "designer", label: "Designer" },
        { key: "job match", label: "Job Match" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => setEditorState(item.key)}
          className={`flex-1 py-1.5 text-sm rounded-lg font-medium transition-all duration-200
          ${
            editorState === item.key
              ? "bg-black text-white shadow-sm"
              : "text-[#6b6b6b] hover:bg-white/70"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default EditorToolSwitcher;
