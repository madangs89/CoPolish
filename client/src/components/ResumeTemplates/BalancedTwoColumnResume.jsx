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
  switch (config.listStyle) {
    case "numbers":
      return "decimal";
    case "dots":
      return "disc";
    case "bullets":
      return "circle";
    case "dash":
    case "none":
      return "none";
    default:
      return "decimal";
  }
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <div style={{ marginBottom: config.spacing.itemGap }}>
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
    {config.decorations?.showDividers && (
      <div
        style={{
          height: 1,
          background: config.colors.line,
          marginTop: 4,
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
        ...textSafe,
      }}
    >
      {text}
    </a>
  );
};

/* ================= TEMPLATE ================= */

const BalancedTwoColumnResume = ({ data, config }) => {
  const { personal = {} } = data;

  /* ---------- LEFT COLUMN ---------- */
  const renderLeft = () => (
    <>
      {/* SKILLS */}
      {!isEmpty(data.skills) && (
        <>
          <SectionTitle title="Skills" config={config} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: `${config.typography.fontSize.small}px`,
                  padding: "6px 10px",
                  borderRadius: 6,
                  background: "#f8fafc",
                  border: `1px solid ${config.colors.line}`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </>
      )}

      {/* EDUCATION */}
      {!isEmpty(data.education) && (
        <>
          <SectionTitle title="Education" config={config} />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
              <div
                style={{
                  fontWeight: 600,
                  fontFamily: config.typography.fontFamily.heading,
                }}
              >
                {e.degree}
              </div>
              <div style={baseText(config)}>{e.institute}</div>
              <div
                style={{
                  fontSize: `${config.typography.fontSize.small}px`,
                  color: config.colors.muted,
                }}
              >
                {e.from} {e.to && `– ${e.to}`}
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
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div
                style={{
                  fontSize: `${config.typography.fontSize.small}px`,
                  color: config.colors.muted,
                }}
              >
                {c.issuer} {c.year && `· ${c.year}`}
              </div>
            </div>
          ))}
        </>
      )}

      {/* HOBBIES */}
      {!isEmpty(data.hobbies) && (
        <>
          <SectionTitle title="Hobbies" config={config} />
          <p style={baseText(config)}>{data.hobbies.join(" · ")}</p>
        </>
      )}
    </>
  );

  /* ---------- RIGHT COLUMN ---------- */
  const renderRight = () => (
    <>
      {/* SUMMARY */}
      {personal.summary && (
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
                <div style={{ fontWeight: 600 }}>
                  {exp.role} · {exp.company}
                </div>
                <div
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                  }}
                >
                  {exp.duration}
                </div>
              </div>

              {!isEmpty(exp.description) && (
                <ul
                  style={{
                    paddingLeft: config.listStyle === "none" ? 0 : 18,
                    listStyleType: getListStyle(config),
                    marginTop: 6,
                  }}
                >
                  {exp.description.map((d, j) => (
                    <li key={j} style={baseText(config)}>
                      {d}
                    </li>
                  ))}
                </ul>
              )}
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
              <div style={{ fontWeight: 600 }}>{p.title}</div>

              {!isEmpty(p.technologies) && (
                <div
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                    margin: "2px 0 6px",
                  }}
                >
                  Tech: {p.technologies.join(", ")}
                </div>
              )}

              {!isEmpty(p.description) && (
                <ul
                  style={{
                    paddingLeft: config.listStyle === "none" ? 0 : 18,
                    listStyleType: getListStyle(config),
                  }}
                >
                  {p.description.map((d, j) => (
                    <li key={j} style={baseText(config)}>
                      {d}
                    </li>
                  ))}
                </ul>
              )}

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

      {/* ACHIEVEMENTS */}
      {!isEmpty(data.achievements) && (
        <>
          <SectionTitle title="Achievements" config={config} />
          <ul style={{ paddingLeft: 18 }}>
            {data.achievements.map((a, i) => (
              <li key={i} style={baseText(config)}>
                {a}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* EXTRACURRICULAR */}
      {!isEmpty(data.extracurricular) && (
        <>
          <SectionTitle title="Extracurricular" config={config} />
          {data.extracurricular.map((e, i) => (
            <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
              <div style={{ fontWeight: 600 }}>
                {e.role} {e.activity && `· ${e.activity}`}
              </div>
              {e.year && (
                <div
                  style={{
                    fontSize: `${config.typography.fontSize.small}px`,
                    color: config.colors.muted,
                  }}
                >
                  {e.year}
                </div>
              )}
              {e.description && <p style={baseText(config)}>{e.description}</p>}
            </div>
          ))}
        </>
      )}
    </>
  );

  /* ================= RENDER ================= */

  return (
    <div
      style={{
        fontFamily: config.typography.fontFamily.body,
        color: config.colors.text,
        lineHeight: config.typography.lineHeight,
      }}
    >
      {/* HEADER */}
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

        <div
          style={{
            fontSize: `${config.typography.fontSize.small}px`,
            color: config.colors.muted,
            margin: "6px 0",
          }}
        >
          {personal.title} {personal.address && `· ${personal.address}`}
        </div>

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

      {/* TWO COLUMN LAYOUT */}
      <div
        className="w-full flex "
        style={{
          // display: "grid",
          // gridTemplateColumns: `${config.layout.columnRatio[0]}fr ${config.layout.columnRatio[1]}fr`,
          gap: config.spacing.sectionGap,
        }}
      >
        <div
        className="w-[40%]"
        
        >{renderLeft()}</div>
        <div
        
         className="w-[60%]"
        >{renderRight()}</div>
      </div>
    </div>
  );
};

export default BalancedTwoColumnResume;
