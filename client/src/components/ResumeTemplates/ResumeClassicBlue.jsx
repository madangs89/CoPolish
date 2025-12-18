import React from "react";

const SectionTitle = ({ title, settings }) => (
  <div style={{ marginTop: 18 }}>
    <h2
      style={{
        fontSize: settings.fontSizes.section,
        fontWeight: "bold",
        color: settings.primaryColor,
        marginBottom: 4,
        textTransform: "uppercase",
      }}
    >
      {title}
    </h2>
    <hr
      style={{
        border: `1px solid ${settings.primaryColor}`,
        marginBottom: 8,
      }}
    />
  </div>
);

const ResumeClassicBlue = ({ data, settings }) => {
  const { fontSizes, primaryColor, textColor } = settings;

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        background: "#ffffff",
        padding: settings.margin,
        fontFamily: settings.fontFamily,
        color: textColor,
        boxSizing: "border-box",
      }}
    >
      {/* ================= HEADER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: fontSizes.name,
              color: primaryColor,
              margin: 0,
              fontWeight: "bold",
            }}
          >
            {data.personal.name}
          </h1>

          <p style={{ fontWeight: "bold", margin: "4px 0" }}>
            {data.personal.title}
          </p>

          <p style={{ fontSize: fontSizes.body, margin: "2px 0" }}>
            {data.personal.address}
          </p>

          <p style={{ fontSize: fontSizes.body, margin: "2px 0" }}>
            {data.personal.phone} | {data.personal.email}
          </p>
        </div>

        {data.personal.avatar && (
          <img
            src={data.personal.avatar}
            alt="profile"
            style={{
              width: settings.photo.width,
              height: settings.photo.height,
              objectFit: "cover",
              borderRadius: settings.photo.borderRadius,
            }}
          />
        )}
      </div>

      {/* ================= SUMMARY ================= */}
      {data.personal.summary && (
        <>
          <SectionTitle title="Summary" settings={settings} />
          <p style={{ fontSize: fontSizes.body }}>{data.personal.summary}</p>
        </>
      )}

      {/* ================= EXPERIENCE ================= */}
      {data.experience?.length > 0 && (
        <>
          <SectionTitle title="Professional Experience" settings={settings} />

          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong style={{ fontSize: fontSizes.body }}>
                  {exp.role}, {exp.company}
                </strong>
                <span style={{ fontSize: fontSizes.body }}>{exp.duration}</span>
              </div>

              <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                {exp.description.map((d, j) => (
                  <li key={j} style={{ fontSize: fontSizes.body }}>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {/* ================= EDUCATION ================= */}
      {data.education?.length > 0 && (
        <>
          <SectionTitle title="Education" settings={settings} />

          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong style={{ fontSize: fontSizes.body }}>
                  {edu.degree}
                </strong>
                <span style={{ fontSize: fontSizes.body }}>
                  {edu.from} – {edu.to}
                </span>
              </div>

              <p
                style={{
                  fontSize: fontSizes.body,
                  margin: "2px 0",
                }}
              >
                {edu.institute}
              </p>
            </div>
          ))}
        </>
      )}

      {/* ================= SKILLS ================= */}
      {data.skills?.length > 0 && (
        <>
          <SectionTitle title="Technical Skills" settings={settings} />

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: fontSizes.body,
            }}
          >
            {data.skills.map((skill, i) => (
              <div key={i} style={{ width: "33%", marginBottom: 4 }}>
                {skill}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= ADDITIONAL INFORMATION ================= */}
      {(data.certifications?.length > 0 ||
        data.achievements?.length > 0 ||
        data.hobbies?.length > 0) && (
        <>
          <SectionTitle title="Additional Information" settings={settings} />

          <ul style={{ paddingLeft: 18, fontSize: fontSizes.body }}>
            {data.hobbies?.length > 0 && (
              <li>
                <strong>Languages:</strong> {data.hobbies.join(", ")}
              </li>
            )}

            {data.certifications?.length > 0 && (
              <li>
                <strong>Certificates:</strong>{" "}
                {data.certifications.map((c) => c.name).join(", ")}
              </li>
            )}

            {data.achievements?.length > 0 && (
              <li>
                <strong>Awards/Activities:</strong>{" "}
                {data.achievements.join(", ")}
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ResumeClassicBlue;
