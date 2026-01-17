const ResumePreview = ({ resumeData }) => {
  const {
    personal,
    education,
    experience,
    projects,
    certifications,
    achievements,
    extracurricular,
    hobbies,
    skills,
  } = resumeData;

  return (
    <div className="space-y-6">
      {/* ================= APPROVAL CONTEXT ================= */}
      <div className="rounded-xl border border-[#e6e6e6] bg-[#f8f9fb] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1f2430]">
              Parsed Resume Preview
            </h2>
            <p className="text-sm text-[#6b6b6b] mt-1">
              This is your resume as extracted from your input. Review and
              approve sections before AI enhancement.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full border bg-white text-[#6b6b6b]">
            Raw · Not Enhanced
          </span>
        </div>
      </div>

      {/* ================= RESUME BODY ================= */}
      <div className="bg-white p-10 rounded-xl shadow-sm text-sm text-black space-y-10">
        {/* ================= HEADER ================= */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{personal.name}</h1>
          <p className="font-medium text-gray-700">{personal.title}</p>

          <p className="text-xs mt-2 text-gray-600">
            {personal.email} · {personal.phone}
            {personal.linkedin && ` · ${personal.linkedin}`}
            {personal.github && ` · ${personal.github}`}
          </p>
        </div>

        {/* ================= SUMMARY ================= */}
        {personal.summary && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-2">Summary</h2>
            <p className="leading-relaxed">{personal.summary}</p>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {skills?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-2">Skills</h2>
            <p className="leading-relaxed">{skills.join(", ")}</p>
          </section>
        )}

        {/* ================= EXPERIENCE ================= */}
        {experience?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-4">Experience</h2>

            {experience.map((exp, idx) => (
              <div key={idx} className="mb-5">
                <div className="flex justify-between font-medium">
                  <span>
                    {exp.role} — {exp.company}
                  </span>
                  <span className="text-xs text-gray-500">{exp.duration}</span>
                </div>

                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {exp.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* ================= PROJECTS ================= */}
        {projects?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-4">Projects</h2>

            {projects.map((proj, idx) => (
              <div key={idx} className="mb-5">
                <div className="font-medium">{proj.title}</div>

                {/* PROJECT LINKS */}
                {proj.link?.length > 0 && (
                  <div className="flex flex-wrap gap-3 text-xs mt-1 text-gray-600">
                    {proj.link.map(
                      (l, i) =>
                        l?.url && (
                          <a
                            key={i}
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-black"
                          >
                            {l.title}
                          </a>
                        )
                    )}
                  </div>
                )}

                <ul className="list-disc ml-5 mt-2 space-y-1">
                  {proj.description.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>

                {proj.technologies?.length > 0 && (
                  <p className="text-xs mt-2 text-gray-700">
                    <strong>Tech:</strong> {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* ================= EDUCATION ================= */}
        {education?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-4">Education</h2>

            {education.map((edu, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between font-medium">
                  <span>{edu.degree}</span>
                  <span className="text-xs text-gray-500">
                    {edu.from} – {edu.to}
                  </span>
                </div>
                <p className="text-xs text-gray-700">{edu.institute}</p>
              </div>
            ))}
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-4">Certifications</h2>

            <ul className="list-disc ml-5 space-y-2">
              {certifications.map((c, i) => (
                <li key={i}>
                  <span className="font-medium">{c.name}</span> — {c.issuer} (
                  {c.year}){/* CERTIFICATION LINK */}
                  {c.link?.[0]?.url && (
                    <a
                      href={c.link[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-gray-600 underline mt-1"
                    >
                      {c.link[0].title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ================= ACHIEVEMENTS ================= */}
        {achievements?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-2">Achievements</h2>
            <ul className="list-disc ml-5 space-y-1">
              {achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ================= EXTRACURRICULAR ================= */}
        {extracurricular?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-4">
              Extra-Curricular Activities
            </h2>

            {extracurricular.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between font-medium">
                  <span>
                    {e.role} — {e.activity}
                  </span>
                  <span className="text-xs text-gray-500">{e.year}</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">{e.description}</p>
              </div>
            ))}
          </section>
        )}

        {/* ================= HOBBIES ================= */}
        {hobbies?.length > 0 && (
          <section>
            <h2 className="font-semibold border-b pb-1 mb-2">
              Hobbies & Interests
            </h2>
            <p>{hobbies.join(", ")}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
