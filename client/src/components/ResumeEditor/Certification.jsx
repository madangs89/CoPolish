import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import React from "react";

const Certification = ({
  resumeData,
  setResumeData,
  selectedSection,
  setSelectedSection,
  checkedFields,
  setCheckedFields,
  handleIsAllFieldsFilled,
}) => {
  const isCompleted =
    resumeData.certifications.length > 0 &&
    handleIsAllFieldsFilled(resumeData.certifications);

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: "",
          issuer: "",
          year: "",
          credentialUrl: "",
          link: [{ title: "", url: "" }],
        },
      ],
    }));
  };

  const deleteCertification = (certIndex) => {
    const updated = resumeData.certifications.filter(
      (_, index) => index !== certIndex
    );

    setResumeData((prev) => ({
      ...prev,
      certifications: updated,
    }));
  };

  const updateCertification = (certIndex, field, value) => {
    const updated = [...resumeData.certifications];

    updated[certIndex] = {
      ...updated[certIndex],
      [field]: value,
    };

    setResumeData((prev) => ({
      ...prev,
      certifications: updated,
    }));
  };

  /* ===== LINK HANDLERS (ADDED ONLY) ===== */

  const addLink = (certIndex) => {
    const updated = [...resumeData.certifications];

    updated[certIndex] = {
      ...updated[certIndex],
      link: [...updated[certIndex].link, { title: "", url: "" }],
    };

    setResumeData((prev) => ({
      ...prev,
      certifications: updated,
    }));
  };

  const updateLink = (certIndex, field, value, linkIndex) => {
    const updated = [...resumeData.certifications];

    updated[certIndex] = {
      ...updated[certIndex],
      link: updated[certIndex].link.map((l, i) =>
        i === linkIndex ? { ...l, [field]: value } : l
      ),
    };

    setResumeData((prev) => ({
      ...prev,
      certifications: updated,
    }));
  };

  const deleteLink = (certIndex, linkIndex) => {
    const updated = [...resumeData.certifications];

    updated[certIndex] = {
      ...updated[certIndex],
      link: updated[certIndex].link.filter((_, i) => i !== linkIndex),
    };

    setResumeData((prev) => ({
      ...prev,
      certifications: updated,
    }));
  };

  return (
    <div className="rounded-xl border border-[#e6e6e6] bg-white ">
      <div
        className={` px-3 py-3 flex justify-between items-center 
        ${
          selectedSection.includes("certifications")
            ? "bg-white border rounded-t-xl"
            : "bg-white border border-gray-200 rounded-xl"
        }
        hover:bg-zinc-100 transition`}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={checkedFields.includes("certifications")}
            onChange={(e) => {
              if (e.target.checked) {
                setCheckedFields((prev) => [...prev, "certifications"]);
              } else {
                setCheckedFields((prev) =>
                  prev.filter((f) => f !== "certifications")
                );
              }
            }}
            className="w-3.5 h-3.5 accent-[#374151] "
          />

          <h2
            onClick={() => {
              setSelectedSection((prev) =>
                prev.includes("certifications")
                  ? prev.filter((s) => s !== "certifications")
                  : [...prev, "certifications"]
              );
            }}
            className="text-sm font-medium cursor-pointer text-[#1f2430]"
          >
            Certifications Details
          </h2>
        </div>

        {/* Right */}
        <div
          onClick={() => {
            setSelectedSection((prev) =>
              prev.includes("certifications")
                ? prev.filter((s) => s !== "certifications")
                : [...prev, "certifications"]
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
          {selectedSection.includes("certifications") ? (
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
          selectedSection.includes("certifications")
            ? " h-fit p-4 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-5">
          {/* EMPTY STATE */}
          {resumeData.certifications.length === 0 && (
            <div
              className="rounded-xl border border-dashed border-[#d1d5db]
              bg-[#fafafa] p-6 text-center space-y-3"
            >
              <p className="text-sm font-medium text-[#1f2430]">
                No certifications added yet
              </p>
              <p className="text-xs text-[#6b6b6b]">
                Add certifications to strengthen your professional profile
              </p>

              <button
                onClick={addCertification}
                className="inline-flex items-center gap-2 px-4 py-2
                rounded-lg bg-[#025149] text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
          )}

          {/* CERTIFICATION LIST */}
          {resumeData.certifications.map((cert, certIndex) => (
            <div
              key={certIndex}
              className="rounded-xl border border-[#e6e6e6]
              bg-white p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1f2430]">
                  Certification {certIndex + 1}
                </h3>

                <button
                  onClick={() => deleteCertification(certIndex)}
                  className="p-1.5 rounded hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6b6b6b]">
                  Certification Name
                </label>
                <input
                  className="auth-input"
                  value={cert.name ?? ""}
                  onChange={(e) =>
                    updateCertification(certIndex, "name", e.target.value)
                  }
                  placeholder="AWS Certified Cloud Practitioner"
                />
              </div>

              {/* Issuer */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#6b6b6b]">
                  Issuing Organization
                </label>
                <input
                  className="auth-input"
                  value={cert.issuer ?? ""}
                  onChange={(e) =>
                    updateCertification(certIndex, "issuer", e.target.value)
                  }
                  placeholder="Amazon Web Services"
                />
              </div>

              {/* Year & Credential URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#6b6b6b]">
                    Year Earned
                  </label>
                  <input
                    className="auth-input"
                    value={cert.year ?? ""}
                    onChange={(e) =>
                      updateCertification(certIndex, "year", e.target.value)
                    }
                    placeholder="2023"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-[#6b6b6b]">
                    Credential URL (optional)
                  </label>
                  <input
                    className="auth-input"
                    value={cert.credentialUrl ?? ""}
                    onChange={(e) =>
                      updateCertification(
                        certIndex,
                        "credentialUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://credential.net/..."
                  />
                </div>
              </div>

              {/* LINKS (ADDED, DOES NOT AFFECT ABOVE) */}
              <p
                onClick={() => addLink(certIndex)}
                className="text-xs cursor-pointer text-end font-medium text-[#6b6b6b]"
              >
                Add link
              </p>

              <div className="flex flex-col gap-1.5">
                {cert.link.map((linkItem, linkIndex) => (
                  <div key={linkIndex} className="flex flex-col gap-1.5">
                    <label className="text-xs flex items-center justify-between font-medium text-[#6b6b6b]">
                      Link Title
                      <Trash2
                        onClick={() => deleteLink(certIndex, linkIndex)}
                        className="w-3.5 h-3.5 text-red-400 cursor-pointer"
                      />
                    </label>

                    <input
                      className="auth-input"
                      value={linkItem.title ?? ""}
                      onChange={(e) =>
                        updateLink(
                          certIndex,
                          "title",
                          e.target.value,
                          linkIndex
                        )
                      }
                      placeholder="Credential / Verification Link"
                    />

                    <label className="text-xs font-medium text-[#6b6b6b]">
                      Link URL
                    </label>

                    <input
                      className="auth-input"
                      value={linkItem.url ?? ""}
                      onChange={(e) =>
                        updateLink(certIndex, "url", e.target.value, linkIndex)
                      }
                      placeholder="https://..."
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {resumeData.certifications.length > 0 && (
            <button
              onClick={addCertification}
              className="w-full py-2 flex items-center justify-center gap-2
              rounded-lg border border-dashed border-[#cbd5e1]
              text-sm text-[#025149] hover:bg-[#f0fdfa] transition"
            >
              <Plus className="w-4 h-4" />
              Add another certification
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Certification;
