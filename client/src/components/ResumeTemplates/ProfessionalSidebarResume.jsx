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
  <div style={{ marginTop: config.spacing.sectionGap, marginBottom: 10 }}>
    <h3
      style={{
        margin: 0,
        fontSize: `${config.typography.fontSize.section}px`,
        fontFamily: config.typography.fontFamily.heading,
        fontWeight: 700,
        textTransform: "uppercase",
        color: config.colors.primary,
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </h3>
    {config.decorations?.showDividers && (
      <div style={{ height: 1, background: config.colors.line, marginTop: 6 }} />
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
        display: "block",
        fontSize: `${config.typography.fontSize.small}px`,
        color: config.colors.accent,
        textDecoration: "underline",
        marginBottom: 6,
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const ProfessionalSidebarResume = ({ data, config }) => {
  const { personal = {} } = data;

  return (
    <div
      style={{
        width: `${config.page.width}px`,
        minHeight: `${config.page.minHeight}px`,
        display: "flex",
        fontFamily: config.typography.fontFamily.body,
        background: config.page.background,
        boxSizing: "border-box",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: "210px",
          flexShrink: 0,
          background: "#f3f4f6",
          padding: config.page.padding,
          boxSizing: "border-box",
        }}
      >
        {!isEmpty(personal) && (
          <>
            <h1
              style={{
                margin: 0,
                fontSize: `${config.typography.fontSize.name}px`,
                fontFamily: config.typography.fontFamily.heading,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {personal.name}
            </h1>

            <p
              style={{
                fontSize: `${config.typography.fontSize.small}px`,
                color: config.colors.muted,
                marginBottom: 16,
              }}
            >
              {personal.title}
            </p>

            <SectionTitle title="Contact" config={config} />

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
          </>
        )}

        {!isEmpty(data.skills) && (
          <>
            <SectionTitle title="Skills" config={config} />
            {data.skills.map((s, i) => (
              <div key={i} style={{ fontSize: config.typography.fontSize.small }}>
                {s}
              </div>
            ))}
          </>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          padding: config.page.padding,
          boxSizing: "border-box",
        }}
      >
        {personal?.summary && (
          <>
            <SectionTitle title="Summary" config={config} />
            <p style={baseText(config)}>{personal.summary}</p>
          </>
        )}

        {/* EXPERIENCE */}
        {!isEmpty(data.experience) && (
          <>
            <SectionTitle title="Experience" config={config} />
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{exp.role} · {exp.company}</strong>
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
        )}

        {/* PROJECTS */}
        {!isEmpty(data.projects) && (
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
        )}

        {/* EDUCATION */}
        {!isEmpty(data.education) && (
          <>
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i}>
                <strong>{edu.degree}</strong>
                <div style={{ color: config.colors.muted }}>
                  {edu.institute} · {edu.from} – {edu.to}
                </div>
              </div>
            ))}
          </>
        )}

        {/* CERTIFICATIONS */}
        {!isEmpty(data.certifications) && (
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
        )}

        {/* ACHIEVEMENTS */}
        {!isEmpty(data.achievements) && (
          <>
            <SectionTitle title="Achievements" config={config} />
            <ul style={{ paddingLeft: 18 }}>
              {data.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </>
        )}

        {/* EXTRACURRICULAR */}
        {!isEmpty(data.extracurricular) && (
          <>
            <SectionTitle title="Extracurricular" config={config} />
            {data.extracurricular.map((e, i) => (
              <div key={i}>
                <strong>{e.role}</strong> – {e.activity} ({e.year})
              </div>
            ))}
          </>
        )}

        {/* HOBBIES */}
        {!isEmpty(data.hobbies) && (
          <>
            <SectionTitle title="Hobbies" config={config} />
            <p>{data.hobbies.join(" · ")}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfessionalSidebarResume;
