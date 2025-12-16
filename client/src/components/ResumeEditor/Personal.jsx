import React from "react";

const Personal = ({ resumeData, setResumeData }) => {
  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white p-4">
      <div className="grid w-full grid-cols-1 gap-4">
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
