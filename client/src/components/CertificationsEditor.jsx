import { Plus, Trash2 } from "lucide-react";

const CertificationsEditor = ({ data, onChange }) => {
  /* ---------- HELPERS ---------- */

  const updateField = (certIndex, field, value) => {
    const updated = [...data];
    updated[certIndex] = {
      ...updated[certIndex],
      [field]: value,
    };
    onChange(updated);
  };

  const addCertification = () => {
    onChange([
      ...data,
      {
        name: "",
        issuer: "",
        year: "",
        credentialUrl: "",
      },
    ]);
  };

  const deleteCertification = (certIndex) => {
    onChange(data.filter((_, i) => i !== certIndex));
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-8 ">
      {data.map((cert, certIndex) => (
        <div
          key={certIndex}
          className="rounded-2xl border border-[#e6e6e6] p-6 bg-white space-y-5"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1f2430]">
              Certification {certIndex + 1}
            </h3>
            <button
              type="button"
              onClick={() => deleteCertification(certIndex)}
              className="text-red-500 hover:text-red-600"
              title="Delete certification"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* CERTIFICATION NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">Certification Name</label>
            <input
              className="auth-input"
              value={cert.name}
              onChange={(e) => updateField(certIndex, "name", e.target.value)}
              placeholder="AWS Certified Cloud Practitioner"
            />
          </div>

          {/* ISSUER */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#6b6b6b]">
              Issuing Organization
            </label>
            <input
              className="auth-input"
              value={cert.issuer}
              onChange={(e) => updateField(certIndex, "issuer", e.target.value)}
              placeholder="Amazon Web Services"
            />
          </div>

          {/* YEAR & LINK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">Year Earned</label>
              <input
                className="auth-input"
                value={cert.year}
                onChange={(e) => updateField(certIndex, "year", e.target.value)}
                placeholder="2023"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6b6b6b]">
                Credential URL (optional)
              </label>
              <input
                className="auth-input"
                value={cert.credentialUrl}
                onChange={(e) =>
                  updateField(certIndex, "credentialUrl", e.target.value)
                }
                placeholder="https://credential.net/..."
              />
            </div>
          </div>
        </div>
      ))}

      {/* ADD CERTIFICATION */}
      <button
        type="button"
        onClick={addCertification}
        className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm hover:bg-gray-50"
      >
        <Plus size={16} />
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsEditor;
