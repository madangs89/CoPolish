import React from "react";
import { Mail, Phone, Github, Linkedin } from "lucide-react";

const theme = {
  page: {
    width: "794px",
    minHeight: "1123px",
    padding: "36px",
    background: "#ffffff",
  },
  colors: {
    primary: "#3b1d5a",
    text: "#111111",
    muted: "#444",
    line: "#3b1d5a",
  },
  fonts: {
    heading: "Times New Roman, serif",
    body: "Times New Roman, serif",
  },
  fontSizes: {
    name: "28px",
    section: "15px",
    body: "14px",
    small: "13px",
  },
};

const SectionTitle = ({ title }) => (
  <div style={{ marginTop: "22px" }}>
    <h2
      style={{
        fontSize: theme.fontSizes.section,
        fontWeight: "bold",
        letterSpacing: "1px",
        color: theme.colors.primary,
        marginBottom: "4px",
        textTransform: "uppercase",
      }}
    >
      {title}
    </h2>
    <div
      style={{
        height: "1px",
        background: theme.colors.line,
        width: "100%",
      }}
    />
  </div>
);

const LinkItem = ({ href, icon: Icon, text }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: theme.colors.text,
      textDecoration: "none",
    }}
  >
    <Icon size={14} />
    <span>{text}</span>
  </a>
);

const DefaultResume = ({ data }) => {
  const { personal } = data;

  return (
    <div
      id="resume-export"
      style={{
        width: theme.page.width,
        minHeight: theme.page.minHeight,
        padding: theme.page.padding,
        background: theme.page.background,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        boxSizing: "border-box",
        lineHeight: 1.4,
      }}
    >
      {/* ================= HEADER ================= */}
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <h1
          style={{
            fontSize: theme.fontSizes.name,
            fontWeight: "bold",
            color: theme.colors.primary,
            marginBottom: "4px",
          }}
        >
          {personal.name}
        </h1>

        <p style={{ fontWeight: "bold", marginBottom: "6px" }}>
          {personal.title}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "14px",
            fontSize: theme.fontSizes.small,
          }}
        >
          <LinkItem
            icon={Mail}
            href={`mailto:${personal.email}`}
            text={personal.email}
          />
          <LinkItem
            icon={Phone}
            href={`tel:${personal.phone}`}
            text={personal.phone}
          />
          <LinkItem
            icon={Github}
            href={`https://${personal.github}`}
            text={personal.github}
          />
          <LinkItem
            icon={Linkedin}
            href={`https://${personal.linkedin}`}
            text={personal.linkedin}
          />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <SectionTitle title="Summary" />
      <p style={{ fontSize: theme.fontSizes.body }}>{personal.summary}</p>

      {/* ================= EXPERIENCE ================= */}
      <SectionTitle title="Professional Experience" />

      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: "14px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>
              {exp.role}, {exp.company}
            </span>
            <span>{exp.duration}</span>
          </div>

          <ol style={{ paddingLeft: "20px", marginTop: "6px" }}>
            {exp.description.map((d, j) => (
              <li key={j}>{d}</li>
            ))}
          </ol>
        </div>
      ))}

      {/* ================= PROJECTS ================= */}
      <SectionTitle title="Projects" />

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

      {/* ================= SKILLS ================= */}
      <SectionTitle title="Technical Skills" />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: theme.fontSizes.body,
        }}
      >
        {data.skills.map((skill, i) => (
          <div key={i} style={{ width: "33%", marginBottom: "4px" }}>
            {skill}
          </div>
        ))}
      </div>

      {/* ================= EDUCATION ================= */}
      <SectionTitle title="Education" />

      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{edu.degree}</strong>
            <span>
              {edu.from} – {edu.to}
            </span>
          </div>
          <p>{edu.institute}</p>
        </div>
      ))}
    </div>
  );
};

export default DefaultResume;
