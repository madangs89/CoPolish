import React from "react";

/* ================= THEME ================= */

const timelineTheme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "32px",
    background: "#ffffff",
  },

  colors: {
    primary: "#020617",   // slate-950
    accent: "#0ea5e9",    // sky-500
    text: "#111827",
    muted: "#6b7280",
    line: "#e5e7eb",
    dot: "#0ea5e9",
  },

  fonts: {
    heading: "Inter, system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },

  fontSizes: {
    name: "28px",
    section: "15px",
    body: "14px",
    small: "13px",
  },
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <h2
    style={{
      marginTop: "32px",
      marginBottom: "12px",
      fontSize: timelineTheme.fontSizes.section,
      fontWeight: 700,
      color: timelineTheme.colors.primary,
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    }}
  >
    {title}
  </h2>
);

/* ================= TEMPLATE ================= */

const CareerTimelineResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: timelineTheme.page.width,
        minHeight: timelineTheme.page.minHeight,
        padding: timelineTheme.page.padding,
        background: timelineTheme.page.background,
        fontFamily: timelineTheme.fonts.body,
        color: timelineTheme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.6,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* ================= HEADER BAND ================= */}
      <div
        style={{
          paddingBottom: "20px",
          borderBottom: `2px solid ${timelineTheme.colors.line}`,
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontSize: timelineTheme.fontSizes.name,
            fontWeight: 800,
            marginBottom: "6px",
            color: timelineTheme.colors.primary,
          }}
        >
          {personal.name}
        </h1>

        <p
          style={{
            fontSize: timelineTheme.fontSizes.body,
            color: timelineTheme.colors.muted,
            marginBottom: "8px",
          }}
        >
          {personal.title} · {personal.address}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            fontSize: timelineTheme.fontSizes.small,
          }}
        >
          <a href={`mailto:${personal.email}`}>{personal.email}</a>
          <a href={`tel:${personal.phone}`}>{personal.phone}</a>
          <a href={`https://${personal.github}`}>GitHub</a>
          <a href={`https://${personal.linkedin}`}>LinkedIn</a>
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <SectionTitle title="Profile" />
      <p>{personal.summary}</p>

      {/* ================= EXPERIENCE (TIMELINE) ================= */}
      <SectionTitle title="Career Timeline" />

      <div style={{ position: "relative", marginLeft: "14px" }}>
        {/* vertical line */}
        <div
          style={{
            position: "absolute",
            left: "6px",
            top: 0,
            bottom: 0,
            width: "2px",
            background: timelineTheme.colors.line,
          }}
        />

        {data.experience.map((exp, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            {/* dot */}
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: timelineTheme.colors.dot,
                marginTop: "6px",
                flexShrink: 0,
              }}
            />

            {/* content */}
            <div>
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
                <span style={{ color: timelineTheme.colors.muted }}>
                  {exp.duration}
                </span>
              </div>

              <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                {exp.description.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* ================= PROJECTS ================= */}
      <SectionTitle title="Selected Projects" />

      {data.projects.map((p, i) => (
        <div key={i} style={{ marginBottom: "18px" }}>
          <strong>{p.title}</strong>
          <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
            {p.description.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* ================= SKILLS ================= */}
      <SectionTitle title="Core Skills" />

      <p style={{ color: timelineTheme.colors.muted }}>
        {data.skills.join(" · ")}
      </p>

      {/* ================= EDUCATION ================= */}
      <SectionTitle title="Education" />

      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <strong>{edu.degree}</strong>{" "}
          <span style={{ color: timelineTheme.colors.muted }}>
            ({edu.from} – {edu.to})
          </span>
          <p>{edu.institute}</p>
        </div>
      ))}
    </div>
  );
};

export default CareerTimelineResume;
