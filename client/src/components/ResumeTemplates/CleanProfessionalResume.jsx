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

/* ================= SAFE TEXT ================= */

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

const normalizeListStyle = (s = "") => s.toLowerCase();

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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong style={baseText(config)}>
                    {exp.role}
                    {exp.company && ` · ${exp.company}`}
                  </strong>
                  {exp.duration && (
                    <span
                      style={{
                        fontSize: `${config.typography.fontSize.small}px`,
                        color: config.colors.muted,
                      }}
                    >
                      {exp.duration}
                    </span>
                  )}
                </div>
                {!isEmpty(exp.description) && renderList(exp.description)}
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
                <strong style={baseText(config)}>{p.title}</strong>

                {!isEmpty(p.technologies) && (
                  <p
                    style={{
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.muted,
                      margin: "4px 0",
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
            <p style={{ ...baseText(config), color: config.colors.muted }}>
              {data.skills.join(", ")}
            </p>
          </>
        );

      case "education":
        return (
          <>
            {sectionTitle}
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong style={baseText(config)}>{edu.degree}</strong>
                <p style={{ margin: 0 }}>{edu.institute}</p>
                <p
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                    margin: 0,
                  }}
                >
                  {edu.from} {edu.to && `– ${edu.to}`}
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
              <p key={i} style={baseText(config)}>
                {c.name} — {c.issuer} {c.year && `(${c.year})`}
              </p>
            ))}
          </>
        );

      case "achievements":
        return (
          <>
            {sectionTitle}
            {renderList(data.achievements)}
          </>
        );

      case "extracurricular":
        return (
          <>
            {sectionTitle}
            {data.extracurricular.map((e, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <strong>{e.title}</strong>
                {e.description && <p>{e.description}</p>}
              </div>
            ))}
          </>
        );

      case "hobbies":
        return (
          <>
            {sectionTitle}
            <p>{data.hobbies.join(", ")}</p>
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
              fontSize: `${config.typography.fontSize.name}px`,
              fontFamily: config.typography.fontFamily.heading,
              fontWeight: 800,
              color: config.colors.primary,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ color: config.colors.muted }}>
            {personal.title}
            {personal.address && ` · ${personal.address}`}
          </p>

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
              <LinkItem href={personal.github} text="GitHub" config={config} />
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
          <p>{personal.summary}</p>
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
