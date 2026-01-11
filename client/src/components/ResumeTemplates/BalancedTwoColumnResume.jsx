import React from "react";

/* ================= THEME ================= */

const balancedTheme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "36px",
    background: "#ffffff",
  },

  colors: {
    primary: "#111827",
    accent: "#2563eb",
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },

  fonts: {
    heading: "Inter, system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },

  fontSizes: {
    name: "30px",
    section: "15px",
    body: "14px",
    small: "13px",
  },
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <h2
    style={{
      fontSize: balancedTheme.fontSizes.section,
      fontWeight: 700,
      marginBottom: "10px",
      color: balancedTheme.colors.primary,
    }}
  >
    {title}
  </h2>
);

const LinkItem = ({ href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: balancedTheme.colors.accent,
      textDecoration: "none",
      fontSize: balancedTheme.fontSizes.small,
      display: "block",
      marginBottom: "6px",
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const BalancedTwoColumnResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: balancedTheme.page.width,
        minHeight: balancedTheme.page.minHeight,
        padding: balancedTheme.page.padding,
        background: balancedTheme.page.background,
        fontFamily: balancedTheme.fonts.body,
        color: balancedTheme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.55,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: balancedTheme.fontSizes.name,
            fontWeight: 800,
            marginBottom: "6px",
          }}
        >
          {personal.name}
        </h1>

        <p
          style={{
            fontSize: balancedTheme.fontSizes.body,
            color: balancedTheme.colors.muted,
            marginBottom: "10px",
          }}
        >
          {personal.title} · {personal.address}
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <LinkItem href={`mailto:${personal.email}`} text={personal.email} />
          <LinkItem href={`tel:${personal.phone}`} text={personal.phone} />
          <LinkItem href={`https://${personal.github}`} text="GitHub" />
          <LinkItem href={`https://${personal.linkedin}`} text="LinkedIn" />
        </div>
      </div>

      {/* ================= INTRO ================= */}
      <p style={{ marginBottom: "32px" }}>{personal.summary}</p>

      {/* ================= TWO COLUMN BODY ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "36px",
        }}
      >
        {/* ===== LEFT COLUMN ===== */}
        <div>
          <SectionTitle title="Work Experience" />

          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: "18px" }}>
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
                <span style={{ color: balancedTheme.colors.muted }}>
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

          <SectionTitle title="Projects" />

          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <strong>{p.title}</strong>
              <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                {p.description.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div>
          <SectionTitle title="Education" />

          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <strong>{edu.degree}</strong>
              <p style={{ color: balancedTheme.colors.muted }}>
                {edu.institute}
              </p>
              <p style={{ color: balancedTheme.colors.muted }}>
                {edu.from} – {edu.to}
              </p>
            </div>
          ))}

          <SectionTitle title="Skills" />

          {data.skills.map((skill, i) => (
            <div
              key={i}
              style={{
                fontSize: balancedTheme.fontSizes.small,
                marginBottom: "6px",
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BalancedTwoColumnResume;
