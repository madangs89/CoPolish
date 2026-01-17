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

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <div
    style={{
      marginTop: config.spacing.sectionGap,
      marginBottom: config.spacing.itemGap / 1.5,
    }}
  >
    <h2
      style={{
        fontSize: `${config.typography.fontSize.section}px`,
        fontWeight: 700,
        color: config.colors.primary,
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        marginBottom: "6px",
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: "1px",
        background: config.colors.line,
      }}
    />
  </div>
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
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const ModernMinimalResume = ({ data, config }) => {
  const { personal } = data;

  const renderSection = (section) => {
    if (section === "personal") return null;
    if (isEmpty(data[section])) return null;

    switch (section) {
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
                    fontWeight: 600,
                  }}
                >
                  <span>
                    {exp.role} — {exp.company}
                  </span>
                  <span style={{ color: config.colors.muted }}>
                    {exp.duration}
                  </span>
                </div>
                <ul
                  className="list-decimal"
                  style={{ paddingLeft: "18px", marginTop: "6px" }}
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
                <ul
                  className="list-decimal"
                  style={{ paddingLeft: "18px", marginTop: "6px" }}
                >
                  {p.description.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    background: "#f3f4f6",
                    padding: "4px 8px",
                    borderRadius: "4px",
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
            <SectionTitle title="Education" config={config} />
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <span>{edu.degree}</span>
                  <span style={{ color: config.colors.muted }}>
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p>{edu.institute}</p>
              </div>
            ))}
          </>
        );

      case "certifications":
        return (
          <>
            <SectionTitle title="Certifications" config={config} />
            {data.certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{c.name}</strong>
                <p style={{ color: config.colors.muted }}>
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
            <ul>
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
              <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                <strong>{e.role}</strong>
                <p style={{ color: config.colors.muted }}>
                  {e.activity} {e.year && `· ${e.year}`}
                </p>
                {e.description && <p>{e.description}</p>}
              </div>
            ))}
          </>
        );

      case "hobbies":
        return (
          <>
            <SectionTitle title="Hobbies" config={config} />
            <p style={{ color: config.colors.muted }}>
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
      }}
    >
      {/* ================= HEADER ================= */}
      {!isEmpty(personal) && (
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              fontWeight: 800,
              color: config.colors.primary,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ color: config.colors.muted }}>
            {personal.title} · {personal.address}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
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

      {/* ================= SUMMARY ================= */}
      {personal?.summary && (
        <>
          <SectionTitle title="Summary" config={config} />
          <p>{personal.summary}</p>
        </>
      )}

      {/* ================= BODY (ORDERED) ================= */}
      {config.content.order.map((section) => (
        <div key={section}>{renderSection(section)}</div>
      ))}
    </div>
  );
};

export default ModernMinimalResume;
