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

const SidebarSectionTitle = ({ title, config }) => (
  <div style={{ marginTop: config.spacing.sectionGap, marginBottom: 10 }}>
    <h3
      style={{
        fontSize: `${config.typography.fontSize.section}px`,
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: config.colors.primary,
        marginBottom: "6px",
      }}
    >
      {title}
    </h3>
    <div style={{ height: "1px", background: config.colors.line }} />
  </div>
);

const SidebarLink = ({ href, text, config }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "block",
      fontSize: `${config.typography.fontSize.small}px`,
      color: config.colors.accent,
      textDecoration: "none",
      marginBottom: "6px",
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const ProfessionalSidebarResume = ({ data, config }) => {
  const { personal } = data;

  const renderMainSection = (section) => {
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SidebarSectionTitle title="Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {exp.role} — {exp.company}
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
            ))}
          </>
        );

      case "projects":
        return (
          <>
            <SidebarSectionTitle title="Projects" config={config} />
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

      case "education":
        return (
          <>
            <SidebarSectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{edu.degree}</strong>
                  <span style={{ color: config.colors.muted }}>
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p>{edu.institute}</p>
              </div>
            ))}
          </>
        );

      case "achievements":
        return (
          <>
            <SidebarSectionTitle title="Achievements" config={config} />
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
        display: "flex",
        background: config.page.background,
        fontFamily: config.typography.fontFamily.body,
        color: config.colors.text,
        boxSizing: "border-box",
        boxShadow: `0 0 0 1px ${config.colors.line}`,
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: `${config.layout.columnRatio?.[0] || 260}px`,
          background: "#f3f4f6",
          padding: `${config.page.padding}px`,
          boxSizing: "border-box",
        }}
      >
        {!isEmpty(personal) && (
          <>
            <h1
              style={{
                fontSize: `${config.typography.fontSize.name}px`,
                fontWeight: 800,
                marginBottom: "4px",
              }}
            >
              {personal.name}
            </h1>

            <p
              style={{
                fontSize: `${config.typography.fontSize.small}px`,
                color: config.colors.muted,
                marginBottom: "16px",
              }}
            >
              {personal.title}
            </p>

            <SidebarSectionTitle title="Contact" config={config} />
            {personal.email && (
              <SidebarLink
                href={`mailto:${personal.email}`}
                text={personal.email}
                config={config}
              />
            )}
            {personal.phone && (
              <SidebarLink
                href={`tel:${personal.phone}`}
                text={personal.phone}
                config={config}
              />
            )}
            {personal.github && (
              <SidebarLink
                href={`https://${personal.github}`}
                text="GitHub"
                config={config}
              />
            )}
            {personal.linkedin && (
              <SidebarLink
                href={`https://${personal.linkedin}`}
                text="LinkedIn"
                config={config}
              />
            )}
          </>
        )}

        {!isEmpty(data.skills) && (
          <>
            <SidebarSectionTitle title="Skills" config={config} />
            {data.skills.map((skill, i) => (
              <div
                key={i}
                style={{
                  fontSize: `${config.typography.fontSize.small}px`,
                  marginBottom: "6px",
                }}
              >
                {skill}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          padding: `${config.page.padding}px`,
          boxSizing: "border-box",
          lineHeight: config.typography.lineHeight,
        }}
      >
        {personal?.summary && (
          <>
            <SidebarSectionTitle title="Summary" config={config} />
            <p>{personal.summary}</p>
          </>
        )}

        {config.content.order.map((section) => (
          <div key={section}>{renderMainSection(section)}</div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSidebarResume;
