import React from "react";

const ResumeClassicV1 = () => {
  return (
    <div
      id="resume-a4"
      style={{
        background: "#ffffff",
        color: "#000000",
        padding: "40px",
        boxSizing: "border-box",
        fontFamily: "Calibri, Arial, sans-serif",
      }}

      className="w-[100%] h-full bg-white rounded-lg mx-auto border"
    >
      {/* ================= HEADER ================= */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", margin: "0 0 6px 0" }}>
          Rahul Sharma
        </h1>
        <p style={{ margin: 0, fontSize: "12px" }}>
          Software Engineer
        </p>
        <p style={{ margin: "6px 0 0 0", fontSize: "11px" }}>
          rahul.sharma@email.com | +91 98765 43210 | Bengaluru, India
        </p>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px" }}>
          LinkedIn: linkedin.com/in/rahulsharma | GitHub: github.com/rahulsharma
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "6px" }}>
          Professional Summary
        </h2>
        <p style={{ fontSize: "11px", margin: 0 }}>
          Results-driven Software Engineer with 3+ years of experience in
          building scalable web applications using React, Node.js, and MongoDB.
          Strong problem-solving skills with a focus on performance,
          maintainability, and clean architecture.
        </p>
      </div>

      {/* ================= EXPERIENCE ================= */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "6px" }}>
          Work Experience
        </h2>

        <p style={{ fontSize: "11px", fontWeight: "bold", margin: 0 }}>
          Software Engineer – TechNova Solutions
        </p>
        <p style={{ fontSize: "10.5px", margin: "2px 0 6px 0" }}>
          July 2021 – Present | Bengaluru, India
        </p>
        <ul style={{ fontSize: "11px", paddingLeft: "18px", margin: 0 }}>
          <li>
            Developed and maintained scalable REST APIs using Node.js and
            Express.
          </li>
          <li>
            Improved application performance by 30% by optimizing database
            queries.
          </li>
          <li>
            Collaborated with cross-functional teams to deliver features on
            time.
          </li>
        </ul>
      </div>

      {/* ================= PROJECTS ================= */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "6px" }}>
          Projects
        </h2>

        <p style={{ fontSize: "11px", fontWeight: "bold", margin: 0 }}>
          Resume Optimization Platform
        </p>
        <ul style={{ fontSize: "11px", paddingLeft: "18px", margin: 0 }}>
          <li>
            Built a MERN stack application that analyzes resumes for ATS
            compatibility.
          </li>
          <li>
            Integrated AI-based keyword matching to improve recruiter visibility.
          </li>
        </ul>
      </div>

      {/* ================= SKILLS ================= */}
      <div style={{ marginBottom: "18px" }}>
        <h2 style={{ fontSize: "14px", marginBottom: "6px" }}>
          Skills
        </h2>
        <p style={{ fontSize: "11px", margin: 0 }}>
          JavaScript, TypeScript, React, Node.js, Express, MongoDB, REST APIs,
          HTML, CSS, Git, Docker
        </p>
      </div>

      {/* ================= EDUCATION ================= */}
      <div>
        <h2 style={{ fontSize: "14px", marginBottom: "6px" }}>
          Education
        </h2>
        <p style={{ fontSize: "11px", margin: 0 }}>
          Bachelor of Engineering in Computer Science
        </p>
        <p style={{ fontSize: "10.5px", margin: "2px 0 0 0" }}>
          ABC Institute of Technology | 2017 – 2021
        </p>
      </div>
    </div>
  );
};

export default ResumeClassicV1;
