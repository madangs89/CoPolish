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

const baseText = (config) => ({
  fontSize: `${config.typography.fontSize.body}px`,
  lineHeight: config.typography.lineHeight,
  color: config.colors.text,
  ...textSafe,
});

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

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config, isFirst }) => (
  <h2
    style={{
      marginTop: isFirst ? 0 : config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap,
      fontSize: `${config.typography.fontSize.section}px`,
      fontFamily: config.typography.fontFamily.heading,
      fontWeight: 700,
      color: config.colors.primary,
      textTransform: "uppercase",
      letterSpacing: "0.6px",
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
        cursor: "pointer",
        pointerEvents: "auto",
        ...textSafe,
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const CareerTimelineResume = ({ data, config }) => {
  const { personal = {} } = data;
  let firstSectionRendered = false;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    const sectionTitle = (
      <SectionTitle
        title={
          section === "experience"
            ? "Career Timeline"
            : section.charAt(0).toUpperCase() + section.slice(1)
        }
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

            <div style={{ position: "relative", marginLeft: 18 }}>
              {config.decorations?.dividerStyle === "timeline" && (
                <div
                  style={{
                    position: "absolute",
                    left: 6,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: config.colors.line,
                  }}
                />
              )}

              {data.experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 16,
                    marginBottom: config.spacing.sectionGap,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: config.colors.accent,
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <div style={{ minWidth: 0 }}>
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
                          fontFamily:
                            config.typography.fontFamily.heading,
                          ...baseText(config),
                        }}
                      >
                        {exp.role}
                        {exp.company && ` · ${exp.company}`}
                      </div>

                      {exp.duration && (
                        <div
                          style={{
                            fontSize: `${config.typography.fontSize.small}px`,
                            color: config.colors.muted,
                            whiteSpace: "nowrap",
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
                </div>
              ))}
            </div>
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
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            {sectionTitle}
            <p style={{ ...baseText(config), color: config.colors.muted }}>
              {data.skills.join(" · ")}
            </p>
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
                    fontWeight: 600,
                    fontFamily: config.typography.fontFamily.heading,
                    ...baseText(config),
                  }}
                >
                  {edu.degree}
                </div>

                <p style={{ margin: 0, ...baseText(config) }}>
                  {edu.institute}
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                  }}
                >
                  {edu.from}
                  {edu.to && ` – ${edu.to}`}
                </p>
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

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
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
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {personal?.summary && (
        <>
          <SectionTitle
            title="Profile"
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

export default CareerTimelineResume;
