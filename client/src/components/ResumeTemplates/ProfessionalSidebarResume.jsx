import React from "react";

const theme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: "#ffffff",
  },
  sidebar: {
    width: "260px",
    background: "#f3f4f6",
    padding: "32px",
  },
  main: {
    padding: "32px",
  },
  colors: {
    primary: "#111827",
    accent: "#2563eb",
    text: "#1f2937",
    muted: "#6b7280",
    line: "#e5e7eb",
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  fontSizes: {
    name: "24px",
    section: "13px",
    body: "13px",
    small: "12px",
  },
};

const SidebarSectionTitle = ({ title }) => (
  <div style={{ marginTop: "20px", marginBottom: "10px" }}>
    <h3
      style={{
        fontSize: theme.fontSizes.section,
        fontWeight: 700,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: theme.colors.primary,
        marginBottom: "6px",
      }}
    >
      {title}
    </h3>
    <div style={{ height: "1px", background: theme.colors.line }} />
  </div>
);

const SidebarLink = ({ href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "block",
      fontSize: theme.fontSizes.small,
      color: theme.colors.accent,
      textDecoration: "none",
      marginBottom: "6px",
    }}
  >
    {text}
  </a>
);

const ProfessionalSidebarResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: theme.page.width,
        minHeight: theme.page.minHeight,
        display: "flex",
        background: theme.page.background,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        boxSizing: "border-box",
        boxShadow: "0 0 0 1px #e5e7eb",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: theme.sidebar.width,
          background: theme.sidebar.background,
          padding: theme.sidebar.padding,
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: theme.fontSizes.name,
            fontWeight: 800,
            marginBottom: "4px",
          }}
        >
          {personal.name}
        </h1>

        <p
          style={{
            fontSize: theme.fontSizes.small,
            color: theme.colors.muted,
            marginBottomBottom: "16px",
          }}
        >
          {personal.title}
        </p>

        <SidebarSectionTitle title="Contact" />
        <SidebarLink href={`mailto:${personal.email}`} text={personal.email} />
        <SidebarLink href={`tel:${personal.phone}`} text={personal.phone} />
        <SidebarLink href={`https://${personal.github}`} text="GitHub" />
        <SidebarLink href={`https://${personal.linkedin}`} text="LinkedIn" />

        <SidebarSectionTitle title="Skills" />
        {data.skills.map((skill, i) => (
          <div
            key={i}
            style={{
              fontSize: theme.fontSizes.small,
              marginBottom: "6px",
            }}
          >
            {skill}
          </div>
        ))}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          flex: 1,
          padding: theme.main.padding,
          boxSizing: "border-box",
          lineHeight: 1.55,
        }}
      >
        <SidebarSectionTitle title="Summary" />
        <p>{personal.summary}</p>

        <SidebarSectionTitle title="Experience" />
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: "16px" }}>
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
              <span style={{ color: theme.colors.muted }}>
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

        <SidebarSectionTitle title="Projects" />
        {data.projects.map((p, i) => (
          <div key={i} style={{ marginBottom: "14px" }}>
            <strong>{p.title}</strong>
            <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
              {p.description.map((d, j) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
          </div>
        ))}

        <SidebarSectionTitle title="Education" />
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>{edu.degree}</strong>
              <span style={{ color: theme.colors.muted }}>
                {edu.from} – {edu.to}
              </span>
            </div>
            <p>{edu.institute}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSidebarResume;
