import React from "react";

/* ================= THEME ================= */

const harvardTheme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "36px",
    background: "#ffffff",
  },

  colors: {
    text: "#000000",
    muted: "#000000",
    line: "#000000",
  },

  fonts: {
    heading: "Times New Roman, serif",
    body: "Times New Roman, serif",
  },

  fontSizes: {
    name: "22px",
    section: "14px",
    body: "12px",
    small: "12px",
  },
};

/* ================= COMPONENTS ================= */

const SectionTitle = ({ title }) => (
  <div style={{ marginTop: "18px", marginBottom: "6px" }}>
    <h2
      style={{
        fontSize: harvardTheme.fontSizes.section,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: "2px",
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: "1px",
        background: harvardTheme.colors.line,
      }}
    />
  </div>
);

/* ================= TEMPLATE ================= */

const HarvardResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: harvardTheme.page.width,
        minHeight: harvardTheme.page.minHeight,
        padding: harvardTheme.page.padding,
        background: harvardTheme.page.background,
        fontFamily: harvardTheme.fonts.body,
        color: harvardTheme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.35,
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
        <h1
          style={{
            fontSize: harvardTheme.fontSizes.name,
            fontWeight: "bold",
            marginBottom: "4px",
          }}
        >
          {personal.name}
        </h1>

        <p style={{ fontSize: harvardTheme.fontSizes.small }}>
          {personal.address} &nbsp;|&nbsp; {personal.email} &nbsp;|&nbsp;{" "}
          {personal.phone}
        </p>
      </div>

      {/* ================= EDUCATION ================= */}
      <SectionTitle title="Education" />

      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>{edu.institute}</span>
            <span>{edu.to}</span>
          </div>
          <p>{edu.degree}</p>
        </div>
      ))}

      {/* ================= EXPERIENCE ================= */}
      <SectionTitle title="Experience" />

      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>{exp.company}</span>
            <span>{exp.duration}</span>
          </div>
          <p style={{ fontStyle: "italic" }}>{exp.role}</p>

          <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
            {exp.description.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* ================= PROJECTS ================= */}
      {data.projects?.length > 0 && (
        <>
          <SectionTitle title="Projects" />

          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <strong>{p.title}</strong>
              <ul style={{ paddingLeft: "18px", marginTop: "4px" }}>
                {p.description.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* ================= SKILLS ================= */}
      <SectionTitle title="Skills & Interests" />
      <p>
        <strong>Technical:</strong> {data.skills.join(", ")}
      </p>
    </div>
  );
};

export default HarvardResume;
