import React from "react";

/* ================= HELPERS ================= */

const isEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object")
    return Object.values(value).every((v) => !v || v.length === 0);
  return false;
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <h2
    style={{
      fontSize: `${config.typography.fontSize.section}px`,
      fontWeight: 700,
      marginBottom: `${config.spacing.itemGap}px`,
      color: config.colors.primary,
    }}
  >
    {title}
  </h2>
);

const LinkItem = ({ href, text, config }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: config.colors.accent,
      textDecoration: "none",
      fontSize: `${config.typography.fontSize.small}px`,
      display: "block",
      marginBottom: "6px",
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const BalancedTwoColumnResume = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Work Experience" config={config} />
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
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{edu.degree}</strong>
                <p style={{ color: config.colors.muted }}>{edu.institute}</p>
                <p style={{ color: config.colors.muted }}>
                  {edu.from} – {edu.to}
                </p>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
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
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              fontWeight: 800,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ color: config.colors.muted }}>
            {personal.title} · {personal.address}
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {personal.email && (
              <LinkItem
                href={`mailto:${personal.email}`}
                text={personal.email}
                config={config}
              />
            )}
            {personal.phone && (
              <LinkItem
                href={`tel:${personal.phone}`}
                text={personal.phone}
                config={config}
              />
            )}
            {personal.github && (
              <LinkItem
                href={`https://${personal.github}`}
                text="GitHub"
                config={config}
              />
            )}
            {personal.linkedin && (
              <LinkItem
                href={`https://${personal.linkedin}`}
                text="LinkedIn"
                config={config}
              />
            )}
          </div>
        </div>
      )}

      {personal?.summary && (
        <p style={{ marginBottom: config.spacing.sectionGap }}>
          {personal.summary}
        </p>
      )}

      {/* ================= BODY ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            config.layout.type === "two-column"
              ? `${config.layout.columnRatio[0]}fr ${config.layout.columnRatio[1]}fr`
              : "1fr",
          gap: config.spacing.sectionGap,
        }}
      >
        {config.content.order.map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
};

export default BalancedTwoColumnResume;
