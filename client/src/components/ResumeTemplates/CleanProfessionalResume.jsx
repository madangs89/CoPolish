import React from "react";

const cleanTheme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "36px",
    background: "#ffffff",
  },

  colors: {
    primary: "#0f172a",   // slate-900
    accent: "#2563eb",    // blue-600
    text: "#111827",
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

/* ================= UTIL COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <div style={{ marginTop: "26px", marginBottom: "10px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <h2
        style={{
          fontSize: cleanTheme.fontSizes.section,
          fontWeight: 700,
          color: cleanTheme.colors.primary,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
          margin: 0,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          height: "1px",
          background: cleanTheme.colors.line,
          width: "100%",
        }}
      />
    </div>
  </div>
);

const LinkItem = ({ href, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      color: cleanTheme.colors.accent,
      textDecoration: "none",
      fontSize: cleanTheme.fontSizes.small,
    }}
  >
    {text}
  </a>
);

/* ================= TEMPLATE ================= */

const CleanProfessionalResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: cleanTheme.page.width,
        minHeight: cleanTheme.page.minHeight,
        padding: cleanTheme.page.padding,
        background: cleanTheme.page.background,
        fontFamily: cleanTheme.fonts.body,
        color: cleanTheme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.55,
        boxShadow: "0 0 0 1px #e5e7eb",
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: cleanTheme.fontSizes.name,
            fontWeight: 800,
            color: cleanTheme.colors.primary,
            marginBottom: "6px",
          }}
        >
          {personal.name}
        </h1>

        <p
          style={{
            fontSize: cleanTheme.fontSizes.body,
            color: cleanTheme.colors.muted,
            marginBottom: "10px",
          }}
        >
          {personal.title} · {personal.address}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
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
      <p>{personal.summary}</p>

      {/* ================= EXPERIENCE ================= */}
      <SectionTitle title="Experience" />

      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "18px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            <span>
              {exp.role} · {exp.company}
            </span>
            <span style={{ color: cleanTheme.colors.muted }}>
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
        <div key={i} style={{ marginBottom: "16px" }}>
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {data.skills.map((skill, i) => (
          <span
            key={i}
            style={{
              fontSize: cleanTheme.fontSizes.small,
              padding: "6px 10px",
              background: "#f8fafc",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* ================= EDUCATION ================= */}
      <SectionTitle title="Education" />

      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 600,
            }}
          >
            <span>{edu.degree}</span>
            <span style={{ color: cleanTheme.colors.muted }}>
              {edu.from} – {edu.to}
            </span>
          </div>
          <p>{edu.institute}</p>
        </div>
      ))}
    </div>
  );
};

export default CleanProfessionalResume;
