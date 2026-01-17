import React from "react";

const SKILL_CATEGORIES = {
  Languages: [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "Dart",
    "R",
    "MATLAB",
    "Scala",
    "Perl",
  ],

  "Frameworks & Libraries": [
    // Frontend
    "React",
    "Next.js",
    "Vue.js",
    "Nuxt.js",
    "Angular",
    "Svelte",
    "Redux",
    "Redux Toolkit",
    "Zustand",
    "Recoil",
    "React Query",
    "TanStack Query",
    "GSAP",
    "Three.js",

    // Backend
    "Node.js",
    "Express.js",
    "NestJS",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Spring MVC",
    "Laravel",
    "Ruby on Rails",
    "ASP.NET Core",

    // Mobile
    "React Native",
    "Flutter",
    "SwiftUI",
  ],

  Databases: [
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "MariaDB",
    "Oracle",
    "Microsoft SQL Server",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "Firebase Firestore",
    "Supabase",
  ],

  "DevOps & Cloud": [
    "Docker",
    "Docker Compose",
    "Kubernetes",
    "AWS",
    "EC2",
    "S3",
    "Lambda",
    "CloudFront",
    "RDS",
    "GCP",
    "Azure",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitHub Actions",
    "CI/CD",
  ],

  "Tools & Platforms": [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Postman",
    "Jira",
    "Confluence",
    "Trello",
    "Slack",
    "Vite",
    "Webpack",
    "Babel",
    "ESLint",
    "Prettier",
    "npm",
    "yarn",
    "pnpm",
  ],

  "Concepts & Architecture": [
    "REST APIs",
    "GraphQL",
    "WebSockets",
    "Socket.IO",
    "gRPC",
    "Microservices",
    "Monolithic Architecture",
    "Event-Driven Architecture",
    "Scalable Systems",
    "Caching",
    "Rate Limiting",
    "Authentication",
    "Authorization",
    "JWT",
    "OAuth",
    "OAuth 2.0",
    "HTTPS",
    "CORS",
    "OWASP",
  ],

  "Soft Skills": [
    "Problem Solving",
    "Critical Thinking",
    "Communication",
    "Team Collaboration",
    "Leadership",
    "Time Management",
    "Adaptability",
    "Mentoring",
  ],
};

/* ================= HELPERS ================= */

const isEmpty = (value) => {
  if (!value) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object")
    return Object.values(value).every((v) => !v || v.length === 0);
  return false;
};

const SKILL_ALIASES = {
  javascript: ["js", "javascript es6", "javascript es6+"],
  react: ["reactjs", "context api"],
  node: ["nodejs"],
  "socket io": ["socketio"],
  "rest apis": ["restful apis", "rest api"],
  sql: ["mysql", "postgresql", "postgres"],
};

const normalize = (str = "") =>
  str
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove (ES6+), (Moderate)
    .replace(/\.js/g, "") // react.js → react
    .replace(/[^a-z0-9+ ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const resolveSkill = (skill) => {
  const n = normalize(skill);

  for (const [base, aliases] of Object.entries(SKILL_ALIASES)) {
    if (n === base) return base;
    if (aliases.some((a) => n.includes(a))) return base;
  }

  return n;
};

const groupSkills = (skills = [], maxCategories = 4) => {
  const grouped = {};
  const used = new Set();

  for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
    const normalizedCategorySkills = categorySkills.map((s) =>
      normalize(resolveSkill(s))
    );

    for (const rawSkill of skills) {
      const resolved = resolveSkill(rawSkill);

      // 🔴 IMPORTANT: skip if already assigned
      if (used.has(resolved)) continue;

      if (normalizedCategorySkills.includes(normalize(resolved))) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(rawSkill);
        used.add(resolved);
      }
    }

    if (Object.keys(grouped).length >= maxCategories) break;
  }

  // Remaining → Other
  const others = skills.filter((s) => !used.has(resolveSkill(s)));

  if (others.length && Object.keys(grouped).length < maxCategories + 1) {
    grouped["Other"] = others;
  }

  return grouped;
};

const renderGroupedSkills = (skills = [], config) => {
  const groupedSkills = groupSkills(skills);

  return Object.entries(groupedSkills).map(([category, items]) => (
    <div
      className="flex"
      key={category}
      style={{
        marginBottom: `${config.spacing.itemGap}px`,
      }}
    >
      {/* Category */}
      <div
        className="mr-2"
        style={{
          fontWeight: 600,
          fontSize: `${config.typography.fontSize.small}px`,
          marginBottom: "4px",
          color: config.colors.primary,
        }}
      >
        {category}:
      </div>

      {/* Skills */}
      <div
        style={{
          fontSize: `${config.typography.fontSize.small}px`,
          color: config.colors.text,
          lineHeight: config.typography.lineHeight,
        }}
      >
        {items.join(", ")}
      </div>
    </div>
  ));
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title, config }) => (
  <h2
    style={{
      fontSize: `${config.typography.fontSize.section}px`,
      fontWeight: 700,
      marginBottom: `${config.spacing.itemGap}px`,
      color: config.colors.primary,
    }}
  >
    {title}
  </h2>
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
      display: "block",
      marginBottom: "6px",
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const BalancedTwoColumnResume = ({ data, config }) => {
  const { personal } = data;
  console.log(config);

  const renderSection = (section) => {
    if (isEmpty(data[section])) return null;

    switch (section) {
      case "experience":
        return (
          <>
            <SectionTitle title="Work Experience" config={config} />
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
                    {exp.role} · {exp.company}
                  </span>
                  <span style={{ color: config.colors.muted }}>
                    {exp.duration}
                  </span>
                </div>
                <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
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
                <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                  {p.description.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
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
                <strong>{edu.degree}</strong>
                <p style={{ color: config.colors.muted }}>{edu.institute}</p>
                <p style={{ color: config.colors.muted }}>
                  {edu.from} – {edu.to}
                </p>
              </div>
            ))}
          </>
        );

      case "skills":
        return (
          <>
            <SectionTitle title="Skills" config={config} />
            {renderGroupedSkills(data.skills, config)}
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
        border: `1px solid ${config.colors.line}`,
      }}
    >
      {/* ================= HEADER ================= */}
      {!isEmpty(personal) && (
        <div style={{ marginBottom: config.spacing.sectionGap }}>
          <h1
            style={{
              fontSize: `${config.typography.fontSize.name}px`,
              fontWeight: 800,
            }}
          >
            {personal.name}
          </h1>

          <p style={{ color: config.colors.muted }}>
            {personal.title} · {personal.address}
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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

      {personal?.summary && (
        <p style={{ marginBottom: config.spacing.sectionGap }}>
          {personal.summary}
        </p>
      )}

      {/* ================= BODY ================= */}
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
