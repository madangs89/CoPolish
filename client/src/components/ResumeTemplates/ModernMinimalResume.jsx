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

/* ================= GLOBAL SAFE TEXT ================= */

const textSafe = {
  overflowWrap: "break-word",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

/* ================= LIST STYLE ================= */

const getListStyle = (config) => {
  switch (config.listStyle) {
    case "Numbers":
      return "decimal";
    case "Dots":
      return "disc";
    case "Bullets":
      return "circle";
    case "Dash":
      return "none";
    case "None":
      return "none";
    default:
      return "decimal";
  }
};

/* ================= BASE TEXT ================= */

const baseText = (config) => ({
  fontSize: `${config.typography.fontSize.body}px`,
  lineHeight: config.typography.lineHeight,
  color: config.colors.text,
  ...textSafe,
});

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config, isFirst }) => (
  <div
    style={{
      marginTop: isFirst ? 0 : config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap,
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: `${config.typography.fontSize.section}px`,
        fontFamily: config.typography.fontFamily.heading,
        fontWeight: 700,
        color: config.colors.primary,
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        ...textSafe,
      }}
    >
      {title}
    </h2>

    {config.decorations?.showDividers && (
      <div
        style={{
          height: 1,
          background: config.colors.line,
          marginTop: 6,
        }}
      />
    )}
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
        cursor: "pointer",
        pointerEvents: "auto",
        overflowWrap: "anywhere",
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const ModernMinimalResume = ({ data, config }) => {
  const { personal = {} } = data;
  let firstSectionRendered = false;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    const sectionTitle = (
      <SectionTitle
        title={section.charAt(0).toUpperCase() + section.slice(1)}
        config={config}
        isFirst={!firstSectionRendered}
      />
    );

    firstSectionRendered = true;

    switch (section) {
      case "experience":
        return (
          <>
            {sectionTitle}
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontFamily: config.typography.fontFamily.heading,
                      ...baseText(config),
                    }}
                  >
                    {exp.role}
                    {exp.company && ` — ${exp.company}`}
                  </div>

                  {exp.duration && (
                    <div
                      style={{
                        fontSize: `${config.typography.fontSize.small}px`,
                        color: config.colors.muted,
                      }}
                    >
                      {exp.duration}
                    </div>
                  )}
                </div>

                {!isEmpty(exp.description) && (
                  <ul
                    style={{
                      marginTop: 6,
                      paddingLeft:
                        config.listStyle === "None" ? 0 : 18,
                      listStyleType: getListStyle(config),
                      ...baseText(config),
                    }}
                  >
                    {exp.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </>
        );

      case "projects":
        return (
          <>
            {sectionTitle}
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontFamily: config.typography.fontFamily.heading,
                    ...baseText(config),
                  }}
                >
                  {p.title}
                </div>

                {!isEmpty(p.description) && (
                  <ul
                    style={{
                      marginTop: 6,
                      paddingLeft:
                        config.listStyle === "None" ? 0 : 18,
                      listStyleType: getListStyle(config),
                      ...baseText(config),
                    }}
                  >
                    {p.description.map((d, j) => (
                      <li key={j}>{d}</li>
                    ))}
                  </ul>
                )}

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
            {sectionTitle}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    background: "#f3f4f6",
                    padding: "4px 8px",
                    borderRadius: 4,
                    ...textSafe,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        );

      case "education":
        return (
          <>
            {sectionTitle}
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontFamily: config.typography.fontFamily.heading,
                      ...baseText(config),
                    }}
                  >
                    {edu.degree}
                  </div>

                  <div
                    style={{
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.muted,
                    }}
                  >
                    {edu.from}
                    {edu.to && ` – ${edu.to}`}
                  </div>
                </div>

                <p style={{ margin: 0, ...baseText(config) }}>
                  {edu.institute}
                </p>
              </div>
            ))}
          </>
        );

      case "certifications":
        return (
          <>
            {sectionTitle}
            {data.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontFamily: config.typography.fontFamily.heading,
                    ...baseText(config),
                  }}
                >
                  {c.name}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                  }}
                >
                  {c.issuer}
                  {c.year && ` · ${c.year}`}
                </p>

                {!isEmpty(c.link) &&
                  c.link.map(
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

      case "achievements":
        return (
          <>
            {sectionTitle}
            <ul
              style={{
                paddingLeft:
                  config.listStyle === "None" ? 0 : 18,
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
            {sectionTitle}
            {data.extracurricular.map((e, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontFamily: config.typography.fontFamily.heading,
                    ...baseText(config),
                  }}
                >
                  {e.role}
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                  }}
                >
                  {e.activity}
                  {e.year && ` · ${e.year}`}
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
            {sectionTitle}
            <p style={{ margin: 0, ...baseText(config) }}>
              {data.hobbies.join(" · ")}
            </p>
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
        color: config.colors.text,
        lineHeight: config.typography.lineHeight,
        ...textSafe,
      }}
    >
      {/* HEADER */}
      {!isEmpty(personal) && (
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              margin: 0,
              fontSize: `${config.typography.fontSize.name}px`,
              fontFamily: config.typography.fontFamily.heading,
              fontWeight: 800,
              color: config.colors.primary,
            }}
          >
            {personal.name}
          </h1>

          {(personal.title || personal.address) && (
            <p
              style={{
                margin: "4px 0",
                fontSize: `${config.typography.fontSize.body}px`,
                color: config.colors.muted,
              }}
            >
              {personal.title}
              {personal.address && ` · ${personal.address}`}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
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
                href={personal.github}
                text="GitHub"
                config={config}
              />
            )}
            {personal.linkedin && (
              <LinkItem
                href={personal.linkedin}
                text="LinkedIn"
                config={config}
              />
            )}
            {personal.hackerRank && (
              <LinkItem
                href={personal.hackerRank}
                text="HackerRank"
                config={config}
              />
            )}
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {personal?.summary && (
        <>
          <SectionTitle
            title="Summary"
            config={config}
            isFirst={!firstSectionRendered}
          />
          <p style={{ margin: 0, ...baseText(config) }}>
            {personal.summary}
          </p>
          {(firstSectionRendered = true)}
        </>
      )}

      {/* BODY */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ModernMinimalResume;
