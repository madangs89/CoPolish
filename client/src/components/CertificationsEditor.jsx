import { Plus, Trash2 } from "lucide-react";

const CertificationsEditor = ({ data, onChange }) => {
  /* ---------- BASIC FIELD ---------- */

  const updateField = (certIndex, field, value) => {
    const updated = data.map((c, i) =>
      i === certIndex ? { ...c, [field]: value } : c
    );
    onChange(updated);
  };

  /* ---------- LINKS ---------- */

  const updateLink = (certIndex, linkIndex, field, value) => {
    const updated = data.map((c, i) => {
      if (i !== certIndex) return c;

      const links = c.link.map((l, j) =>
        j === linkIndex ? { ...l, [field]: value } : l
      );

      return { ...c, link: links };
    });

    onChange(updated);
  };

  const addLink = (certIndex) => {
    const updated = data.map((c, i) =>
      i === certIndex
        ? { ...c, link: [...c.link, { title: "", url: null }] }
        : c
    );

    onChange(updated);
  };

  const deleteLink = (certIndex, linkIndex) => {
    const updated = data.map((c, i) =>
      i === certIndex
        ? {
            ...c,
            link: c.link.filter((_, j) => j !== linkIndex),
          }
        : c
    );

    onChange(updated);
  };

  /* ---------- CERTIFICATION ---------- */

  const addCertification = () => {
    onChange([
      ...data,
      {
        name: "",
        issuer: "",
        year: "",
        credentialUrl: "",
        link: [{ title: "", url: null }],
      },
    ]);
  };

  const deleteCertification = (certIndex) => {
    onChange(data.filter((_, i) => i !== certIndex));
  };

  /* ---------- UI ---------- */

  return (
    <div className="space-y-8">
      {data.map((cert, certIndex) => (
        <div
          key={certIndex}
          className="rounded-2xl border p-6 bg-white space-y-5"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Certification {certIndex + 1}
            </h3>
            <button onClick={() => deleteCertification(certIndex)}>
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>

          {/* NAME */}
          <input
            className="auth-input"
            placeholder="Certification Name"
            value={cert.name}
            onChange={(e) =>
              updateField(certIndex, "name", e.target.value)
            }
          />

          {/* ISSUER */}
          <input
            className="auth-input"
            placeholder="Issuing Organization"
            value={cert.issuer}
            onChange={(e) =>
              updateField(certIndex, "issuer", e.target.value)
            }
          />

          {/* YEAR */}
          <input
            className="auth-input"
            placeholder="Year Earned"
            value={cert.year}
            onChange={(e) =>
              updateField(certIndex, "year", e.target.value)
            }
          />

          {/* LINKS */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500">
              Credential Links
            </label>

            {cert.link.map((l, linkIndex) => (
              <div key={linkIndex} className="flex gap-2">
                <input
                  className="auth-input flex-1"
                  placeholder="Link title"
                  value={l.title}
                  onChange={(e) =>
                    updateLink(
                      certIndex,
                      linkIndex,
                      "title",
                      e.target.value
                    )
                  }
                />

                <input
                  className="auth-input flex-1"
                  placeholder="https://credential.net/..."
                  value={l.url ?? ""}
                  onChange={(e) =>
                    updateLink(
                      certIndex,
                      linkIndex,
                      "url",
                      e.target.value
                    )
                  }
                />

                <button
                  onClick={() =>
                    deleteLink(certIndex, linkIndex)
                  }
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}

            <button
              onClick={() => addLink(certIndex)}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              <Plus size={14} /> Add link
            </button>
          </div>
        </div>
      ))}

      {/* ADD CERTIFICATION */}
      <button
        onClick={addCertification}
        className="flex items-center gap-2 border rounded-full px-5 py-2 text-sm"
      >
        <Plus size={16} /> Add Certification
      </button>
    </div>
  );
};

export default CertificationsEditor;
