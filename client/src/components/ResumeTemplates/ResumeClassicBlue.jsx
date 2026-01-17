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
  <div style={{ marginTop: config.spacing.sectionGap }}>
    <h2
      style={{
        fontSize: `${config.typography.fontSize.section}px`,
        fontWeight: "bold",
        color: config.colors.primary,
        marginBottom: 4,
        textTransform: "uppercase",
      }}
    >
      {title}
    </h2>
    <hr
      style={{
        border: `1px solid ${config.colors.primary}`,
        marginBottom: 8,
      }}
    />
  </div>
);

/* ================= TEMPLATE ================= */

const ResumeClassicBlue = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Professional Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: `${config.typography.fontSize.body}px` }}>
                    {exp.role}, {exp.company}
                  </strong>
                  <span style={{ fontSize: `${config.typography.fontSize.body}px` }}>
                    {exp.duration}
                  </span>
                </div>
                <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                  {exp.description.map((d, j) => (
                    <li
                      key={j}
                      style={{ fontSize: `${config.typography.fontSize.body}px` }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong style={{ fontSize: `${config.typography.fontSize.body}px` }}>
                    {edu.degree}
                  </strong>
                  <span style={{ fontSize: `${config.typography.fontSize.body}px` }}>
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p style={{ fontSize: `${config.typography.fontSize.body}px`, margin: "2px 0" }}>
                  {edu.institute}
                </p>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Technical Skills" config={config} />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {data.skills.map((skill, i) => (
                <div
                  key={i}
                  style={{
                    width: "33%",
                    fontSize: `${config.typography.fontSize.body}px`,
                    marginBottom: 4,
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </>
        );

      case "projects":
        return (
          <>
            <SectionTitle title="Projects" config={config} />
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: `${config.typography.fontSize.body}px` }}>
                  {p.title}
                </strong>
                <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                  {p.description.map((d, j) => (
                    <li
                      key={j}
                      style={{ fontSize: `${config.typography.fontSize.body}px` }}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
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
            <ul style={{ paddingLeft: 18, fontSize: `${config.typography.fontSize.body}px` }}>
              {data.hobbies?.length > 0 && (
                <li>
                  <strong>Languages:</strong> {data.hobbies.join(", ")}
                </li>
              )}
              {data.certifications?.length > 0 && (
                <li>
                  <strong>Certificates:</strong>{" "}
                  {data.certifications.map((c) => c.name).join(", ")}
                </li>
              )}
              {data.achievements?.length > 0 && (
                <li>
                  <strong>Awards / Activities:</strong>{" "}
                  {data.achievements.join(", ")}
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
        padding: `${config.page.padding}px`,
        fontFamily: config.typography.fontFamily.body,
        color: config.colors.text,
        boxSizing: "border-box",
      }}
    >
      {/* ================= HEADER ================= */}
      {!isEmpty(personal) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h1
              style={{
                fontSize: `${config.typography.fontSize.name}px`,
                color: config.colors.primary,
                margin: 0,
                fontWeight: "bold",
              }}
            >
              {personal.name}
            </h1>

            <p style={{ fontWeight: "bold", margin: "4px 0" }}>
              {personal.title}
            </p>

            <p style={{ fontSize: `${config.typography.fontSize.body}px`, margin: "2px 0" }}>
              {personal.address}
            </p>

            <p style={{ fontSize: `${config.typography.fontSize.body}px`, margin: "2px 0" }}>
              {personal.phone} | {personal.email}
            </p>
          </div>

          {personal.avatar && (
            <img
              src={personal.avatar}
              alt="profile"
              style={{
                width: config.meta?.photo?.width || 90,
                height: config.meta?.photo?.height || 110,
                objectFit: "cover",
                borderRadius: config.meta?.photo?.borderRadius || 0,
              }}
            />
          )}
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {personal?.summary && (
        <>
          <SectionTitle title="Summary" config={config} />
          <p style={{ fontSize: `${config.typography.fontSize.body}px` }}>
            {personal.summary}
          </p>
        </>
      )}

      {/* ================= BODY (ORDERED) ================= */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ResumeClassicBlue;
