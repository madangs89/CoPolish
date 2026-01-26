import React from "react";

/* ================= HELPERS ================= */

const isEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object")
    return Object.values(value).every(
      (v) => v === null || v === "" || (Array.isArray(v) && v.length === 0),
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

const normalizeListStyle = (style = "") => style.toLowerCase();

const getListStyle = (config) => {
  switch (normalizeListStyle(config.listStyle)) {
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
  <div
    style={{
      marginTop: config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <h2
        style={{
          margin: 0,
          fontSize: `${config.typography.fontSize.section}px`,
          fontFamily: config.typography.fontFamily.heading,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          color: config.colors.primary,

          /* prevent SKILL / S bug */
          whiteSpace: "nowrap",
          wordBreak: "normal",
          overflowWrap: "normal",
          flexShrink: 0,
        }}
      >
        {title}
      </h2>

      {config.decorations?.showDividers && (
        <div
          style={{
            height: 1,
            background: config.colors.line,
            width: "100%",
          }}
        />
      )}
    </div>
  </div>
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

const HarvardResume = ({ data, config }) => {
  const { personal = {} } = data;

  const renderList = (items) => {
    const style = normalizeListStyle(config.listStyle);

    if (style === "dash") {
      return items.map((d, i) => (
        <div key={i} style={{ display: "flex", gap: 6, ...baseText(config) }}>
          <span>–</span>
          <span>{d}</span>
        </div>
      ));
    }

    return (
      <ul
        style={{
          paddingLeft: style === "none" ? 0 : 18,
          listStyleType: getListStyle(config),
          marginTop: 4,
          ...baseText(config),
        }}
      >
        {items.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    );
  };

  const renderSection = (section) => {
    // if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "summary":
        return (
          <>
            <SectionTitle title="Summary" config={config} />
            <p style={{ margin: 0, ...baseText(config) }}>
              {data.personal.summary}
            </p>
          </>
        );

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
                    fontFamily: config.typography.fontFamily.heading,
                    fontWeight: 600,
                    ...baseText(config),
                  }}
                >
                  <span>{edu.institute}</span>
                  <span style={{ color: config.colors.muted }}>
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p style={{ margin: 0, ...baseText(config) }}>{edu.degree}</p>
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
                    fontFamily: config.typography.fontFamily.heading,
                    fontWeight: 600,
                    ...baseText(config),
                  }}
                >
                  <span>{exp.company}</span>
                  <span style={{ color: config.colors.muted }}>
                    {exp.duration}
                  </span>
                </div>
                <p
                  style={{
                    margin: "2px 0",
                    fontStyle: "italic",
                    ...baseText(config),
                  }}
                >
                  {exp.role}
                </p>
                {!isEmpty(exp.description) && renderList(exp.description)}
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
                <div
                  style={{
                    fontFamily: config.typography.fontFamily.heading,
                    fontWeight: 600,
                    ...baseText(config),
                  }}
                >
                  {p.title}
                </div>

                {!isEmpty(p.technologies) && (
                  <p
                    style={{
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.muted,
                    }}
                  >
                    Tech: {p.technologies.join(", ")}
                  </p>
                )}

                {!isEmpty(p.description) && renderList(p.description)}

                {!isEmpty(p.link) &&
                  p.link.map(
                    (l, idx) =>
                      l?.url && (
                        <LinkItem
                          key={idx}
                          href={l.url}
                          text={l.title || l.url}
                          config={config}
                        />
                      ),
                  )}
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            <p style={{ margin: 0, ...baseText(config) }}>
              {data.skills.join(", ")}
            </p>
          </>
        );

      case "certifications":
        return (
          <>
            <SectionTitle title="Certifications" config={config} />
            {data.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div style={{ fontWeight: 600, ...baseText(config) }}>
                  {c.name}
                </div>
                <p style={{ margin: 0, color: config.colors.muted }}>
                  {c.issuer} {c.year && `· ${c.year}`}
                </p>
              </div>
            ))}
          </>
        );

      case "achievements":
        return (
          <>
            <SectionTitle title="Achievements" config={config} />
            {renderList(data.achievements)}
          </>
        );

      case "extracurricular":
        return (
          <>
            <SectionTitle title="Extracurricular" config={config} />
            {data.extracurricular.map((e, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{e.role}</strong>
                <p style={{ margin: 0, color: config.colors.muted }}>
                  {e.activity} {e.year && `· ${e.year}`}
                </p>
                {e.description && (
                  <p style={{ margin: 0, ...baseText(config) }}>
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </>
        );

      case "hobbies":
        return (
          <>
            <SectionTitle title="Hobbies" config={config} />
            <p style={{ margin: 0, ...baseText(config) }}>
              {data.hobbies.join(" · ")}
            </p>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: config.typography.fontFamily.body,
        color: config.colors.text,
        lineHeight: config.typography.lineHeight,
      }}
    >
      {/* HEADER */}
      {!isEmpty(personal) && (
        <div
          style={{
            textAlign: "center",
            marginBottom: config.spacing.sectionGap,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: `${config.typography.fontSize.name}px`,
              fontFamily: config.typography.fontFamily.heading,
              fontWeight: 800,
            }}
          >
            {personal.name}
          </h1>

          <p
            style={{
              marginTop: 6,
              fontSize: `${config.typography.fontSize.small}px`,
              color: config.colors.muted,
              ...textSafe,
            }}
          >
            {personal.title} | {personal.email} | {personal.phone}
          </p>
        </div>
      )}

      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default HarvardResume;
