import { useEffect, useRef, useState } from "react";
import ResumeClassicV1 from "../ResumeTemplates/ResumeClassicV1";
import ResumeClassicV2 from "../ResumeTemplates/ResumeClassicV2";
import ResumeClassicBlue from "../ResumeTemplates/ResumeClassicBlue";

const ResumePreview = () => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const containerWidth = entry.contentRect.width;
      const resumeWidth = 794; // A4 width

      const newScale = Math.min(containerWidth / resumeWidth, 1);
      setScale(newScale);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const resumeSettings = {
    fontFamily: "Calibri, Arial, sans-serif",
    primaryColor: "#2563eb",
    textColor: "#000000",

    fontSizes: {
      name: 26,
      section: 13,
      body: 11,
      small: 10.5,
    },

    margin: 40,

    photo: {
      width: 90,
      height: 110,
      borderRadius: 2,
    },
  };

  const resumeData = {
    personal: {
      name: "Rahul Sharma",
      title: "Software Engineer",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      address: "Bengaluru, India",
      summary:
        "Results-driven Software Engineer with 3+ years of experience building scalable web applications using React, Node.js, and MongoDB. Strong focus on performance, maintainability, and clean architecture.",
      github: "github.com/rahulsharma",
      linkedin: "linkedin.com/in/rahulsharma",
    },

    experience: [
      {
        role: "Software Engineer",
        company: "TechNova Solutions",
        duration: "July 2021 – Present",
        description: [
          "Developed and maintained scalable REST APIs using Node.js and Express.",
          "Improved application performance by 30% through database query optimization.",
          "Collaborated with cross-functional teams to deliver features on time.",
        ],
      },
    ],

    projects: [
      {
        title: "Resume Optimization Platform",
        description: [
          "Built a MERN stack application to analyze resumes for ATS compatibility.",
          "Integrated AI-based keyword matching to improve recruiter visibility.",
        ],
      },
    ],

    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "HTML",
      "CSS",
      "Git",
      "Docker",
    ],

    education: [
      {
        degree: "Bachelor of Engineering in Computer Science",
        institute: "ABC Institute of Technology",
        from: "2017",
        to: "2021",
      },
    ],
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex bg-[#f2f3f5] p-2 justify-center items-start overflow-hidden"
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <ResumeClassicBlue data={resumeData} settings={resumeSettings} />
      </div>
    </div>
  );
};

export default ResumePreview;
