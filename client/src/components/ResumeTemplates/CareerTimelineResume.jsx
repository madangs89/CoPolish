import React from "react";

/* ================= HELPERS ================= */

const isEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object")
    return Object.values(value).every(v => !v || v.length === 0);
  return false;
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <h2
    style={{
      marginTop: config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap,
      fontSize: `${config.typography.fontSize.section}px`,
      fontWeight: 700,
      color: config.colors.primary,
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    }}
  >
    {title}
  </h2>
);

/* ================= TEMPLATE ================= */

const CareerTimelineResume = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Career Timeline" config={config} />

            <div style={{ position: "relative", marginLeft: "14px" }}>
              {/* vertical line */}
              {config.decorations.dividerStyle === "timeline" && (
                <div
                  style={{
                    position: "absolute",
                    left: "6px",
                    top: 0,
                    bottom: 0,
                    width: "2px",
                    background: config.colors.line,
                  }}
                />
              )}

              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: config.spacing.sectionGap,
                  }}
                >
                  {/* dot */}
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: config.colors.accent,
                      marginTop: "6px",
                      flexShrink: 0,
                    }}
                  />

                  {/* content */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 600,
                      }}
                    >
                      <span>
                        {exp.role} · {exp.company}
                      </span>
                      <span style={{ color: config.colors.muted }}>
                        {exp.duration}
                      </span>
                    </div>

                    <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                      {exp.description.map((d, j) => (
                        <li key={j}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "projects":
        return (
          <>
            <SectionTitle title="Selected Projects" config={config} />
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{p.title}</strong>
                <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
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
            <SectionTitle title="Core Skills" config={config} />
            <p style={{ color: config.colors.muted }}>
              {data.skills.join(" · ")}
            </p>
          </>
        );

      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{edu.degree}</strong>{" "}
                <span style={{ color: config.colors.muted }}>
                  ({edu.from} – {edu.to})
                </span>
                <p>{edu.institute}</p>
              </div>
            ))}
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
        border: `1px solid ${config.colors.line}`,
      }}
    >
      {/* ================= HEADER ================= */}
      {!isEmpty(personal) && (
        <div
          style={{
            paddingBottom: "20px",
            borderBottom: `2px solid ${config.colors.line}`,
            marginBottom: config.spacing.sectionGap,
          }}
        >
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              fontWeight: 800,
              color: config.colors.primary,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ color: config.colors.muted }}>
            {personal.title} · {personal.address}
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {personal.email && <a href={`mailto:${personal.email}`}>{personal.email}</a>}
            {personal.phone && <a href={`tel:${personal.phone}`}>{personal.phone}</a>}
            {personal.github && <a href={`https://${personal.github}`}>GitHub</a>}
            {personal.linkedin && <a href={`https://${personal.linkedin}`}>LinkedIn</a>}
          </div>
        </div>
      )}

      {/* ================= SUMMARY ================= */}
      {personal?.summary && (
        <>
          <SectionTitle title="Profile" config={config} />
          <p>{personal.summary}</p>
        </>
      )}

      {/* ================= BODY (ORDERED) ================= */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default CareerTimelineResume;
