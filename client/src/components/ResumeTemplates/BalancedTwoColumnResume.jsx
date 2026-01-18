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

/* ================= SKILL GROUPING (UNCHANGED LOGIC) ================= */

const SKILL_CATEGORIES = {
  Languages: ["JavaScript", "TypeScript", "Python", "Java", "C", "C++"],
  "Frameworks & Libraries": ["React", "Next.js", "Node.js", "Express.js"],
  Databases: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "DevOps & Cloud": ["Docker", "AWS", "GCP", "Azure"],
  "Tools & Platforms": ["Git", "GitHub", "Postman"],
  "Concepts & Architecture": ["REST APIs", "Microservices", "JWT"],
};

const normalize = (str = "") =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9+ ]/g, "")
    .trim();

const groupSkills = (skills = [], maxCategories = 4) => {
  const grouped = {};
  const used = new Set();

  for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
    const normalized = categorySkills.map(normalize);

    for (const raw of skills) {
      const n = normalize(raw);
      if (used.has(n)) continue;
      if (normalized.includes(n)) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(raw);
        used.add(n);
      }
    }
    if (Object.keys(grouped).length >= maxCategories) break;
  }

  const others = skills.filter((s) => !used.has(normalize(s)));
  if (others.length) grouped["Other"] = others;

  return grouped;
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <h2
    style={{
      margin: 0,
      marginBottom: config.spacing.itemGap,
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

const BalancedTwoColumnResume = ({ data, config }) => {
  const { personal = {} } = data;

  const renderSection = (section) => {
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

                {!isEmpty(exp.description) && (
                  <ul
                    style={{
                      marginTop: 6,
                      paddingLeft: config.listStyle === "None" ? 0 : 18,
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
            <SectionTitle title="Projects" config={config} />
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
                      paddingLeft: config.listStyle === "None" ? 0 : 18,
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

      case "education":
        return (
          <>
            <SectionTitle title="Education" config={config} />
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

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            {Object.entries(groupSkills(data.skills)).map(
              ([category, items]) => (
                <div key={category} style={{ marginBottom: 6 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: `${config.typography.fontSize.small}px`,
                      color: config.colors.primary,
                    }}
                  >
                    {category}:
                  </span>{" "}
                  <span style={baseText(config)}>{items.join(", ")}</span>
                </div>
              )
            )}
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

      {/* BODY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            config.layout.type === "two-column"
              ? `${config.layout.columnRatio[0]}fr ${config.layout.columnRatio[1]}fr`
              : "1fr",
          gap: config.spacing.sectionGap,
        }}
      >
        {config.content.order.map((section) => (
          <div key={section}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
};

export default BalancedTwoColumnResume;
