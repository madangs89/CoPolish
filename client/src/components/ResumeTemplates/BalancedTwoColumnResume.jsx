import React from "react";

const SKILL_CATEGORIES = {
  "Programming Languages": [
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

  "Web Technologies": [
    "HTML",
    "HTML5",
    "CSS",
    "CSS3",
    "SASS",
    "SCSS",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Chakra UI",
    "Ant Design",
  ],

  "Frontend Frameworks & Libraries": [
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
  ],

  "Backend Frameworks": [
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

  "Version Control & Collaboration": [
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "Jira",
    "Confluence",
    "Trello",
    "Slack",
  ],

  "APIs & Communication": [
    "REST APIs",
    "GraphQL",
    "WebSockets",
    "Socket.IO",
    "gRPC",
    "JSON",
    "XML",
  ],

  Testing: [
    "Jest",
    "Mocha",
    "Chai",
    "Vitest",
    "Cypress",
    "Playwright",
    "Selenium",
    "JUnit",
    "PyTest",
    "Postman",
  ],

  "Mobile Development": [
    "Android",
    "Android Studio",
    "Java (Android)",
    "Kotlin (Android)",
    "React Native",
    "Flutter",
    "SwiftUI",
    "iOS Development",
  ],

  "System Design & Architecture": [
    "Microservices",
    "Monolithic Architecture",
    "Event-Driven Architecture",
    "RESTful Design",
    "Scalable Systems",
    "Load Balancing",
    "Caching",
    "Rate Limiting",
  ],

  "Messaging & Streaming": [
    "Kafka",
    "RabbitMQ",
    "AWS SQS",
    "AWS SNS",
    "Redis Streams",
  ],

  Security: [
    "Authentication",
    "Authorization",
    "JWT",
    "OAuth",
    "OAuth 2.0",
    "SSO",
    "HTTPS",
    "CORS",
    "OWASP",
    "Encryption",
    "Hashing",
  ],

  "Operating Systems": ["Linux", "Ubuntu", "CentOS", "Windows", "macOS"],

  "AI / ML / Data": [
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "OpenCV",
  ],

  "Dev Tools & Build": [
    "Vite",
    "Webpack",
    "Babel",
    "ESLint",
    "Prettier",
    "npm",
    "yarn",
    "pnpm",
  ],

  Methodologies: ["Agile", "Scrum", "Kanban", "Waterfall", "SDLC"],

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

const normalize = (s) => s.trim().toLowerCase();

const groupSkills = (skills = []) => {
  const grouped = {};
  const used = new Set();

  for (const [category, categorySkills] of Object.entries(SKILL_CATEGORIES)) {
    const normalizedCategorySkills = categorySkills.map(normalize);

    const matched = skills.filter((skill) =>
      normalizedCategorySkills.includes(normalize(skill))
    );

    if (matched.length > 0) {
      grouped[category] = matched;
      matched.forEach((s) => used.add(normalize(s)));
    }
  }

  // Remaining skills → Other
  const others = skills.filter((s) => !used.has(normalize(s)));

  if (others.length > 0) {
    grouped["Other"] = others;
  }

  return grouped;
};

const renderGroupedSkills = (skills = [], config) => {
  const groupedSkills = groupSkills(skills);

  return Object.entries(groupedSkills).map(([category, items]) => (
    <div
      key={category}
      style={{
        marginBottom: `${config.spacing.itemGap}px`,
      }}
    >
      {/* Category */}
      <div
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
            {data.skills?.length > 0 && (
              <section>
                <SectionTitle title="Skills" config={config} />
                {renderGroupedSkills(data.skills, config)}
              </section>
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
