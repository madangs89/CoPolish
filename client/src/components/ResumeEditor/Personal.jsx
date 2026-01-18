import { ArrowDown, ChevronDown, ChevronUp, Radio } from "lucide-react";
import React from "react";

const Personal = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
  handleIsAllFieldsFilled,
}) => {
  const isCompleted = handleIsAllFieldsFilled(resumeData.personal);

  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
    ${
      selectedSection.includes("personal")
        ? "bg-white border  rounded-t-xl"
        : "bg-white border border-gray-200 rounded-xl"
    }
    hover:bg-zinc-100 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("personal")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "personal"]);
              } else {
                setCheckedFields((prev) =>
                  prev.filter((f) => f !== "personal")
                );
              }
            }}
            className="w-3.5 h-3.5 accent-[#374151] "
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("personal")
                  ? prev.filter((s) => s !== "personal")
                  : [...prev, "personal"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Personal Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("personal")
                ? prev.filter((s) => s !== "personal")
                : [...prev, "personal"]
            );
          }}
          className="flex gap-1 items-center cursor-pointer"
        >
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isCompleted
                ? "text-blue-500 bg-blue-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {isCompleted ? "Completed" : "Incomplete"}
          </span>
          {selectedSection.includes("personal") ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </div>
      </div>

      <div
        className={`grid overflow-hidden w-full grid-cols-1 gap-4
    transition-all duration-300 ease-in-out
    ${
      selectedSection.includes("personal")
        ? "md:h-fit h-fit p-4  opacity-100"
        : "max-h-0 opacity-0"
    }`}
      >
        {Object.entries(resumeData.personal).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1.5">
            {/* Label – softer, not shouting */}
            <label className="text-xs font-medium text-[#6b6b6b] capitalize">
              {key.replace(/_/g, " ")}
            </label>

            {/* Input – same, just slightly refined */}
            <input
              value={value}
              onChange={(e) => {
                setResumeData((prev) => ({
                  ...prev,
                  personal: {
                    ...prev.personal,
                    [key]: e.target.value,
                  },
                }));
              }}
              className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm
                       bg-white
                       focus:border-black transition-all duration-200 outline-none"
              placeholder={`Enter ${key.replace(/_/g, " ")}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Personal;
