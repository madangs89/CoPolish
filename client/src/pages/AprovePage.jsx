import React, { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import renderSection from "../components/renderSection";

/* -------------------- CONFIG -------------------- */

const sectionsOrder = [
  "personal",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "achievements",
  "hobbies",
  "extracurricular",
  "preview",
];

const sectionTitles = {
  personal: "Personal Details",
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
  hobbies: "Hobbies",
  extracurricular: "Extracurricular",
  preview: "Preview",
};

/* -------------------- PAGE -------------------- */

const ApprovePage = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [approved, setApproved] = useState({});

  const [resumeData, setResumeData] = useState({
    personal: {
      name: "John Doe",
      title: "Frontend Developer",
      email: "john@email.com",
      phone: "+91 9876543210",
      summary: "Frontend developer with experience in React and UI design.",
      github: "https://github.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      address: "123 Main St, Anytown, USA",
    },
    education: [
      {
        degree: "B.Tech Computer Science",
        institute: "ABC University",
        from: "2020",
        to: "2024",
      },
      {
        degree: "B.Tech Computer Science",
        institute: "ABC University",
        from: "2020",
        to: "2024",
      },
      {
        degree: "B.Tech Computer Science",
        institute: "ABC University",
        from: "2020 ",
        to: "2024",
      },
    ],
    experience: [
      {
        role: "Frontend Intern",
        company: "XYZ Corp",
        duration: "2023",
        description: [
          "Worked on UI components using React.",
          "Worked on UI components using React.",
        ],
      },
      {
        role: "Frontend Intern",
        company: "XYZ Corp",
        duration: "2023",
        description: [
          "Worked on UI components using React.",
          "Worked on UI components using React.",
        ],
      },
      {
        role: "Frontend Intern",
        company: "XYZ Corp",
        duration: "2023",
        description: [
          "Worked on UI components using React.",
          "Worked on UI components using React.",
        ],
      },
    ],
    skills: ["React", "JavaScript", "Tailwind CSS"],
    projects: [
      {
        title: "Resume Analyzer",
        description: [
          "Built AI-powered resume parser using MERN stack",
          "Improved ATS match score by 30%",
        ],
        technologies: ["React", "Node.js", "MongoDB"],
        link: "https://github.com/username/project",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        year: "2023",
        credentialUrl: "https://...",
      },
    ],
    achievements: [
      "Top 5% in LeetCode contests",
      "Winner – Hackathon XYZ 2023",
    ],
    hobbies: ["Reading", "Open-source contribution", "Public speaking"],
    extracurricular: [
      {
        role: "Technical Lead",
        activity: "College Coding Club",
        year: "2022 – 2023",
        description: "Organized weekly coding sessions and hackathons",
      },
    ],
  });

  const handleApprove = () => {
    setApproved((prev) => ({ ...prev, [activeSection]: true }));

    const idx = sectionsOrder.indexOf(activeSection);
    if (idx < sectionsOrder.length - 1) {
      setActiveSection(sectionsOrder[idx + 1]);
    }
  };

  const handleGoBack = () => {
    const index = sectionsOrder.indexOf(activeSection);
    if (index >= 1) {
      setActiveSection(sectionsOrder[index - 1]);
    }
  };

  return (
    <div className="h-screen overflow-scroll bg-[#f8f9fb] py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1f2430]">
            Review & Approve Resume
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-2">
            Review each section. You stay in full control.
          </p>
        </div>

        {/* SECTION CONTAINER */}
        <div className="bg-white rounded-3xl  border p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            {sectionTitles[activeSection]}
          </h2>

          {renderSection(activeSection, resumeData, setResumeData)}

          <div
            className={`w-full flex gap-3 mt-2 md:mt-6 md:flex-row flex-col  py-2 md:border-none ${
              sectionsOrder.indexOf(activeSection) >= 1
                ? "justify-between"
                : "justify-end"
            }`}
          >
            {/* GO BACK */}
            {activeSection && sectionsOrder.indexOf(activeSection) >= 1 && (
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 rounded-full
                   border border-slate-300 bg-white text-slate-700
                   px-6 py-2 text-sm font-medium
                   hover:bg-slate-50 transition"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            )}

            {/* APPROVE / FINAL CTA */}
            {activeSection !== "preview" ? (
              <button
                onClick={handleApprove}
                className=" inline-flex items-center gap-2 rounded-full
                 bg-black text-white
                 px-6 py-2 text-sm font-medium
                 transition"
              >
                <CheckCircle size={16} />
                Approve & Continue
              </button>
            ) : (
              <button
                className=" inline-flex items-center gap-2 rounded-full
                 bg-gradient-to-r from-indigo-600 to-violet-600
                 text-white px-7 py-2.5 text-sm font-semibold
                 shadow-md hover:shadow-lg transition"
              >
                <CheckCircle size={16} />
                Enhance Your Chances
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePage;
