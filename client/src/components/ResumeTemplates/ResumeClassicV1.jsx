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
  <h2
    style={{
      marginTop: config.spacing.sectionGap,
      marginBottom: 6,
      fontSize: `${config.typography.fontSize.section}px`,
      fontFamily: config.typography.fontFamily.heading,
      fontWeight: 700,
      color: config.colors.primary,
      ...textSafe,
    }}
  >
    {title}
  </h2>
);

const LinkItem = ({ href, text, config }) => {
  const finalHref =
    href?.startsWith("http") || href?.startsWith("mailto")
      ? href
      : `https://${href}`;

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: `${config.typography.fontSize.small}px`,
        color: config.colors.accent,
        textDecoration: "underline",
        ...textSafe,
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const ResumeClassicV1 = ({ data, config }) => {
  const { personal = {} } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Work Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <p style={{ fontWeight: 700, margin: 0 }}>
                  {exp.role} – {exp.company}
                </p>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    margin: "2px 0 6px",
                    color: config.colors.muted,
                  }}
                >
                  {exp.duration}
                </p>

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
                <p style={{ fontWeight: 700, margin: 0 }}>{p.title}</p>

                {!isEmpty(p.technologies) && (
                  <p
                    style={{
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.muted,
                      margin: "2px 0",
                    }}
                  >
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

                {!isEmpty(p.link) &&
                  p.link.map(
                    (l, idx) =>
                      l?.url && (
                        <div key={idx}>
                          <LinkItem
                            href={l.url}
                            text={l.title || l.url}
                            config={config}
                          />
                        </div>
                      )
                  )}
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            <p style={baseText(config)}>{data.skills.join(", ")}</p>
          </>
        );

      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <p style={{ margin: 0 }}>{edu.degree}</p>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    margin: "2px 0",
                    color: config.colors.muted,
                  }}
                >
                  {edu.institute} | {edu.from} – {edu.to}
                </p>
              </div>
            ))}
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
        color: config.colors.text,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      {!isEmpty(personal) && (
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              margin: 0,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ margin: 0 }}>{personal.title}</p>

          <p
            style={{
              fontSize: `${config.typography.fontSize.small}px`,
              marginTop: 6,
            }}
          >
            {personal.email} | {personal.phone} | {personal.address}
          </p>

          <p
            style={{
              fontSize: `${config.typography.fontSize.small}px`,
              marginTop: 2,
            }}
          >
            {personal.linkedin && (
              <>
                <LinkItem
                  href={personal.linkedin}
                  text="LinkedIn"
                  config={config}
                />{" "}
                |
              </>
            )}{" "}
            {personal.github && (
              <LinkItem
                href={personal.github}
                text="GitHub"
                config={config}
              />
            )}
          </p>
        </div>
      )}

      {/* SUMMARY */}
      {personal?.summary && (
        <>
          <SectionTitle title="Professional Summary" config={config} />
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

export default ResumeClassicV1;
