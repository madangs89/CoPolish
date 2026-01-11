import React from "react";

const modernTheme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "32px",
    background: "#ffffff",
  },

  colors: {
    primary: "#111827", // near-black
    accent: "#2563eb", // blue
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },

  fonts: {
    heading: "Inter, system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },

  fontSizes: {
    name: "26px",
    section: "14px",
    body: "13.5px",
    small: "12.5px",
  },
};

const SectionTitle = ({ title }) => (
  <div style={{ marginTop: "20px" }}>
    <h2
      style={{
        fontSize: modernTheme.fontSizes.section,
        fontWeight: 700,
        color: modernTheme.colors.primary,
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
        background: modernTheme.colors.line,
      }}
    />
  </div>
);

const LinkItem = ({ href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: modernTheme.colors.accent,
      textDecoration: "none",
      fontSize: modernTheme.fontSizes.small,
    }}
  >
    {text}
  </a>
);

const ModernMinimalResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: modernTheme.page.width,
        minHeight: modernTheme.page.minHeight,
        padding: modernTheme.page.padding,
        background: modernTheme.page.background,
        fontFamily: modernTheme.fonts.body,
        color: modernTheme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.5,
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: "18px" }}>
        <h1
          style={{
            fontSize: modernTheme.fontSizes.name,
            fontWeight: 800,
            color: modernTheme.colors.primary,
            marginBottom: "2px",
          }}
        >
          {personal.name}
        </h1>

        <p
          style={{
            fontSize: modernTheme.fontSizes.body,
            color: modernTheme.colors.muted,
            marginBottom: "8px",
          }}
        >
          {personal.title} · {personal.address}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <LinkItem href={`mailto:${personal.email}`} text={personal.email} />
          <LinkItem href={`tel:${personal.phone}`} text={personal.phone} />
          <LinkItem href={`https://${personal.github}`} text="GitHub" />
          <LinkItem href={`https://${personal.linkedin}`} text="LinkedIn" />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <SectionTitle title="Summary" />
      <p style={{ fontSize: modernTheme.fontSizes.body }}>{personal.summary}</p>

      {/* ================= EXPERIENCE ================= */}
      <SectionTitle title="Experience" />

      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>
              {exp.role} — {exp.company}
            </strong>
            <span style={{ color: modernTheme.colors.muted }}>
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

      {/* ================= PROJECTS ================= */}
      <SectionTitle title="Projects" />

      {data.projects.map((p, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <strong>{p.title}</strong>
          <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
            {p.description.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* ================= SKILLS ================= */}
      <SectionTitle title="Skills" />

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {data.skills.map((skill, i) => (
          <span
            key={i}
            style={{
              fontSize: modernTheme.fontSizes.small,
              background: "#f3f4f6",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* ================= EDUCATION ================= */}
      <SectionTitle title="Education" />

      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{edu.degree}</strong>
            <span style={{ color: modernTheme.colors.muted }}>
              {edu.from} – {edu.to}
            </span>
          </div>
          <p>{edu.institute}</p>
        </div>
      ))}
    </div>
  );
};

export default ModernMinimalResume;
