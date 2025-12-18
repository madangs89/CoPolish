import React from "react";

const Section = ({ title, color, children }) => (
  <section style={{ marginBottom: 18 }}>
    <h2
      style={{
        fontSize: 13,
        color,
        fontWeight: "bold",
        borderBottom: `2px solid ${color}`,
        paddingBottom: 4,
        marginBottom: 8,
        textTransform: "uppercase",
      }}
    >
      {title}
    </h2>
    {children}
  </section>
);

const ResumeClassicV2 = ({ data, settings }) => {
  const {
    fontFamily,
    primaryColor,
    textColor,
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
        padding: margin,
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: nameFontSize,
              margin: 0,
              color: primaryColor,
              fontWeight: "bold",
            }}
          >
            {data.personal.name}
          </h1>

          <p style={{ margin: "4px 0", fontWeight: "bold" }}>
            {data.personal.title}
          </p>

          <p style={{ fontSize: baseFontSize, margin: "4px 0" }}>
            {data.personal.address}
          </p>

          <p style={{ fontSize: baseFontSize, margin: "2px 0" }}>
            {data.personal.email} | {data.personal.phone}
          </p>

          {(data.personal.linkedin || data.personal.github) && (
            <p style={{ fontSize: baseFontSize, margin: "2px 0" }}>
              {data.personal.linkedin}{" "}
              {data.personal.github && `| ${data.personal.github}`}
            </p>
          )}
        </div>

        {data.personal.avatar && (
          <img
            src={data.personal.avatar}
            alt="profile"
            style={{
              width: 90,
              height: 110,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        )}
      </header>

      {/* ================= SUMMARY ================= */}
      {data.personal.summary && (
        <Section title="Summary" color={primaryColor}>
          <p style={{ fontSize: baseFontSize, margin: 0 }}>
            {data.personal.summary}
          </p>
        </Section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {data.experience?.length > 0 && (
        <Section title="Professional Experience" color={primaryColor}>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong style={{ fontSize: baseFontSize }}>
                  {exp.role}, {exp.company}
                </strong>
                <span style={{ fontSize: baseFontSize }}>{exp.duration}</span>
              </div>

              <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                {exp.description.map((d, j) => (
                  <li key={j} style={{ fontSize: baseFontSize }}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* ================= PROJECTS ================= */}
      {data.projects?.length > 0 && (
        <Section title="Projects" color={primaryColor}>
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: baseFontSize }}>{p.title}</strong>
              <ul style={{ paddingLeft: 18 }}>
                {p.description.map((d, j) => (
                  <li key={j} style={{ fontSize: baseFontSize }}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* ================= EDUCATION ================= */}
      {data.education?.length > 0 && (
        <Section title="Education" color={primaryColor}>
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: baseFontSize }}>{e.degree}</strong>
              <div style={{ fontSize: baseFontSize }}>
                {e.institute} | {e.from} – {e.to}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ================= SKILLS ================= */}
      {data.skills?.length > 0 && (
        <Section title="Technical Skills" color={primaryColor}>
          <p style={{ fontSize: baseFontSize }}>{data.skills.join(" • ")}</p>
        </Section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {data.certifications?.length > 0 && (
        <Section title="Certifications" color={primaryColor}>
          <ul style={{ paddingLeft: 18 }}>
            {data.certifications.map((c, i) => (
              <li key={i} style={{ fontSize: baseFontSize }}>
                {c.name} – {c.issuer} ({c.year})
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ================= ACHIEVEMENTS ================= */}
      {data.achievements?.length > 0 && (
        <Section title="Achievements" color={primaryColor}>
          <ul style={{ paddingLeft: 18 }}>
            {data.achievements.map((a, i) => (
              <li key={i} style={{ fontSize: baseFontSize }}>
                {a}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ================= EXTRACURRICULAR ================= */}
      {data.extracurricular?.length > 0 && (
        <Section title="Extracurricular Activities" color={primaryColor}>
          {data.extracurricular.map((e, i) => (
            <p key={i} style={{ fontSize: baseFontSize }}>
              <strong>{e.role}</strong> – {e.activity} ({e.year})
            </p>
          ))}
        </Section>
      )}

      {/* ================= HOBBIES ================= */}
      {data.hobbies?.length > 0 && (
        <Section title="Hobbies & Interests" color={primaryColor}>
          <p style={{ fontSize: baseFontSize }}>{data.hobbies.join(", ")}</p>
        </Section>
      )}
    </div>
  );
};

export default ResumeClassicV2;
