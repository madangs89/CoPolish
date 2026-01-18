import React from "react";

const EditorToolSwitcher = ({ editorState, setEditorState }) => {
  return (
    <div className="mx-3 z-20 sticky top-0 right-0 mb-2 bg-white  p-1 md:flex hidden gap-2">
      {[
        { key: "editor", label: "Editor" },
        { key: "designer", label: "Designer" },
        { key: "template", label: "Templates" },
        { key: "job match", label: "Job Match" },
      ].map((item) => (
        <button
          key={item.key}
          onClick={() => setEditorState(item.key)}
          className={`flex-1 py-1.5 text-sm rounded-lg border font-medium transition-all duration-200
          ${
            editorState === item.key
              ? "bg-black text-white shadow-sm"
              : "text-[#6b6b6b] bg-white hover:bg-white/70"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default EditorToolSwitcher;
