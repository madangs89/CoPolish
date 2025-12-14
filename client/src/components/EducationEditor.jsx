const EducationEditor = ({ data, onChange }) => {
  const updateField = (eduIndex, field, value) => {
    const updated = [...data];
    updated[eduIndex] = {
      ...updated[eduIndex],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {data.map((edu, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-[#e6e6e6] p-6 bg-white space-y-4"
        >
          <h3 className="text-lg font-semibold text-[#1f2430]">
            Education {idx + 1}
          </h3>

          {/* DEGREE & INSTITUTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Degree</label>
              <input
                className="auth-input"
                value={edu.degree}
                onChange={(e) =>
                  updateField(idx, "degree", e.target.value)
                }
                placeholder="B.Tech Computer Science"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Institute</label>
              <input
                className="auth-input"
                value={edu.institute}
                onChange={(e) =>
                  updateField(idx, "institute", e.target.value)
                }
                placeholder="ABC University"
              />
            </div>
          </div>

          {/* FROM & TO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">From</label>
              <input
                className="auth-input"
                value={edu.from}
                onChange={(e) =>
                  updateField(idx, "from", e.target.value)
                }
                placeholder="2020"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">To</label>
              <input
                className="auth-input"
                value={edu.to}
                onChange={(e) =>
                  updateField(idx, "to", e.target.value)
                }
                placeholder="2024"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationEditor;
