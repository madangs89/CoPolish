import React from "react";

const ResumeClassicV1 = ({ data, settings }) => {
  const {
    fontFamily,
    textColor,
    headingColor,
    baseFontSize,
    headingFontSize,
    nameFontSize,
    margin,
  } = settings;

  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        background: "#ffffff",
        color: textColor,
        padding: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        boxSizing: "border-box",
        fontFamily,
      }}
      className="border bg-white"
    >
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: nameFontSize, margin: "0 0 4px 0" }}>
          {data.personal.name}
        </h1>

        <p style={{ fontSize: baseFontSize + 1, margin: 0 }}>
          {data.personal.title}
        </p>

        <p style={{ fontSize: baseFontSize, margin: "6px 0 0 0" }}>
          {data.personal.email} | {data.personal.phone} |{" "}
          {data.personal.address}
        </p>

        <p style={{ fontSize: baseFontSize, margin: "2px 0 0 0" }}>
          LinkedIn: {data.personal.linkedin} | GitHub: {data.personal.github}
        </p>
      </div>

      {/* ===== SUMMARY ===== */}
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: headingFontSize, color: headingColor }}>
          Professional Summary
        </h2>
        <p style={{ fontSize: baseFontSize, margin: 0 }}>
          {data.personal.summary}
        </p>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: headingFontSize, color: headingColor }}>
          Work Experience
        </h2>

        {data.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <p
              style={{ fontSize: baseFontSize, fontWeight: "bold", margin: 0 }}
            >
              {exp.role} – {exp.company}
            </p>

            <p style={{ fontSize: baseFontSize - 0.5, margin: "2px 0 6px 0" }}>
              {exp.duration}
            </p>

            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {exp.description.map((point, i) => (
                <li key={i} style={{ fontSize: baseFontSize }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ===== PROJECTS ===== */}
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: headingFontSize, color: headingColor }}>
          Projects
        </h2>

        {data.projects.map((proj, idx) => (
          <div key={idx}>
            <p
              style={{ fontSize: baseFontSize, fontWeight: "bold", margin: 0 }}
            >
              {proj.title}
            </p>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {proj.description.map((point, i) => (
                <li key={i} style={{ fontSize: baseFontSize }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* ===== SKILLS ===== */}
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: headingFontSize, color: headingColor }}>
          Skills
        </h2>
        <p style={{ fontSize: baseFontSize }}>{data.skills.join(", ")}</p>
      </section>

      {/* ===== EDUCATION ===== */}
      <section>
        <h2 style={{ fontSize: headingFontSize, color: headingColor }}>
          Education
        </h2>

        {data.education.map((edu, idx) => (
          <div key={idx}>
            <p style={{ fontSize: baseFontSize, margin: 0 }}>{edu.degree}</p>
            <p style={{ fontSize: baseFontSize - 0.5, margin: "2px 0 0 0" }}>
              {edu.institute} | {edu.from} – {edu.to}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResumeClassicV1;
