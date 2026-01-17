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
  <div
    style={{
      marginTop: config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap / 2,
    }}
  >
    <h2
      style={{
        fontSize: `${config.typography.fontSize.section}px`,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: "2px",
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: "1px",
        background: config.colors.line,
      }}
    />
  </div>
);

/* ================= TEMPLATE ================= */

const HarvardResume = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>{edu.institute}</span>
                  <span>{edu.to}</span>
                </div>
                <p>{edu.degree}</p>
              </div>
            ))}
          </>
        );

      case "experience":
        return (
          <>
            <SectionTitle title="Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>{exp.company}</span>
                  <span>{exp.duration}</span>
                </div>
                <p style={{ fontStyle: "italic" }}>{exp.role}</p>
                <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                  {exp.description.map((d, j) => (
                    <li key={j}>{d}</li>
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
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{p.title}</strong>
                <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                  {p.description.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills & Interests" config={config} />
            <p>
              <strong>Technical:</strong> {data.skills.join(", ")}
            </p>
          </>
        );

      case "achievements":
        return (
          <>
            <SectionTitle title="Achievements" config={config} />
            <ul style={{ paddingLeft: "18px" }}>
              {data.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
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
      id="resume-export"
      style={{
        width: `${config.page.width}px`,
        minHeight: `${config.page.minHeight}px`,
        padding: `${config.page.padding}px`,
        background: config.page.background,
        fontFamily: config.typography.fontFamily.body,
        color: config.colors.text,
        lineHeight: config.typography.lineHeight,
        boxSizing: "border-box",
      }}
    >
      {/* ================= HEADER ================= */}
      {!isEmpty(personal) && (
        <div style={{ textAlign: "center", marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              fontWeight: "bold",
            }}
          >
            {personal.name}
          </h1>

          <p style={{ fontSize: `${config.typography.fontSize.small}px` }}>
            {personal.address} &nbsp;|&nbsp; {personal.email} &nbsp;|&nbsp;{" "}
            {personal.phone}
          </p>
        </div>
      )}

      {/* ================= BODY (ORDERED) ================= */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default HarvardResume;
