import React from "react";

/* ================= HELPERS ================= */

const isEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object")
    return Object.values(value).every(
      (v) => v === null || v === "" || (Array.isArray(v) && v.length === 0)
    );
  return false;
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <h2
    style={{
      fontSize: `${config.typography.fontSize.section}px`,
      color: config.colors.primary,
      marginBottom: 6,
      marginTop: config.spacing.sectionGap,
    }}
  >
    {title}
  </h2>
);

/* ================= TEMPLATE ================= */

const ResumeClassicV1 = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Work Experience" config={config} />
            {data.experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.body}px`,
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  {exp.role} – {exp.company}
                </p>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    margin: "2px 0 6px 0",
                  }}
                >
                  {exp.duration}
                </p>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {exp.description.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: `${config.typography.fontSize.body}px`,
                      }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      case "projects":
        return (
          <>
            <SectionTitle title="Projects" config={config} />
            {data.projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: 10 }}>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.body}px`,
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  {proj.title}
                </p>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {proj.description.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: `${config.typography.fontSize.body}px`,
                      }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            <p style={{ fontSize: `${config.typography.fontSize.body}px` }}>
              {data.skills.join(", ")}
            </p>
          </>
        );

      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, idx) => (
              <div key={idx}>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.body}px`,
                    margin: 0,
                  }}
                >
                  {edu.degree}
                </p>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    margin: "2px 0 0 0",
                  }}
                >
                  {edu.institute} | {edu.from} – {edu.to}
                </p>
              </div>
            ))}
          </>
        );

      case "certifications":
      case "achievements":
      case "hobbies":
        return (
          <>
            <SectionTitle title="Additional Information" config={config} />
            <ul
              style={{
                paddingLeft: 18,
                fontSize: `${config.typography.fontSize.body}px`,
              }}
            >
              {data.certifications?.length > 0 && (
                <li>
                  <strong>Certificates:</strong>{" "}
                  {data.certifications.map((c) => c.name).join(", ")}
                </li>
              )}
              {data.achievements?.length > 0 && (
                <li>
                  <strong>Awards:</strong>{" "}
                  {data.achievements.join(", ")}
                </li>
              )}
              {data.hobbies?.length > 0 && (
                <li>
                  <strong>Interests:</strong>{" "}
                  {data.hobbies.join(", ")}
                </li>
              )}
            </ul>
          </>
        );

      default:
        return null;
    }
  };

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        width: `${config.page.width}px`,
        minHeight: `${config.page.minHeight}px`,
        background: config.page.background,
        color: config.colors.text,
        padding: `${config.page.padding}px`,
        boxSizing: "border-box",
        fontFamily: config.typography.fontFamily.body,
      }}
    >
      {/* ===== HEADER ===== */}
      {!isEmpty(personal) && (
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              margin: "0 0 4px 0",
            }}
          >
            {personal.name}
          </h1>

          <p style={{ fontSize: `${config.typography.fontSize.body}px`, margin: 0 }}>
            {personal.title}
          </p>

          <p
            style={{
              fontSize: `${config.typography.fontSize.small}px`,
              margin: "6px 0 0 0",
            }}
          >
            {personal.email} | {personal.phone} | {personal.address}
          </p>

          <p
            style={{
              fontSize: `${config.typography.fontSize.small}px`,
              margin: "2px 0 0 0",
            }}
          >
            LinkedIn: {personal.linkedin} | GitHub: {personal.github}
          </p>
        </div>
      )}

      {/* ===== SUMMARY ===== */}
      {personal?.summary && (
        <>
          <SectionTitle title="Professional Summary" config={config} />
          <p style={{ fontSize: `${config.typography.fontSize.body}px`, margin: 0 }}>
            {personal.summary}
          </p>
        </>
      )}

      {/* ===== BODY (ORDERED) ===== */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ResumeClassicV1;
