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

/* ================= LIST STYLE ================= */

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

const SectionTitle = ({ title, config, isFirst }) => (
  <div
    style={{
      marginTop: isFirst ? 0 : config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <h2
        style={{
          margin: 0,
          fontSize: `${config.typography.fontSize.section}px`,
          fontFamily: config.typography.fontFamily.heading,
          fontWeight: 700,
          color: config.colors.primary,
          textTransform: "uppercase",
          letterSpacing: "0.6px",

          /* 🔒 CRITICAL */
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
        cursor: "pointer",
        ...textSafe,
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const CleanProfessionalResume = ({ data, config }) => {
  const { personal = {} } = data;
  let firstSectionRendered = false;

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
          marginTop: 6,
          paddingLeft: style === "none" ? 0 : 18,
          listStyleType: getListStyle(config),
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
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div
                    style={{
                      fontFamily: config.typography.fontFamily.heading,
                      fontWeight: 600,
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
                      }}
                    >
                      {exp.duration}
                    </div>
                  )}
                </div>
                {!isEmpty(exp.description) &&
                  renderList(exp.description)}
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
                      margin: "4px 0",
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.muted,
                    }}
                  >
                    Tech: {p.technologies.join(", ")}
                  </p>
                )}

                {!isEmpty(p.description) &&
                  renderList(p.description)}

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    padding: "6px 10px",
                    border: `1px solid ${config.colors.line}`,
                    borderRadius: 6,
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
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div
                    style={{
                      fontFamily: config.typography.fontFamily.heading,
                      fontWeight: 600,
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
                    fontFamily: config.typography.fontFamily.heading,
                    fontWeight: 600,
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
              </div>
            ))}
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

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
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

export default CleanProfessionalResume;
