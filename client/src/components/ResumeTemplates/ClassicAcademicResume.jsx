import React from "react";

/* ================= HELPERS ================= */

const isEmpty = (v) => {
  if (!v) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object")
    return Object.values(v).every(
      (x) => x === null || x === "" || (Array.isArray(x) && x.length === 0)
    );
  return false;
};

const textSafe = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

const baseText = (config) => ({
  fontSize: `${config.typography.fontSize.body}px`,
  lineHeight: config.typography.lineHeight,
  color: config.colors.text,
  ...textSafe,
});

/* ================= UI ================= */

const SectionTitle = ({ title, config }) => (
  <div style={{ marginTop: config.spacing.sectionGap }}>
    <h2
      style={{
        fontSize: `${config.typography.fontSize.section}px`,
        fontFamily: config.typography.fontFamily.heading,
        fontWeight: 700,
        textTransform: "uppercase",
        margin: 0,
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: 1,
        background: config.colors.line,
        marginTop: 4,
      }}
    />
  </div>
);

const Row = ({ left, right, config, bold }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 4,
      ...baseText(config),
      fontWeight: bold ? 600 : 400,
    }}
  >
    <div style={{ flex: 1 }}>{left}</div>
    {right && (
      <div
        style={{
          whiteSpace: "nowrap",
          fontSize: `${config.typography.fontSize.small}px`,
        }}
      >
        {right}
      </div>
    )}
  </div>
);

/* ================= TEMPLATE ================= */

const ClassicAcademicResume = ({ data, config }) => {
  const { personal = {} } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      /* ========== SKILLS ========== */
      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            {Object.entries(data.skillsGrouped || {}).map(
              ([group, skills]) => (
                <p key={group} style={baseText(config)}>
                  <strong>{group}:</strong> {skills.join(", ")}
                </p>
              )
            )}
          </>
        );

      /* ========== PROJECTS ========== */
      case "projects":
        return (
          <>
            <SectionTitle title="Projects" config={config} />
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <Row
                  left={
                    <>
                      <strong>{p.title}</strong>
                      {p.role && ` — ${p.role}`}
                    </>
                  }
                  right={p.duration}
                  config={config}
                  bold
                />

                {!isEmpty(p.technologies) && (
                  <p
                    style={{
                      fontStyle: "italic",
                      fontSize: `${config.typography.fontSize.small}px`,
                      margin: "2px 0",
                    }}
                  >
                    Tech Stack: {p.technologies.join(", ")}
                  </p>
                )}

                {!isEmpty(p.description) && (
                  <ul style={{ paddingLeft: 18 }}>
                    {p.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}

                {!isEmpty(p.link) &&
                  p.link.map(
                    (l, idx) =>
                      l?.url && (
                        <a
                          key={idx}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: `${config.typography.fontSize.small}px`,
                            color: config.colors.accent,
                          }}
                        >
                          {l.title || "GitHub Repository"}
                        </a>
                      )
                  )}
              </div>
            ))}
          </>
        );

      /* ========== EDUCATION ========== */
      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <Row
                  left={
                    <>
                      <strong>{edu.institute}</strong>
                      <br />
                      {edu.degree}
                      {edu.branch && `, ${edu.branch}`}
                    </>
                  }
                  right={`${edu.from} – ${edu.to}`}
                  config={config}
                  bold
                />
                {edu.grade && (
                  <p style={{ margin: 0 }}>
                    {edu.gradeLabel || "Grade"}: {edu.grade}
                  </p>
                )}
              </div>
            ))}
          </>
        );

      /* ========== CERTIFICATIONS ========== */
      case "certifications":
        return (
          <>
            <SectionTitle title="Awards and Certifications" config={config} />
            <ul style={{ paddingLeft: 18 }}>
              {data.certifications.map((c, i) => (
                <li key={i}>
                  <strong>{c.name}</strong>
                  {c.issuer && ` — ${c.issuer}`}
                  {c.year && ` (${c.year})`}
                </li>
              ))}
            </ul>
          </>
        );

      /* ========== ACHIEVEMENTS & EXTRACURRICULAR ========== */
      case "achievements":
      case "extracurricular":
        return (
          <>
            <SectionTitle
              title={
                section === "achievements"
                  ? "Achievements"
                  : "Activities & Extracurricular"
              }
              config={config}
            />
            <ul style={{ paddingLeft: 18 }}>
              {data[section].map((a, i) => (
                <li key={i}>
                  {typeof a === "string" ? a : a.title}
                  {a.description && ` — ${a.description}`}
                </li>
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
      style={{
        fontFamily: config.typography.fontFamily.body,
        lineHeight: config.typography.lineHeight,
        ...textSafe,
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: config.spacing.sectionGap }}>
        <h1
          style={{
            fontSize: `${config.typography.fontSize.name}px`,
            fontFamily: config.typography.fontFamily.heading,
            margin: 0,
          }}
        >
          {personal.name}
        </h1>

        <p style={{ margin: "4px 0" }}>
          {personal.email} · {personal.phone}
        </p>

        <p style={{ margin: 0 }}>
          {personal.github && (
            <a href={personal.github}>GitHub</a>
          )}{" "}
          {personal.linkedin && (
            <>· <a href={personal.linkedin}>LinkedIn</a></>
          )}
        </p>
      </div>

      {/* ORDERED SECTIONS */}
      {config.content.order.map((s) => (
        <div key={s}>{renderSection(s)}</div>
      ))}
    </div>
  );
};

export default ClassicAcademicResume;
