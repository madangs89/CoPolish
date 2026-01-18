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

const getListStyle = (config) => {
  switch ((config.listStyle || "").toLowerCase()) {
    case "numbers":
      return "decimal";
    case "dots":
      return "disc";
    case "bullets":
      return "circle";
    case "none":
    case "dash":
      return "none";
    default:
      return "decimal";
  }
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <div style={{ marginTop: config.spacing.sectionGap }}>
    <h2
      style={{
        margin: 0,
        fontSize: `${config.typography.fontSize.section}px`,
        fontFamily: config.typography.fontFamily.heading,
        fontWeight: 700,
        color: config.colors.primary,
        textTransform: "uppercase",
        ...textSafe,
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: 2,
        background: config.colors.primary,
        marginTop: 4,
        marginBottom: 8,
      }}
    />
  </div>
);

/* ================= TEMPLATE ================= */

const ResumeClassicBlue = ({ data, config }) => {
  const { personal = {} } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Professional Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{exp.role}, {exp.company}</strong>
                  <span style={{ color: config.colors.muted }}>
                    {exp.duration}
                  </span>
                </div>

                <ul
                  style={{
                    paddingLeft: 18,
                    listStyleType: getListStyle(config),
                    ...baseText(config),
                  }}
                >
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

                {!isEmpty(p.technologies) && (
                  <p style={{ color: config.colors.muted }}>
                    Tech: {p.technologies.join(", ")}
                  </p>
                )}

                <ul
                  style={{
                    paddingLeft: 18,
                    listStyleType: getListStyle(config),
                    ...baseText(config),
                  }}
                >
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
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{edu.degree}</strong>
                  <span style={{ color: config.colors.muted }}>
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p style={baseText(config)}>{edu.institute}</p>
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
                    ...baseText(config),
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </>
        );

      case "certifications":
        return (
          <>
            <SectionTitle title="Certifications" config={config} />
            {data.certifications.map((c, i) => (
              <div key={i}>
                <strong>{c.name}</strong>
                <div style={{ color: config.colors.muted }}>
                  {c.issuer} · {c.year}
                </div>
              </div>
            ))}
          </>
        );

      case "achievements":
        return (
          <>
            <SectionTitle title="Achievements" config={config} />
            <ul
              style={{
                paddingLeft: 18,
                listStyleType: getListStyle(config),
                ...baseText(config),
              }}
            >
              {data.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </>
        );

      case "extracurricular":
        return (
          <>
            <SectionTitle title="Extracurricular" config={config} />
            {data.extracurricular.map((e, i) => (
              <div key={i}>
                <strong>{e.role}</strong> – {e.activity} ({e.year})
                {e.description && <p>{e.description}</p>}
              </div>
            ))}
          </>
        );

      case "hobbies":
        return (
          <>
            <SectionTitle title="Hobbies" config={config} />
            <p>{data.hobbies.join(" · ")}</p>
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
        padding: config.page.padding,
        background: config.page.background,
        fontFamily: config.typography.fontFamily.body,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      {!isEmpty(personal) && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: `${config.typography.fontSize.name}px`,
                fontFamily: config.typography.fontFamily.heading,
                color: config.colors.primary,
              }}
            >
              {personal.name}
            </h1>

            <p style={{ fontWeight: 600 }}>{personal.title}</p>
            <p>{personal.address}</p>
            <p>
              {personal.phone} | {personal.email}
            </p>
          </div>

          {personal.avatar && (
            <img
              src={personal.avatar}
              alt="profile"
              style={{
                width: 90,
                height: 110,
                objectFit: "cover",
              }}
            />
          )}
        </div>
      )}

      {/* SUMMARY */}
      {personal?.summary && (
        <>
          <SectionTitle title="Summary" config={config} />
          <p style={baseText(config)}>{personal.summary}</p>
        </>
      )}

      {/* BODY */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ResumeClassicBlue;
